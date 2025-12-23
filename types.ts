
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  balance: number;
  bgmiId?: string;
  avatar?: string;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  type: 'SOLO' | 'DUO' | 'SQUAD';
  prizePool: number;
  entryFee: number;
  startTime: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  participants: number;
  maxParticipants: number;
  description: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PRIZE' | 'ENTRY_FEE';
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  timestamp: string;
  paymentMethod?: string;
}

export interface AntiCheatReport {
  id: string;
  userId: string;
  matchId: string;
  status: 'CLEAN' | 'SUSPICIOUS' | 'FLAGGED';
  analysis: string;
  timestamp: string;
}
