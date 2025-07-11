import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, User, ChatMessage, AIAgent, AgentType } from '@/types';
import { parseVisualizationsFromMarkdown } from '@/utils/visualizationParser';
import { cleanMarkdownText } from '@/utils/visualizationParser';

interface AppContextType {
  state: AppState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  sendMessage: (message: string, agentType: AgentType) => Promise<void>;
  editMessage: (messageId: string, newText: string) => void;
  clearChat: () => void;
  toggleTheme: () => void;
  setCurrentAgent: (agent: AIAgent) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE' }
  | { type: 'SEND_MESSAGE_START' }
  | { type: 'SEND_MESSAGE_SUCCESS'; payload: ChatMessage }
  | { type: 'RECEIVE_MESSAGE'; payload: ChatMessage }
  | { type: 'SEND_MESSAGE_FAILURE' }
  | { type: 'EDIT_MESSAGE'; payload: { messageId: string; newText: string } }
  | { type: 'CLEAR_CHAT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_CURRENT_AGENT'; payload: AIAgent };

const initialState: AppState = {
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  },
  chat: {
    messages: [],
    currentAgent: null,
    isLoading: false,
  },
  theme: 'light',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        auth: { ...state.auth, isLoading: true },
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        auth: {
          user: action.payload,
          isAuthenticated: true,
          isLoading: false,
        },
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        auth: { ...state.auth, isLoading: false },
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: { user: null, isAuthenticated: false, isLoading: false },
        chat: { messages: [], currentAgent: null, isLoading: false },
      };
    case 'SEND_MESSAGE_START':
      return {
        ...state,
        chat: { ...state.chat, isLoading: true },
      };
    case 'SEND_MESSAGE_SUCCESS':
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, action.payload],
          isLoading: false,
        },
      };
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, action.payload],
          isLoading: false,
        },
      };
    case 'SEND_MESSAGE_FAILURE':
      return {
        ...state,
        chat: { ...state.chat, isLoading: false },
      };
    case 'EDIT_MESSAGE':
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: state.chat.messages.map(msg =>
            msg.id === action.payload.messageId
              ? { ...msg, text: action.payload.newText }
              : msg
          ),
        },
      };
    case 'CLEAR_CHAT':
      return {
        ...state,
        chat: { ...state.chat, messages: [] },
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    case 'SET_CURRENT_AGENT':
      return {
        ...state,
        chat: { ...state.chat, currentAgent: action.payload },
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user: User = {
        id: '1',
        email,
        name,
      };
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const sendMessage = async (message: string, agentType: AgentType) => {
    dispatch({ type: 'SEND_MESSAGE_START' });
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    
    dispatch({ type: 'SEND_MESSAGE_SUCCESS', payload: userMessage });

    try {
      const apiUrl = `https://agent-chat-dev.elevatics.site/${agentType}/chat/json`;
      const apiKey = process.env.EXPO_PUBLIC_API_KEY;
      
      console.log('API Request Details:');
      console.log('URL:', apiUrl);
      console.log('API Key exists:', !!apiKey);
      console.log('API Key length:', apiKey?.length || 0);
      console.log('Agent Type:', agentType);
      console.log('Message:', message);
      
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      };
      
      console.log('Headers:', headers);
      
      const body = JSON.stringify({
        message,
        timestamp: new Date().toISOString(),
      });
      
      console.log('Request Body:', body);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body,
      });

      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error Response Body:', errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      // Get the response text first
      const responseText = await response.text();
      console.log('Raw Response:', responseText);
      
      let aiResponseText = '';
      let visualizations = [];
      
      try {
        // Handle streaming response format
        const lines = responseText.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            // Extract content from token responses
            if (data.type === 'token' && data.content && 
                !data.content.includes('<response_factual>') && 
                !data.content.includes('</response_factual>')) {
              aiResponseText += data.content;
            }
          } catch (e) {
            // Skip invalid JSON lines
            continue;
          }
        }
        
        // Clean up the response text
        aiResponseText = aiResponseText.trim();
        
        // Parse tables and charts from markdown
        const cleanedText = cleanMarkdownText(aiResponseText);
        visualizations = parseVisualizationsFromMarkdown(cleanedText);
        
      } catch (error) {
        console.error('Error parsing response:', error);
        aiResponseText = 'Error parsing response';
      }
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: cleanMarkdownText(aiResponseText) || 'No response content received',
        isUser: false,
        timestamp: new Date(),
        visualizations: visualizations.length > 0 ? visualizations : undefined,
      };
      
      dispatch({ type: 'RECEIVE_MESSAGE', payload: aiMessage });
    } catch (error) {
      console.error('API Error:', error);
      dispatch({ type: 'SEND_MESSAGE_FAILURE' });
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      dispatch({ type: 'RECEIVE_MESSAGE', payload: errorMessage });
    }
  };

  const editMessage = (messageId: string, newText: string) => {
    dispatch({ type: 'EDIT_MESSAGE', payload: { messageId, newText } });
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setCurrentAgent = (agent: AIAgent) => {
    dispatch({ type: 'SET_CURRENT_AGENT', payload: agent });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        sendMessage,
        editMessage,
        clearChat,
        toggleTheme,
        setCurrentAgent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}