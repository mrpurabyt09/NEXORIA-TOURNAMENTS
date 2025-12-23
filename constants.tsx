
import React from 'react';
import { 
  Trophy, 
  Gamepad2, 
  Wallet, 
  ShieldAlert, 
  LayoutDashboard, 
  User as UserIcon, 
  Settings, 
  LogOut,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  BrainCircuit,
  Target
} from 'lucide-react';

export const COLORS = {
  primary: '#a855f7', // Purple
  bg: '#050505',
  card: '#0f0f14',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#eab308',
  info: '#3b82f6',
  accent: '#ec4899',
};

export const NAVIGATION = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: 'dashboard' },
  { name: 'Tournaments', icon: <Trophy size={20} />, path: 'tournaments' },
  { name: 'Tactical AI', icon: <BrainCircuit size={20} />, path: 'ai_consultant' },
  { name: 'Match Recon', icon: <Target size={20} />, path: 'match_recon' },
  { name: 'Anti-Cheat', icon: <ShieldAlert size={20} />, path: 'anticheat' },
  { name: 'Wallet', icon: <Wallet size={20} />, path: 'wallet' },
  { name: 'Profile', icon: <UserIcon size={20} />, path: 'profile' },
  { name: 'Support & Legal', icon: <Info size={20} />, path: 'legal' },
];

export const ADMIN_NAVIGATION = [
  ...NAVIGATION,
  { name: 'Admin Hub', icon: <Settings size={20} />, path: 'admin' },
];

export const MOCK_TOURNAMENTS = [
  {
    id: 't1',
    title: 'NEXORIA PRO INVITATIONAL',
    game: 'BGMI',
    type: 'SQUAD',
    prizePool: 50000,
    entryFee: 100,
    startTime: '2024-05-20T18:00:00Z',
    status: 'UPCOMING',
    participants: 45,
    maxParticipants: 100,
    description: 'The ultimate battle for the Nexoria throne. Top squads compete for the massive prize pool on Erangel. Only Level 40+ players allowed.'
  },
  {
    id: 't2',
    title: 'NEXORIA NIGHT STRIKE',
    game: 'BGMI',
    type: 'SOLO',
    prizePool: 5000,
    entryFee: 20,
    startTime: '2024-05-18T20:00:00Z',
    status: 'LIVE',
    participants: 88,
    maxParticipants: 100,
    description: 'Test your individual skills in this late night Nexoria solo grind. Sanhok map rules apply - fast pace, high intensity.'
  },
  {
    id: 't3',
    title: 'NEXORIA CYBER DUO',
    game: 'BGMI',
    type: 'DUO',
    prizePool: 12000,
    entryFee: 50,
    startTime: '2024-05-22T15:00:00Z',
    status: 'UPCOMING',
    participants: 12,
    maxParticipants: 50,
    description: 'Grab your best partner and dominate the Erangel maps. Standard Duo rules with Nexoria competitive zone settings.'
  }
];

export const NexoriaLogo = ({ size = 40, className = "" }) => (
  <div className={`relative flex flex-col items-center justify-center ${className}`}>
    <div className="relative group">
       <div className="absolute inset-0 bg-[#a855f7] opacity-20 blur-xl group-hover:opacity-40 transition-opacity rounded-full"></div>
       <div className="relative w-20 h-20 bg-black/80 border-2 border-[#a855f7]/40 rounded-3xl flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <span className="text-6xl font-black font-cyber text-[#a855f7] leading-none transform skew-x-[-12deg] neon-glow-purple">X</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
       </div>
    </div>
    <span className="mt-2 text-xl font-black font-cyber text-white tracking-[0.2em] italic neon-glow-purple">NEXORIA</span>
  </div>
);
