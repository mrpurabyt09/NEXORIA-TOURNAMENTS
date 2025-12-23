
import React, { useState, useMemo, useCallback } from 'react';
import { User, Tournament, Transaction } from '../../types';
import { 
  Settings, Users, Trophy, Wallet, Check, X, Plus, Edit, Trash2, 
  Activity, Clock, ShieldCheck, BarChart3, Zap, Search,
  Terminal, RefreshCw, Github, GitBranch, GitCommit,
  Database, Link as LinkIcon, ChevronRight, Ban, UserPlus,
  ArrowUpRight, ArrowDownLeft, AlertCircle, MapPin
} from 'lucide-react';
import { audioService, SOUNDS } from '../../services/audioService';
import { api } from '../../services/apiService';

interface AdminHubProps {
  user: User;
  tournaments: Tournament[];
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
  transactions: Transaction[];
  approveTransaction: (userId: string) => void; 
}

const AdminHub: React.FC<AdminHubProps> = ({ user, tournaments, setTournaments, transactions, approveTransaction }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'DASHBOARD' | 'TOURNAMENTS' | 'USERS' | 'TRANSACTIONS' | 'FORGE'>('DASHBOARD');
  const [isProcessingTx, setIsProcessingTx] = useState<string | null>(null);

  const [newT, setNewT] = useState({
    title: '',
    type: 'SQUAD',
    prizePool: 5000,
    entryFee: 50,
    map: 'ERANGEL',
    description: ''
  });

  const handleTabChange = (tab: any) => {
    audioService.play(SOUNDS.ADMIN_TAB);
    setActiveAdminTab(tab);
  };

  const handleForge = () => {
    if (!newT.title || !newT.description) {
      alert("Requirements not met.");
      return;
    }
    audioService.play(SOUNDS.SUCCESS);
    const tournament: Tournament = {
      id: 't_' + Math.random().toString(36).substr(2, 9),
      title: newT.title.toUpperCase(),
      game: 'BGMI',
      type: newT.type as any,
      prizePool: Number(newT.prizePool),
      entryFee: Number(newT.entryFee),
      startTime: new Date(Date.now() + 86400000).toISOString(),
      status: 'UPCOMING',
      participants: 0,
      maxParticipants: 100,
      description: newT.description
    };

    setTournaments(prev => [tournament, ...prev]);
    setActiveAdminTab('TOURNAMENTS');
  };

  const handleProcessTransaction = async (id: string, status: 'COMPLETED' | 'REJECTED') => {
    setIsProcessingTx(id);
    audioService.play(SOUNDS.CLICK);
    try {
      const updated = await api.updateTransactionStatus(id, status);
      if (updated) {
        status === 'COMPLETED' ? audioService.play(SOUNDS.APPROVE) : audioService.play(SOUNDS.REJECT);
        approveTransaction(updated.userId);
      }
    } catch (e) {
      alert("Protocol failure.");
    } finally {
      setIsProcessingTx(null);
    }
  };

  const pendingTxs = useMemo(() => transactions.filter(t => t.status === 'PENDING'), [transactions]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 font-rajdhani transform-gpu max-w-7xl mx-auto px-1">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-[#1a1a24] to-[#050505] border-2 border-[#ef4444]/20 shadow-2xl relative overflow-hidden group">
        <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full lg:w-auto">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#ef4444]/10 flex items-center justify-center border-2 border-[#ef4444]/40 shrink-0">
            <Settings size={24} className="text-[#ef4444] md:hidden" />
            <Settings size={32} className="text-[#ef4444] hidden md:block" />
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-black font-cyber text-white italic uppercase tracking-tighter">Command Center</h2>
            <p className="text-[#ef4444] text-[8px] md:text-[10px] font-bold tracking-[0.4em] uppercase">Auth: Level 5 SuperUser</p>
          </div>
        </div>
        
        <div className="flex gap-1 bg-black/60 p-1.5 rounded-xl md:rounded-2xl border border-white/5 backdrop-blur-xl z-10 w-full lg:w-auto overflow-x-auto scrollbar-hide">
          {[
            { id: 'DASHBOARD', icon: <BarChart3 size={14} />, label: 'Vitals' },
            { id: 'TOURNAMENTS', icon: <Zap size={14} />, label: 'Arena' },
            { id: 'TRANSACTIONS', icon: <Wallet size={14} />, label: `Audit (${pendingTxs.length})` },
            { id: 'FORGE', icon: <Plus size={14} />, label: 'Forge' },
          ].map(tab => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id as any)}
                    className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeAdminTab === tab.id ? 'bg-[#ef4444] text-white' : 'text-gray-500 hover:text-white'}`}>
              {tab.icon} <span className="hidden xs:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeAdminTab === 'DASHBOARD' && (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
           {[
             { label: 'Volume', value: `₹${transactions.reduce((s,t)=>s+Math.abs(t.amount),0).toLocaleString()}`, icon: <Activity size={18}/>, color: 'text-emerald-500' },
             { label: 'Pending', value: pendingTxs.length, icon: <Clock size={18}/>, color: 'text-amber-500' },
             { label: 'Arena Ops', value: tournaments.length, icon: <Zap size={18}/>, color: 'text-[#a855f7]' },
             { label: 'Security', value: 'Lv.5', icon: <ShieldCheck size={18}/>, color: 'text-blue-500' }
           ].map((stat, i) => (
            <div key={i} className="cyber-card p-5 md:p-6 rounded-2xl md:rounded-3xl border-white/5 flex flex-col justify-between">
               <div className={`p-2.5 w-fit rounded-lg bg-white/5 ${stat.color} mb-4`}>{stat.icon}</div>
               <div>
                 <p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</p>
                 <p className="text-xl md:text-3xl font-black font-cyber text-white italic">{stat.value}</p>
               </div>
            </div>
          ))}
        </div>
      )}

      {activeAdminTab === 'TRANSACTIONS' && (
        <div className="space-y-4 md:space-y-6">
           {pendingTxs.length > 0 ? pendingTxs.map(tx => (
             <div key={tx.id} className="cyber-card p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-white/5 flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${tx.type === 'WITHDRAWAL' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                   {tx.type === 'WITHDRAWAL' ? <ArrowDownLeft size={20}/> : <ArrowUpRight size={20}/>}
                </div>
                <div className="flex-1 text-center sm:text-left">
                   <p className="text-lg md:text-xl font-black text-white italic tracking-tight">₹{Math.abs(tx.amount).toLocaleString()}</p>
                   <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase">{tx.type} • ID: {tx.userId.substring(0,8)}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                   <button onClick={() => handleProcessTransaction(tx.id, 'REJECTED')} className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-white/5 text-gray-400 rounded-lg md:rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5">REJECT</button>
                   <button onClick={() => handleProcessTransaction(tx.id, 'COMPLETED')} className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-[#ef4444] text-white rounded-lg md:rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">APPROVE</button>
                </div>
             </div>
           )) : (
             <div className="py-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">No pending audits in registry.</div>
           )}
        </div>
      )}

      {activeAdminTab === 'FORGE' && (
        <div className="max-w-3xl mx-auto cyber-card p-6 md:p-10 rounded-2xl md:rounded-[3rem] border-white/5 space-y-6 md:space-y-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Op Title</label>
                 <input type="text" value={newT.title} onChange={e => setNewT({...newT, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-[#ef4444]/50 font-bold text-xs" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Logic</label>
                 <select value={newT.type} onChange={e => setNewT({...newT, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-[#ef4444]/50 font-bold text-xs">
                    <option value="SOLO">SOLO</option>
                    <option value="DUO">DUO</option>
                    <option value="SQUAD">SQUAD</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Prize (₹)</label>
                 <input type="number" value={newT.prizePool} onChange={e => setNewT({...newT, prizePool: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-[#ef4444]/50 font-bold text-xs" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Entry (₹)</label>
                 <input type="number" value={newT.entryFee} onChange={e => setNewT({...newT, entryFee: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-[#ef4444]/50 font-bold text-xs" />
              </div>
           </div>
           <button onClick={handleForge} className="w-full py-4 rounded-xl bg-[#ef4444] text-white font-black text-sm tracking-[0.2em] shadow-xl uppercase italic">DRAFT ARENA</button>
        </div>
      )}
    </div>
  );
};

export default AdminHub;
