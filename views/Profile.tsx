
import React, { useMemo } from 'react';
import { User } from '../types';
import { 
  ShieldCheck, Trophy, Target, Zap, Award, Star, Settings, Shield, 
  Gamepad2, Hash, Activity, ChevronRight, TrendingUp, Clock, 
  Fingerprint, Cpu, Radio
} from 'lucide-react';
import { audioService, SOUNDS } from '../services/audioService';

interface ProfileProps {
  user: User;
}

const DossierStat = React.memo(({ label, value, icon, color }: any) => (
  <div className="cyber-card p-4 rounded-xl border border-white/5 flex flex-col justify-between group hover:border-[#a855f7]/30 transition-colors transform-gpu">
    <div className={`p-1.5 w-fit rounded-lg bg-white/5 mb-2 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{label}</p>
      <p className="text-lg md:text-xl font-black font-cyber text-white italic leading-none">{value}</p>
    </div>
  </div>
));

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const stats = useMemo(() => [
    { label: 'K/D RATIO', value: '4.82', icon: <Target size={14} />, color: 'text-rose-500' },
    { label: 'WIN RATE', value: '72%', icon: <TrendingUp size={14} />, color: 'text-emerald-500' },
    { label: 'DEPLOYED', value: '241', icon: <Activity size={14} />, color: 'text-blue-500' },
    { label: 'REVENUE', value: `₹${(user.balance + 3250).toLocaleString()}`, icon: <Trophy size={14} />, color: 'text-amber-500' },
  ], [user.balance]);

  const achievements = useMemo(() => [
    { id: '1', title: 'SENTINEL', icon: <ShieldCheck size={18} />, color: 'from-blue-600 to-cyan-500' },
    { id: '2', title: 'STRIKER', icon: <Zap size={18} />, color: 'from-purple-600 to-pink-500' },
    { id: '3', title: 'ELITE', icon: <Star size={18} />, color: 'from-amber-600 to-orange-500' },
  ], []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-24 transform-gpu px-1 md:px-0">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:col-span-3 cyber-card p-6 md:p-10 rounded-[2rem] border-white/10 bg-gradient-to-br from-[#0a0a0f] to-[#050505] flex flex-col sm:flex-row items-center gap-8 md:gap-10">
          <div className="relative shrink-0 scale-90 sm:scale-100">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#a855f7]/20 animate-[spin_60s_linear_infinite]"></div>
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-white/5 p-2 border border-white/10 flex items-center justify-center relative shadow-2xl">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] p-1">
                <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center overflow-hidden">
                  <span className="text-6xl md:text-7xl font-black font-cyber text-white opacity-80">{user.username.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-emerald-500 px-2 md:px-3 py-1 rounded-full border-2 md:border-4 border-[#050505] flex items-center gap-1 shadow-lg">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white animate-pulse"></span>
                <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest">ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 md:space-y-5 text-center sm:text-left">
            <div>
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <h2 className="text-3xl md:text-6xl font-black font-cyber text-white uppercase italic tracking-tighter leading-none">{user.username}</h2>
                <div className="bg-[#a855f7]/10 border border-[#a855f7]/20 px-2 py-0.5 rounded-lg">
                  <span className="text-[8px] md:text-[10px] font-mono font-bold text-[#a855f7]">V-4.2-SENTINEL</span>
                </div>
              </div>
              <p className="font-mono text-[9px] md:text-xs text-gray-500 tracking-[0.2em] uppercase">{user.email}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-0.5">
                <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Rank</p>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Award size={14} className="text-amber-500" />
                  <span className="text-xs md:text-lg font-black font-cyber text-white uppercase">MASTER IV</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Clearance</p>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <ShieldCheck size={14} className="text-[#a855f7]" />
                  <span className="text-xs md:text-lg font-black font-cyber text-white uppercase">TIER 1</span>
                </div>
              </div>
              <div className="space-y-0.5 hidden md:block">
                <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Sync</p>
                <div className="flex items-center gap-1.5">
                  <Cpu size={14} className="text-blue-500" />
                  <span className="text-xs md:text-lg font-black font-cyber text-white uppercase">STABLE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cyber-card p-6 rounded-[2rem] flex flex-col justify-between border-[#a855f7]/20 bg-[#a855f7]/5 shrink-0">
          <div className="space-y-1 mb-6">
            <h4 className="text-[9px] font-black text-[#a855f7] uppercase tracking-[0.2em]">Experience Protocol</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-black font-cyber text-white italic">42</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">LVL</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] w-[84%]"></div>
            </div>
            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest text-center">84% to Level 43</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:col-span-1">
          {stats.map((s, i) => <DossierStat key={i} {...s} />)}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="cyber-card p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border-white/5 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xs md:text-sm font-black font-cyber text-white italic uppercase tracking-widest flex items-center gap-2">
                   <Radio size={14} className="text-[#a855f7]" /> Operational Logs
                </h3>
             </div>
             
             <div className="space-y-3">
                {[
                  { op: 'Night Strike Solo', res: 'RANK #1', color: 'text-emerald-500' },
                  { op: 'Pochinki Scrims', res: 'RANK #4', color: 'text-blue-500' },
                  { op: 'Cyber Duo Cup', res: 'RANK #12', color: 'text-gray-500' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl">
                    <p className="text-[10px] md:text-xs font-bold text-white uppercase truncate pr-2">{log.op}</p>
                    <p className={`text-[10px] md:text-xs font-black font-cyber italic shrink-0 ${log.color}`}>{log.res}</p>
                  </div>
                ))}
             </div>

             <div className="pt-6 border-t border-white/5">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Badge Gallery</h4>
                <div className="flex flex-wrap gap-3">
                   {achievements.map((a) => (
                     <div key={a.id} className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${a.color} p-0.5 shadow-xl`}>
                        <div className="w-full h-full bg-[#0a0a0f] rounded-[11px] md:rounded-[15px] flex items-center justify-center text-white scale-75 md:scale-100">{a.icon}</div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-1 cyber-card p-6 rounded-3xl border-white/5 space-y-6 bg-black/40">
           <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Sec Protocol</h3>
           <div className="space-y-4">
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                 <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Character ID</p>
                 <p className="font-mono text-xs text-white tracking-widest">{user.bgmiId || '5123445566'}</p>
              </div>
              <div className="bg-emerald-500/5 p-3.5 rounded-xl border border-emerald-500/20 flex justify-between items-center">
                 <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">SENTINEL: CLEAN</p>
                 <ShieldCheck size={14} className="text-emerald-500" />
              </div>
           </div>
           <button onClick={() => { audioService.play(SOUNDS.REJECT); alert("Protocol Reset Initiated."); }}
                   className="w-full py-3.5 border border-rose-500/20 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500/10 transition-all">
              TERMINATE SESSION
           </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
