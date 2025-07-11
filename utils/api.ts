import { AgentType } from '@/types';

const API_BASE_URL = 'https://agent-chat-dev.elevatics.site';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export interface ApiResponse {
  response: string;
  data?: any;
  visualizations?: any[];
}

export const apiService = {
  async sendMessage(message: string, agentType: AgentType): Promise<ApiResponse> {
    try {
      console.log('API Service - Sending message:');
      console.log('Base URL:', API_BASE_URL);
      console.log('Agent Type:', agentType);
      console.log('API Key exists:', !!API_KEY);
      console.log('API Key preview:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT SET');
      
      const response = await fetch(`${API_BASE_URL}/${agentType}/chat/json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async authenticate(email: string, password: string) {
    // Mock authentication - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        id: '1',
        email,
        name: email.split('@')[0],
      },
      token: 'mock-token',
    };
  },

  async register(email: string, password: string, name: string) {
    // Mock registration - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        id: '1',
        email,
        name,
      },
      token: 'mock-token',
    };
  },
};