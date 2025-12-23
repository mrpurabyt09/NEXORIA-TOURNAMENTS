
import React, { useState, useEffect, useMemo } from 'react';
import { Tournament, User, Transaction } from '../types';
import { 
  ChevronLeft, 
  Calendar, 
  Trophy, 
  ShieldCheck, 
  Users, 
  Info, 
  Clock, 
  CheckCircle2, 
  Gamepad2, 
  ScrollText, 
  Zap, 
  ListChecks,
  MonitorOff,
  Award,
  MapPin as MapIcon,
  Eye,
  Server,
  Skull,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { audioService, SOUNDS } from '../services/audioService';

interface TournamentDetailProps {
  tournament: Tournament;
  user: User;
  onUpdateBalance: (amount: number) => void;
  addTransaction: (tx: Transaction) => void;
  onBack: () => void;
}

const TournamentDetail: React.FC<TournamentDetailProps> = ({ tournament, user, onUpdateBalance, addTransaction, onBack }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number }>({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(tournament.startTime).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tournament.startTime]);

  const handleJoin = () => {
    if (user.balance < tournament.entryFee) {
      audioService.play(SOUNDS.REJECT);
      alert("Insufficient Balance!");
      return;
    }
    
    audioService.play(SOUNDS.CLICK);
    setIsJoining(true);
    setTimeout(() => {
      onUpdateBalance(-tournament.entryFee);
      
      addTransaction({
        id: 'tx_join_' + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        amount: -tournament.entryFee,
        type: 'ENTRY_FEE',
        status: 'COMPLETED',
        timestamp: new Date().toISOString(),
        paymentMethod: 'WALLET'
      });

      audioService.play(SOUNDS.JOIN);
      setJoined(true);
      setIsJoining(false);
    }, 1200);
  };

  const prizeDistribution = useMemo(() => [
    { rank: '1ST', amount: Math.floor(tournament.prizePool * 0.5), icon: <Award className="text-amber-400" size={24} /> },
    { rank: '2ND', amount: Math.floor(tournament.prizePool * 0.25), icon: <Award className="text-gray-300" size={20} /> },
    { rank: '3RD', amount: Math.floor(tournament.prizePool * 0.15), icon: <Award className="text-amber-700" size={16} /> },
    { rank: '4TH-5TH', amount: Math.floor(tournament.prizePool * 0.05), icon: <Trophy className="text-blue-400" size={14} /> },
  ], [tournament.prizePool]);

  const combatSpecs = useMemo(() => [
    { label: 'POV', val: 'TPP', icon: <Eye size={16} /> },
    { label: 'MAP', val: 'ERANGEL', icon: <MapIcon size={16} /> },
    { label: 'SERVER', val: 'ASIA-1', icon: <Server size={16} /> },
    { label: 'SLOTS', val: tournament.maxParticipants, icon: <Users size={16} /> },
  ], [tournament.maxParticipants]);

  const rules = useMemo(() => [
    { category: 'Device Protocols', items: ['Mobile only. No emulators.', 'Screen recording required.', 'No GFX tools.'] },
    { category: 'Conduct', items: ['Lobby 5m early.', 'No teaming.', 'Do not share IDs.'] },
    { category: 'Scoring', items: ['Standard PMCO points.', 'WWCD: 15 Pts', 'Finish: 1 Pt'] },
  ], []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 pb-24 font-rajdhani px-1 md:px-0">
      <button onClick={() => { audioService.play(SOUNDS.CLICK); onBack(); }} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group uppercase font-black text-[10px] md:text-xs tracking-[0.3em] mb-2">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Return to Operational Catalog
      </button>

      {/* Hero Header - Responsive Height */}
      <div className="relative h-[300px] md:h-[500px] rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 group">
        <img 
          src={`https://picsum.photos/seed/${tournament.id}-hd/1400/800`} 
          alt={tournament.title} 
          className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition-transform duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
        
        <div className="absolute top-4 right-4 md:top-10 md:right-10 flex flex-col items-end gap-2 md:gap-3 scale-90 md:scale-100">
          <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/50 px-4 md:px-6 py-1.5 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">₹{tournament.entryFee}</span>
          </div>
          <div className="bg-[#a855f7]/20 backdrop-blur-md border border-[#a855f7]/50 px-4 md:px-6 py-1.5 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
             <Trophy className="text-[#a855f7]" size={12} />
             <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">₹{tournament.prizePool.toLocaleString()}</span>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12">
          <div className="max-w-3xl space-y-3 md:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full">
              <span className="text-[8px] md:text-[10px] font-black text-[#a855f7] uppercase tracking-[0.3em]">{tournament.game}</span>
            </div>
            <h1 className="text-3xl md:text-7xl font-black font-cyber text-white italic tracking-tighter neon-glow-purple uppercase leading-none">
              {tournament.title}
            </h1>
            <p className="text-gray-400 font-medium text-sm md:text-lg max-w-xl line-clamp-2 hidden md:block">{tournament.description}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-8 space-y-6 md:space-y-8 order-2 lg:order-1">
          
          {/* Enhanced Countdown Timer - Fluid for mobile */}
          <div className="cyber-card p-6 md:p-10 rounded-3xl md:rounded-[3rem] border-[#a855f7]/30 bg-gradient-to-br from-[#121218] to-black relative overflow-hidden">
             <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
                <div className="text-center space-y-1">
                   <h3 className="text-lg md:text-2xl font-black font-cyber text-white uppercase italic tracking-widest">Engagement T-Minus</h3>
                   <div className="flex items-center justify-center gap-2">
                      <Clock size={12} className="text-[#a855f7] animate-pulse" />
                      <p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-[0.5em]">Syncing Neural Clock</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 md:gap-12 w-full">
                   {[
                     { label: 'D', val: timeLeft.d },
                     { label: 'H', val: timeLeft.h },
                     { label: 'M', val: timeLeft.m },
                     { label: 'S', val: timeLeft.s },
                   ].map((t, i) => (
                     <div key={i} className="flex flex-col items-center">
                        <span className="text-3xl md:text-7xl font-black font-cyber text-white italic tabular-nums leading-none tracking-tighter">
                          {t.val.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[8px] md:text-[10px] font-black text-gray-600 tracking-widest uppercase mt-2 md:mt-4">{t.label}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Combat Specs Grid - 2 cols on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
             {combatSpecs.map((spec, i) => (
               <div key={i} className="cyber-card p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-white/5 bg-white/5 flex flex-col items-center justify-center text-center gap-2 md:gap-3 group hover:border-[#a855f7]/30 transition-all">
                  <div className="p-2 md:p-3 bg-[#a855f7]/10 text-[#a855f7] rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform">
                     {spec.icon}
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">{spec.label}</p>
                    <p className="text-xs md:text-sm font-black text-white uppercase tracking-tighter">{spec.val}</p>
                  </div>
               </div>
             ))}
          </div>

          {/* Rules Section */}
          <section className="space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-black font-cyber text-white italic uppercase tracking-widest flex items-center gap-3">
              <ScrollText size={20} className="text-[#a855f7]" />
              Rules of Engagement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
               {rules.map((rule, i) => (
                 <div key={i} className="cyber-card p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border-white/10 bg-black/40 space-y-4 md:space-y-6">
                    <h4 className="text-[10px] font-black text-[#a855f7] uppercase tracking-widest flex items-center gap-2">
                       <ListChecks size={16} /> {rule.category}
                    </h4>
                    <ul className="space-y-2 md:space-y-4">
                       {rule.items.map((item, idx) => (
                         <li key={idx} className="flex gap-3 text-xs font-medium text-gray-400 leading-snug group">
                            <span className="text-[#a855f7] shrink-0 font-black group-hover:rotate-12 transition-transform">#</span>
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Sidebar Actions - Top on mobile, sticky on desktop */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8 order-1 lg:order-2">
          <div className="cyber-card p-6 md:p-8 rounded-3xl md:rounded-[3rem] border-[#a855f7]/20 bg-gradient-to-b from-[#121218] to-black shadow-2xl space-y-6 md:space-y-8 sticky top-4 lg:top-10">
            <div className="space-y-4 md:space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Arena Uplink</h3>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[8px] md:text-[9px] font-black text-emerald-500 uppercase">ACTIVE</span>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">
                     <span>Deployment Status</span>
                     <span className="text-white">{tournament.participants} / {tournament.maxParticipants} OPS</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 md:h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] h-full transition-all duration-1000" 
                      style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="flex flex-col">
                     <span className="text-gray-500 font-bold uppercase tracking-widest text-[8px] mb-1">Entrance Fee</span>
                     <span className="text-white font-black font-cyber italic text-base md:text-xl">₹{tournament.entryFee}</span>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-gray-500 font-bold uppercase tracking-widest text-[8px] mb-1">Prize Magnitude</span>
                     <span className="text-emerald-500 font-black font-cyber italic text-base md:text-xl">₹{tournament.prizePool.toLocaleString()}</span>
                  </div>
               </div>
            </div>

            {joined ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 md:p-8 rounded-2xl md:rounded-[2rem] text-center space-y-4 animate-in zoom-in shadow-2xl">
                <CheckCircle2 className="text-emerald-500 mx-auto" size={24} />
                <div className="space-y-1">
                   <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-xs italic">SYNC COMPLETE</p>
                </div>
                <button className="w-full py-3 bg-emerald-500/20 text-emerald-500 rounded-xl text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">ACCESS TERMINAL</button>
              </div>
            ) : (
              <button 
                onClick={handleJoin}
                disabled={isJoining}
                className="w-full bg-[#a855f7] py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-sm md:text-xl tracking-[0.3em] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 uppercase italic text-white"
              >
                {isJoining ? <RefreshCw className="animate-spin" /> : <>JOIN ARENA <Zap size={18} /></>}
              </button>
            )}

            {/* Prize Matrix - Scaled for mobile */}
            <div className="space-y-4 pt-6 md:pt-8 border-t border-white/5">
               <h4 className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] text-center">Prize Matrix</h4>
               <div className="space-y-2">
                  {prizeDistribution.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 md:p-4 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl transition-all">
                       <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-black/40 rounded-lg border border-white/10">{p.icon}</div>
                          <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.rank}</span>
                       </div>
                       <span className="text-xs md:text-sm font-black text-white font-cyber italic">₹{p.amount.toLocaleString()}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;
