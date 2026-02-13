
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface BestieState {
  isTyping: boolean;
  chaoticLevel: number;
  mood: string;
}
