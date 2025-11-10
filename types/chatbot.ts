// Chatbot Types

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  recommended_scholarships?: string[];
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string | null;
  title: string | null;
  student_context: Record<string, any> | null;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatbotRequest {
  message: string;
  conversation_id?: string;
  context?: {
    education_level?: string;
    gpa?: number;
    city?: string;
    preferences?: string[];
  };
}

export interface ChatbotResponse {
  reply: string;
  conversation_id: string;
  scholarships?: {
    id: string;
    title: string;
    organization: string;
    amount: number;
    match_score?: number;
  }[];
}

