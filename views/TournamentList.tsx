
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Tournament } from '../types';
import { Trophy, Clock, Users, Search, Crosshair, Image as ImageIcon, Zap, MapPin } from 'lucide-react';
import { audioService, SOUNDS } from '../services/audioService';

interface TournamentListProps {
  tournaments: Tournament[];
  onSelectTournament: (t: Tournament) => void;
}

const TournamentCard = React.memo(({ t, onClick }: { t: Tournament; onClick: () => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } 
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const mapTheme = useMemo(() => {
    const context = (t.title + " " + (t.description || "")).toLowerCase();
    
    // Erangel - The Classic Forest/Urban Map
    if (context.includes('erangel') || context.includes('pochinki') || context.includes('rozok') || context.includes('military') || context.includes('sosnovka')) {
      return { 
        name: 'ERANGEL', 
        primary: '#10b981', 
        glow: 'rgba(16, 185, 129, 0.5)',
        bgTint: 'rgba(16, 185, 129, 0.05)',
        border: 'border-emerald-500/20',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        keywords: 'forest,soviet,landscape,grassland'
      };
    }
    // Miramar - The Vast Desert Map
    if (context.includes('miramar') || context.includes('desert') || context.includes('pecado') || context.includes('hacienda') || context.includes('el pozo')) {
      return { 
        name: 'MIRAMAR', 
        primary: '#f59e0b', 
        glow: 'rgba(245, 158, 11, 0.5)',
        bgTint: 'rgba(245, 158, 11, 0.05)',
        border: 'border-amber-500/20',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        keywords: 'desert,mexico,dusty,sand'
      };
    }
    // Sanhok - The Lush Jungle Map
    if (context.includes('sanhok') || context.includes('jungle') || context.includes('bootcamp') || context.includes('paradise') || context.includes('ruins')) {
      return { 
        name: 'SANHOK', 
        primary: '#22c55e', 
        glow: 'rgba(34, 197, 94, 0.5)',
        bgTint: 'rgba(34, 197, 94, 0.05)',
        border: 'border-green-500/20',
        badge: 'bg-green-500/10 text-green-400 border-green-500/30',
        keywords: 'jungle,tropical,rainforest,greenery'
      };
    }
    // Vikendi - The Arctic Snow Map
    if (context.includes('vikendi') || context.includes('snow') || context.includes('castle') || context.includes('cosmodrome') || context.includes('volnova')) {
      return { 
        name: 'VIKENDI', 
        primary: '#60a5fa', 
        glow: 'rgba(96, 165, 250, 0.5)',
        bgTint: 'rgba(96, 165, 250, 0.05)',
        border: 'border-blue-400/20',
        badge: 'bg-blue-400/10 text-blue-300 border-blue-400/30',
        keywords: 'snow,mountain,arctic,winter'
      };
    }
    // Karakin - The Small Dry Map
    if (context.includes('karakin') || context.includes('drylands') || context.includes('bunker') || context.includes('black zone')) {
      return { 
        name: 'KARAKIN', 
        primary: '#d97706', 
        glow: 'rgba(217, 119, 6, 0.5)',
        bgTint: 'rgba(217, 119, 6, 0.05)',
        border: 'border-amber-700/20',
        badge: 'bg-amber-700/10 text-amber-600 border-amber-700/30',
        keywords: 'dry,sand,rocks,quarry'
      };
    }
    // Nusa - The Tropical Island Map
    if (context.includes('nusa') || context.includes('resort') || context.includes('beach') || context.includes('science center')) {
      return { 
        name: 'NUSA', 
        primary: '#06b6d4', 
        glow: 'rgba(6, 182, 212, 0.5)',
        bgTint: 'rgba(6, 182, 212, 0.05)',
        border: 'border-cyan-500/20',
        badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        keywords: 'tropical,beach,resort,island'
      };
    }
    
    // Default Arena Theme
    return { 
      name: 'ARENA', 
      primary: '#a855f7', 
      glow: 'rgba(168, 85, 247, 0.6)',
      bgTint: 'rgba(168, 85, 247, 0.05)',
      border: 'border-[#a855f7]/20',
      badge: 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30',
      keywords: 'stadium,arena,cyberpunk,esports'
    };
  }, [t.title, t.description]);

  /**
   * REFINED BANNER LOGIC: 
   * Explicitly uses the map name as the primary keyword for better visual immersion.
   */
  const getBannerUrl = useCallback(() => {
    const mapNameTag = mapTheme.name.toLowerCase();
    // Using a curated mix of map name and environment keywords
    return `https://loremflickr.com/600/300/${mapNameTag},${mapTheme.keywords.split(',')[0]},gaming?lock=${t.id.length + t.title.length}`;
  }, [t.id, t.title, mapTheme.name, mapTheme.keywords]);

  const bannerUrl = useMemo(() => getBannerUrl(), [getBannerUrl]);

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => audioService.play(SOUNDS.HOVER, 0.1)}
      style={{ '--hover-glow': mapTheme.glow } as React.CSSProperties}
      className={`cyber-card group rounded-[2.5rem] overflow-hidden border transition-all duration-500 ease-out h-full transform-gpu hover:-translate-y-3 hover:scale-[1.03] ${mapTheme.border} flex flex-col shadow-xl md:shadow-2xl hover:shadow-[0_0_40px_var(--hover-glow)] hover:border-opacity-100 relative`}
    >
      {/* Dynamic Hover Styles */}
      <style>{`
        @keyframes subtle-pulse {
          0% { box-shadow: 0 0 5px var(--hover-glow); transform: scale(1); }
          50% { box-shadow: 0 0 20px var(--hover-glow); transform: scale(1.02); }
          100% { box-shadow: 0 0 5px var(--hover-glow); transform: scale(1); }
        }
        .group:hover .join-button-pulse {
          animation: subtle-pulse 2s infinite ease-in-out;
        }
      `}</style>

      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 md:opacity-30 group-hover:opacity-70 transition-opacity duration-700" 
           style={{ background: `radial-gradient(circle at 70% 20%, ${mapTheme.bgTint}, transparent)` }} />

      {/* Banner Section */}
      <div className="relative h-40 md:h-48 overflow-hidden bg-[#0a0a0f] shrink-0">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            <Crosshair className="text-white/5 animate-pulse" size={40} />
          </div>
        )}

        {isInView && (
          <img src={bannerUrl} alt={t.title} onLoad={() => setIsLoaded(true)}
               className={`w-full h-full object-cover transition-all duration-1000 transform-gpu ${isLoaded ? 'opacity-30 group-hover:opacity-70 group-hover:scale-110' : 'opacity-0'}`} />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-[#0f0f14]/60 to-transparent z-10"></div>
        
        {/* Status & Map Badges */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 flex flex-col gap-2">
          <div className="flex gap-1.5 md:gap-2">
            <span className={`px-2 py-0.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${t.status === 'LIVE' ? 'bg-rose-500/20 text-rose-500 border-rose-500/50' : 'bg-black/60 text-white/60 border-white/10'}`}>
              {t.status}
            </span>
            <span className={`px-2 py-0.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border backdrop-blur-md flex items-center gap-1.5 ${mapTheme.badge}`}>
              <MapPin size={8} /> {mapTheme.name}
            </span>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20 space-y-0.5 md:space-y-1">
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-80" style={{ color: mapTheme.primary }}>{t.type} • {t.game}</p>
          <h3 className="text-lg md:text-2xl font-black font-cyber text-white italic tracking-tighter uppercase leading-none truncate max-w-[220px] md:max-w-[280px] group-hover:text-white transition-colors">{t.title}</h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 flex-1 flex flex-col relative z-10 bg-[#0f0f14]/90 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="bg-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/5 group-hover:border-white/20 transition-colors">
            <p className="text-[8px] text-gray-600 font-black uppercase mb-1 tracking-widest">Prize Pool</p>
            <p className="text-sm md:text-xl font-black font-cyber italic transition-transform group-hover:scale-105 origin-left" style={{ color: mapTheme.primary }}>₹{t.prizePool.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/5 group-hover:border-white/20 transition-colors">
            <p className="text-[8px] text-gray-600 font-black uppercase mb-1 tracking-widest">Buy-In</p>
            <p className="text-sm md:text-xl font-black text-white font-cyber italic group-hover:text-[#a855f7] transition-colors">₹{t.entryFee}</p>
          </div>
        </div>

        {/* Stats & Progress */}
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock size={12} style={{ color: mapTheme.primary }} />
              <span className="group-hover:text-white transition-colors">{new Date(t.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={12} />
              <span className="text-white">{t.participants}/{t.maxParticipants}</span>
            </div>
          </div>
          
          <div className="w-full bg-white/5 h-1 md:h-2 rounded-full overflow-hidden border border-white/5 group-hover:border-white/10 transition-colors">
            <div className="h-full transform-gpu transition-all duration-1000 ease-out shadow-[0_0_10px_var(--hover-glow)]" 
                 style={{ width: `${(t.participants / t.maxParticipants) * 100}%`, backgroundColor: mapTheme.primary }} />
          </div>
        </div>

        {/* Action Button */}
        <button className="mt-auto w-full py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 join-button-pulse hover:brightness-110"
                style={{ backgroundColor: mapTheme.primary }}>
          JOIN ARENA <Zap size={10} />
        </button>
      </div>
    </div>
  );
});

const TournamentList: React.FC<TournamentListProps> = ({ tournaments, onSelectTournament }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'LIVE'>('ALL');

  const handleSelect = useCallback((t: Tournament) => {
    audioService.play(SOUNDS.CLICK);
    onSelectTournament(t);
  }, [onSelectTournament]);

  const filtered = useMemo(() => tournaments.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || t.status === filter;
    return matchesSearch && matchesFilter;
  }), [tournaments, search, filter]);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-24 transform-gpu">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-2">
        <div>
          <h2 className="text-3xl md:text-6xl font-black font-cyber text-white italic uppercase tracking-tighter leading-none">
            OPERATIONAL <span className="text-[#a855f7] neon-glow-purple">ARENA</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[8px] md:text-[10px] mt-2 md:mt-3">Tactical Matrix • Protocol v.6.2.0</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#a855f7]" size={14} />
            <input type="text" placeholder="SCAN OPS..." value={search} onChange={(e) => setSearch(e.target.value)}
                   className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 w-full sm:w-64 focus:border-[#a855f7]/50 focus:bg-[#a855f7]/5 outline-none transition-all font-black tracking-widest text-[10px] uppercase placeholder:text-gray-700" />
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            {(['ALL', 'LIVE', 'UPCOMING'] as const).map(f => (
              <button key={f} onClick={() => { setFilter(f); audioService.play(SOUNDS.CLICK); }}
                      className={`flex-1 sm:flex-none px-4 md:px-6 py-2 text-[8px] md:text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${filter === f ? 'bg-[#a855f7] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 px-2 min-h-[400px]">
        {filtered.length > 0 ? filtered.map(t => <TournamentCard key={t.id} t={t} onClick={() => handleSelect(t)} />) : (
          <div className="col-span-full py-20 md:py-32 text-center space-y-6 cyber-card rounded-[2rem] md:rounded-[3rem] border-white/5 bg-black/40 flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10"><Search className="text-gray-700" size={24} /></div>
             <p className="text-[10px] md:text-sm text-gray-600 font-bold uppercase tracking-[0.4em]">No matching operations found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentList;
