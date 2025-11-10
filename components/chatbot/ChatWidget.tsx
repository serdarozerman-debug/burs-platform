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

export default function ChatWidget() {
  const { user } = useAuth();
  const { student } = useStudent();
  const { sendMessage, loading } = useChatbot();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Bana uygun burslar var mı?",
    "Nasıl burs başvurusu yapabilirim?",
    "Hangi belgeleri hazırlamalıyım?",
    "GPA'm yeterli mi?",
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

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="position-fixed bottom-0 end-0 m-4 btn btn-primary rounded-circle shadow-lg"
          style={{ width: 60, height: 60, zIndex: 1000 }}
        >
          <span style={{ fontSize: 24 }}>💬</span>
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div
          className="position-fixed bottom-0 end-0 m-4 bg-white rounded-3 shadow-lg"
          style={{
            width: 380,
            height: 600,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div className="bg-primary text-white p-3 rounded-top-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <span className="me-2" style={{ fontSize: 24 }}>
                🤖
              </span>
              <div>
                <h6 className="mb-0">Burs Asistanı</h6>
                <small style={{ opacity: 0.9 }}>Size nasıl yardımcı olabilirim?</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="btn btn-sm btn-light rounded-circle"
                  style={{ width: 32, height: 32, padding: 0 }}
                  title="Sohbeti temizle"
                >
                  🗑️
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-sm btn-light rounded-circle"
                style={{ width: 32, height: 32, padding: 0 }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-grow-1 p-3 overflow-auto"
            style={{ maxHeight: "calc(600px - 140px)" }}
          >
            {messages.length === 0 ? (
              <div className="text-center py-4">
                <div className="mb-3" style={{ fontSize: 48 }}>
                  👋
                </div>
                <h6>Merhaba!</h6>
                <p className="text-muted small mb-4">
                  Burs bulmanıza yardımcı olabilirim
                </p>
                <div className="d-grid gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      className="btn btn-outline-primary btn-sm text-start"
                      onClick={() => handleSend(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 d-flex ${
                    msg.role === "user" ? "justify-content-end" : "justify-content-start"
                  }`}
                >
                  <div
                    className={`rounded-3 p-2 px-3 ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-light text-dark"
                    }`}
                    style={{ maxWidth: "80%" }}
                  >
                    <div style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>
                      {msg.content}
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        fontSize: 10,
                        opacity: 0.7,
                      }}
                    >
                      {new Date(msg.created_at).toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="d-flex justify-content-start mb-3">
                <div className="bg-light rounded-3 p-2 px-3">
                  <div className="d-flex gap-1">
                    <span className="spinner-grow spinner-grow-sm" style={{ width: 8, height: 8 }} />
                    <span className="spinner-grow spinner-grow-sm" style={{ width: 8, height: 8 }} />
                    <span className="spinner-grow spinner-grow-sm" style={{ width: 8, height: 8 }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-top">
            <div className="d-flex gap-2">
              <textarea
                className="form-control"
                rows={2}
                placeholder="Mesajınızı yazın..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                style={{ resize: "none" }}
              />
              <button
                className="btn btn-primary"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                style={{ minWidth: 50 }}
              >
                <span style={{ fontSize: 20 }}>➤</span>
              </button>
            </div>
            <small className="text-muted d-block mt-2">
              Enter ile gönder • Shift+Enter ile yeni satır
            </small>
          </div>
        </div>
      )}
    </>
  );
}

