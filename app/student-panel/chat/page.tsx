"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStudent } from "@/hooks/useStudent";
import { useChatbot } from "@/hooks/useChatbot";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const { student } = useStudent();
  const { sendMessage, loading } = useChatbot();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Bana uygun burslar var mı?",
    "Nasıl burs başvurusu yapabilirim?",
    "Hangi belgeleri hazırlamalıyım?",
    "GPA'm yeterli mi?",
    "Başvuru süreci ne kadar sürer?",
    "Burs miktarları nedir?",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const result = await sendMessage({
        message: textToSend,
        conversationId,
        userId: user?.id,
        studentId: student?.id,
      });

      if (result.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.message,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setConversationId(result.conversationId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (confirm("Sohbeti temizlemek istediğinizden emin misiniz?")) {
      setMessages([]);
      setConversationId(null);
    }
  };

  return (
    <div className="container-fluid" style={{ height: "calc(100vh - 100px)" }}>
      <div className="row h-100">
        <div className="col-12">
          <div className="card h-100 shadow-sm">
            {/* Header */}
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <span className="me-3" style={{ fontSize: 32 }}>
                  🤖
                </span>
                <div>
                  <h5 className="mb-0">Burs Asistanı</h5>
                  <small style={{ opacity: 0.9 }}>
                    Size nasıl yardımcı olabilirim?
                  </small>
                </div>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="btn btn-light btn-sm"
                  disabled={loading}
                >
                  🗑️ Temizle
                </button>
              )}
            </div>

            {/* Messages Area */}
            <div
              className="card-body overflow-auto"
              style={{ height: "calc(100vh - 300px)" }}
            >
              {messages.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4" style={{ fontSize: 80 }}>
                    👋
                  </div>
                  <h3 className="mb-3">Merhaba!</h3>
                  <p className="text-muted mb-5">
                    Ben Burs Asistanı. Size uygun bursları bulmanıza,
                    <br />
                    başvuru süreçlerinde yardımcı olabilirim.
                  </p>

                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <h6 className="mb-3">Popüler Sorular:</h6>
                      <div className="d-grid gap-2">
                        {suggestedQuestions.map((q, i) => (
                          <button
                            key={i}
                            className="btn btn-outline-primary text-start"
                            onClick={() => handleSend(q)}
                          >
                            💡 {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-4 d-flex ${
                        msg.role === "user"
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                          style={{ width: 40, height: 40, fontSize: 20 }}
                        >
                          🤖
                        </div>
                      )}
                      <div
                        className={`rounded-3 p-3 ${
                          msg.role === "user"
                            ? "bg-primary text-white"
                            : "bg-light text-dark"
                        }`}
                        style={{ maxWidth: "70%" }}
                      >
                        <div style={{ whiteSpace: "pre-wrap", fontSize: 15 }}>
                          {msg.content}
                        </div>
                        <div
                          className="mt-2"
                          style={{
                            fontSize: 11,
                            opacity: 0.7,
                          }}
                        >
                          {new Date(msg.created_at).toLocaleString("tr-TR")}
                        </div>
                      </div>
                      {msg.role === "user" && (
                        <div
                          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center ms-3 flex-shrink-0"
                          style={{ width: 40, height: 40, fontSize: 18 }}
                        >
                          {student?.full_name?.charAt(0) || "👤"}
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="d-flex justify-content-start mb-4">
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                        style={{ width: 40, height: 40, fontSize: 20 }}
                      >
                        🤖
                      </div>
                      <div className="bg-light rounded-3 p-3">
                        <div className="d-flex gap-2">
                          <span
                            className="spinner-grow spinner-grow-sm"
                            style={{ width: 10, height: 10 }}
                          />
                          <span
                            className="spinner-grow spinner-grow-sm"
                            style={{ width: 10, height: 10 }}
                          />
                          <span
                            className="spinner-grow spinner-grow-sm"
                            style={{ width: 10, height: 10 }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="card-footer bg-light p-3">
              <div className="row g-2">
                <div className="col">
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Mesajınızı buraya yazın..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    style={{ resize: "none" }}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-muted">
                  <kbd>Enter</kbd> ile gönder • <kbd>Shift + Enter</kbd> ile yeni
                  satır
                </small>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>➤ Gönder</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

