export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatRequest {
  message: string;
  context?: string;
}

export interface AiChatResponse {
  message: string;
  error?: string;
}

export interface AiCharacterDescriptionResponse {
  characterId: number;
  characterName: string;
  description: string;
  generatedAt: string;
  error?: string;
}
