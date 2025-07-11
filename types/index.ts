export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AIAgent {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  data?: any;
  visualizations?: Visualization[];
}

export interface Visualization {
  type: 'chart' | 'table' | 'image' | 'map';
  data: any;
  title?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  currentAgent: AIAgent | null;
  isLoading: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  auth: AuthState;
  chat: ChatState;
  theme: 'light' | 'dark';
}

export type AgentType = 'research' | 'medical' | 'finance' | 'deep-research' | 'business';