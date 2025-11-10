import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the chatbot
const SYSTEM_PROMPT = `Sen Türkiye'deki bir burs platformunun yapay zeka danışmanısın. Adın "Burs Asistanı".

Görevin:
1. Öğrencilere uygun bursları bulmalarında yardımcı olmak
2. Burs başvuru süreçleri hakkında bilgi vermek
3. Eğitim, kariyer ve finansal planlama konularında danışmanlık yapmak
4. Samimi, yardımsever ve profesyonel bir üslup kullanmak

Kurallar:
- Türkçe konuş
- Kısa ve öz cevaplar ver (mümkünse 2-3 paragraf)
- Bilmediğin şeyler hakkında tahmin yapma
- Öğrencilere motivasyon ver
- Emojiler kullanabilirsin ama abartma

NOT: Eğer kullanıcı bir burs arıyorsa, mevcut burslar arasından semantic search ile en uygun olanları öner.`;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId, userId, studentId } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get or create conversation
    let conversationUuid = conversationId;

    if (!conversationUuid) {
      // Create new conversation
      const { data: newConversation, error: convError } = await supabase
        .from("chatbot_conversations")
        .insert({
          user_id: userId,
          student_id: studentId,
          title: message.substring(0, 50),
          message_count: 0,
        })
        .select()
        .single();

      if (convError) throw convError;
      conversationUuid = newConversation.id;
    }

    // Get conversation history
    const { data: previousMessages } = await supabase
      .from("chatbot_messages")
      .select("role, content")
      .eq("conversation_id", conversationUuid)
      .order("created_at", { ascending: true })
      .limit(10); // Last 10 messages for context

    // Save user message
    await supabase.from("chatbot_messages").insert({
      conversation_id: conversationUuid,
      role: "user",
      content: message,
    });

    // Check if message is about finding scholarships
    const isScholarshipSearch = /burs|scholarship|ara|bul|öneri|öner/i.test(message);

    let scholarshipContext = "";
    if (isScholarshipSearch && studentId) {
      // Get student profile for better matching
      const { data: student } = await supabase
        .from("students")
        .select("university, department, gpa, education_level")
        .eq("id", studentId)
        .single();

      // Perform semantic search on scholarships
      // For now, simple search - in production use pgvector or similar
      const { data: scholarships } = await supabase
        .from("scholarships")
        .select("title, organization, amount, description, education_level, type")
        .eq("is_active", true)
        .limit(5);

      if (scholarships && scholarships.length > 0) {
        scholarshipContext = `\n\nMevcut Burslar:\n${scholarships
          .map(
            (s, i) =>
              `${i + 1}. ${s.title} - ${s.organization}\n   Miktar: ${s.amount?.toLocaleString("tr-TR")} ₺\n   Açıklama: ${s.description?.substring(0, 100)}...\n`
          )
          .join("\n")}`;
      }
    }

    // Build messages for OpenAI
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT + scholarshipContext },
    ];

    // Add conversation history
    if (previousMessages && previousMessages.length > 0) {
      previousMessages.forEach((msg: any) => {
        messages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        });
      });
    }

    // Add current message
    messages.push({ role: "user", content: message });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0]?.message?.content || "Üzgünüm, bir hata oluştu.";

    // Save assistant message
    await supabase.from("chatbot_messages").insert({
      conversation_id: conversationUuid,
      role: "assistant",
      content: assistantMessage,
    });

    // Update conversation message count
    await supabase
      .from("chatbot_conversations")
      .update({
        message_count: (previousMessages?.length || 0) + 2,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationUuid);

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      conversationId: conversationUuid,
    });
  } catch (error: any) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (conversationId) {
      // Get specific conversation messages
      const { data: messages, error } = await supabase
        .from("chatbot_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return NextResponse.json({ messages });
    } else {
      // Get all conversations for user
      const { data: conversations, error } = await supabase
        .from("chatbot_conversations")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      return NextResponse.json({ conversations });
    }
  } catch (error: any) {
    console.error("Chatbot GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE endpoint to clear conversation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID required" },
        { status: 400 }
      );
    }

    // Delete messages
    await supabase
      .from("chatbot_messages")
      .delete()
      .eq("conversation_id", conversationId);

    // Delete conversation
    const { error } = await supabase
      .from("chatbot_conversations")
      .delete()
      .eq("id", conversationId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Chatbot DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

