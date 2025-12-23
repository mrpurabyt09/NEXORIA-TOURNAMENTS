
import React, { useEffect, useState } from 'react';
import { User, Tournament } from '../types';
import { Trophy, Clock, Users, Zap, TrendingUp, PlayCircle, Radio, Activity, Globe, ShieldAlert, MapPin } from 'lucide-react';
import { fetchDailyIntel } from '../services/geminiService';

interface DashboardProps {
  user: User;
  tournaments: Tournament[];
  onSelectTournament: (t: Tournament) => void;
  currentRegion?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, tournaments, onSelectTournament, currentRegion }) => {
  const [intel, setIntel] = useState<string[]>([]);
  const [onlinePlayers, setOnlinePlayers] = useState(12402);

  useEffect(() => {
    const loadIntel = async () => {
      const news = await fetchDailyIntel();
      if (news) setIntel(news);
    };
    loadIntel();

    const interval = setInterval(() => {
      setOnlinePlayers(prev => prev + Math.floor(Math.random() * 21) - 10);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black font-cyber text-white italic uppercase tracking-tighter leading-none">
            Welcome, <span className="text-[#a855f7] neon-glow-purple">{user.username}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-3">
             <div className="flex items-center gap-2 bg-[#a855f7]/10 px-3 py-1.5 rounded-full border border-[#a855f7]/20">
                <MapPin size={12} className="text-[#a855f7]" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{currentRegion || 'NODE'}</span>
             </div>
             <p className="text-[#a855f7] font-black text-[10px] md:text-xs uppercase tracking-tighter flex items-center gap-1.5">
                <Globe size={12} /> {onlinePlayers.toLocaleString()} OPS LIVE
             </p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="cyber-card flex-1 md:flex-none px-6 py-4 rounded-2xl flex items-center gap-4 border-l-4 border-[#22c55e]">
            <TrendingUp className="text-[#22c55e] w-6 h-6" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">Win Rate</p>
              <p className="text-xl md:text-2xl font-black font-cyber italic">72%</p>
            </div>
          </div>
          <div className="cyber-card flex-1 md:flex-none px-6 py-4 rounded-2xl flex items-center gap-4 border-l-4 border-[#a855f7]">
            <Trophy className="text-[#a855f7] w-6 h-6" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">Vault</p>
              <p className="text-xl md:text-2xl font-black font-cyber italic">₹{user.balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="relative h-56 md:h-80 rounded-[2rem] md:rounded-[3rem] overflow-hidden group cursor-pointer border border-white/5">
        <img 
          src="https://picsum.photos/seed/nexoria-pro/1400/600" 
          alt="Featured" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ef4444] rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-rose-500/20">
             LIVE ENGAGEMENT
          </div>
          <h3 className="text-2xl md:text-6xl font-black font-cyber italic uppercase tracking-tighter leading-none text-white">Nexoria Pro League</h3>
          <button className="bg-[#a855f7] hover:bg-white hover:text-black text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all active:scale-95 w-full sm:w-auto justify-center">
            <PlayCircle size={18} /> CONNECT TO LOBBY
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-xl md:text-2xl font-black font-cyber uppercase tracking-widest text-white italic flex items-center gap-3">
               <Activity size={24} className="text-[#a855f7]" /> Arena Status
            </h4>
            <button className="text-[#a855f7] text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">VIEW ALL OPS</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tournaments.slice(0, 4).map(t => (
              <div 
                key={t.id}
                onClick={() => onSelectTournament(t)}
                className="cyber-card p-6 rounded-3xl border border-white/5 hover:border-[#a855f7]/40 transition-all cursor-pointer group hover:-translate-y-1 active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${t.status === 'LIVE' ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30' : 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30'}`}>
                    {t.status}
                  </span>
                  <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{t.type}</span>
                </div>
                <h5 className="text-lg md:text-xl font-black group-hover:text-[#a855f7] transition-colors mb-4 uppercase italic font-cyber tracking-tight leading-none">{t.title}</h5>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy size={14} className="text-[#22c55e]" />
                    <span className="text-base font-black font-cyber italic text-white">₹{t.prizePool.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock size={14} />
                    <span className="uppercase text-[10px] font-black">18:00 UTC</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="text-xl md:text-2xl font-black font-cyber uppercase tracking-widest text-white italic flex items-center gap-3">
             <Radio size={24} className="text-[#ec4899]" /> Tactical Intel
          </h4>
          <div className="cyber-card rounded-[2.5rem] p-8 border border-white/5 space-y-6 bg-black/40 backdrop-blur-md">
            {intel.length > 0 ? intel.map((item, i) => (
              <div key={i} className="flex gap-4 animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[#a855f7]/40 transition-all">
                  <Zap className="text-[#a855f7] w-5 h-5" />
                </div>
                <div className="text-sm">
                  <p className="text-gray-300 leading-snug uppercase font-bold tracking-wider">{item}</p>
                </div>
              </div>
            )) : (
              <div className="space-y-6 animate-pulse">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 shrink-0"></div>
                    <div className="flex-1 space-y-2 py-2">
                      <div className="h-2 bg-white/5 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
