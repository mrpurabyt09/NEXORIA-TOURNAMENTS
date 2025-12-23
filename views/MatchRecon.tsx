
import React, { useState, useRef } from 'react';
import { Target, Upload, Cpu, Award, TrendingUp, Search, RefreshCw, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import { analyzeMatchResult } from '../services/geminiService';
import { audioService, SOUNDS } from '../services/audioService';

const MatchRecon: React.FC = () => {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      audioService.play(SOUNDS.CLICK);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshot(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runRecon = async () => {
    if (!screenshot || analyzing) return;
    setAnalyzing(true);
    audioService.play(SOUNDS.SCAN);
    const result = await analyzeMatchResult(screenshot);
    setReport(result);
    setAnalyzing(false);
    audioService.play(SOUNDS.SUCCESS);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20 font-rajdhani">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black font-cyber text-white italic uppercase tracking-tighter leading-none">
            NEX-RECON <span className="text-[#a855f7] neon-glow-purple">SCANNER</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">Combat Diagnostic Interface v2.1</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#a855f7]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Neural Sync 100%</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-4 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="cyber-card aspect-[4/3] rounded-[2.5rem] border-dashed border-2 border-white/10 hover:border-[#a855f7]/50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group bg-black/40"
          >
            {screenshot ? (
              <img src={screenshot} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            ) : (
              <>
                <div className="p-6 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={32} className="text-gray-600 group-hover:text-[#a855f7]" />
                </div>
                <p className="text-xs font-black uppercase text-gray-500 tracking-widest">Ingest Combat Data</p>
              </>
            )}
            <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
          </div>

          <button 
            disabled={!screenshot || analyzing}
            onClick={runRecon}
            className="w-full py-5 rounded-2xl bg-[#a855f7] hover:bg-[#ec4899] text-white font-black text-xl tracking-[0.2em] shadow-xl shadow-[#a855f7]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase italic"
          >
            {analyzing ? <RefreshCw className="animate-spin" /> : <><Search size={22} /> Initiate Recon</>}
          </button>
        </div>

        {/* Report Column */}
        <div className="lg:col-span-8">
          <div className="cyber-card rounded-[3rem] p-10 min-h-[500px] border-white/5 relative overflow-hidden bg-black/20 backdrop-blur-md">
            {analyzing ? (
              <div className="h-full flex flex-col items-center justify-center space-y-8 py-20">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-[#a855f7]/20 border-t-[#a855f7] rounded-full animate-spin"></div>
                  <Cpu size={32} className="absolute inset-0 m-auto text-[#a855f7] animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                   <p className="text-xl font-black font-cyber text-white uppercase italic tracking-widest animate-pulse">Scanning Match Result...</p>
                   <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em]">Gemini 3 Pro Deep Reasoning Active</p>
                </div>
              </div>
            ) : report ? (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                 <div className="flex items-start justify-between">
                    <div className="space-y-2">
                       <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.4em]">Combat Grade</h3>
                       <div className="flex items-baseline gap-4">
                          <span className={`text-8xl font-black font-cyber italic leading-none ${report.grade === 'S' ? 'text-amber-500 neon-glow-purple' : 'text-white'}`}>{report.grade}</span>
                          <div className="space-y-1">
                             <div className="flex items-center gap-1 text-emerald-500">
                                <TrendingUp size={14} />
                                <span className="text-sm font-black font-cyber">RATING: {report.combat_rating}</span>
                             </div>
                             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Neural Performance Index</p>
                          </div>
                       </div>
                    </div>
                    <Award size={64} className="text-[#a855f7] opacity-20" />
                 </div>

                 <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <p className="text-sm leading-relaxed text-gray-300 font-medium italic">"{report.summary}"</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck size={14} /> Critical Strengths
                       </h4>
                       <ul className="space-y-2">
                          {report.strengths.map((s: string, i: number) => (
                            <li key={i} className="text-xs font-bold text-gray-400 flex gap-2"><span className="text-emerald-500">»</span> {s}</li>
                          ))}
                       </ul>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-[#a855f7] uppercase tracking-widest flex items-center gap-2">
                          <Target size={14} /> Refinement Areas
                       </h4>
                       <ul className="space-y-2">
                          {report.weaknesses.map((w: string, i: number) => (
                            <li key={i} className="text-xs font-bold text-gray-400 flex gap-2"><span className="text-[#a855f7]">»</span> {w}</li>
                          ))}
                       </ul>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                       <Zap size={14} className="text-amber-500" /> Strategic Roadmap
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {report.tactical_roadmap.map((step: string, i: number) => (
                         <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 relative group hover:border-[#a855f7]/30 transition-all">
                            <span className="absolute -top-2 -left-2 w-6 h-6 bg-black border border-[#a855f7] rounded-full flex items-center justify-center text-[8px] font-black text-[#a855f7]">{i+1}</span>
                            <p className="text-[10px] font-bold text-gray-400 leading-snug">{step}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 opacity-30">
                  <Target size={40} className="text-gray-600" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-lg font-black font-cyber text-gray-500 uppercase">Awaiting Combat Telemetry</h3>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-widest leading-relaxed">Upload your match result screenshot to synchronize neural data and generate a Tactical Recon report.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchRecon;
