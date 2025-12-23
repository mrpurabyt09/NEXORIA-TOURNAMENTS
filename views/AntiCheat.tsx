
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { ShieldAlert, Upload, Terminal, Cpu, Camera, AlertCircle, CheckCircle2, Search, RefreshCw } from 'lucide-react';
import { analyzeAntiCheat } from '../services/geminiService';
import { audioService, SOUNDS } from '../services/audioService';

interface AntiCheatProps {
  user: User;
}

const AntiCheatView: React.FC<AntiCheatProps> = ({ user }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [matchLogs, setMatchLogs] = useState('');
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      audioService.play(SOUNDS.CLICK);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAnalysis = async () => {
    if (!screenshot || !matchLogs) return;
    setAnalyzing(true);
    audioService.play(SOUNDS.SCAN);
    const analysisResult = await analyzeAntiCheat(screenshot, matchLogs);
    setResult(analysisResult);
    setAnalyzing(false);
    audioService.play(SOUNDS.NOTIF);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 animate-in fade-in slide-in-from-top-6 duration-500 pb-20 px-1 md:px-0">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-between p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#110c1d] to-[#0a0a0f] border border-[#a855f7]/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-[#a855f7]/10 flex items-center justify-center border-2 border-[#a855f7] animate-pulse shrink-0">
            <ShieldAlert size={32} className="text-[#a855f7] md:w-10 md:h-10" />
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-black font-cyber text-white italic uppercase tracking-tighter">Nexoria Sentinel</h2>
            <p className="text-[#a855f7] font-bold text-[9px] md:text-sm tracking-widest uppercase">NEX-AI HEURISTIC v5.0</p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex-1 text-center px-3 py-1.5 md:px-4 md:py-2 bg-black/40 rounded-xl border border-white/5">
             <p className="text-[7px] md:text-[10px] text-gray-500 font-black">SCAN ENGINE</p>
             <p className="text-[10px] md:text-sm font-bold text-[#22c55e]">NEX-SYNC</p>
          </div>
          <div className="flex-1 text-center px-3 py-1.5 md:px-4 md:py-2 bg-black/40 rounded-xl border border-white/5">
             <p className="text-[7px] md:text-[10px] text-gray-500 font-black">LATENCY</p>
             <p className="text-[10px] md:text-sm font-bold text-[#eab308]">8ms</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
          <h3 className="text-lg md:text-xl font-black font-cyber uppercase tracking-widest text-white/80 italic">Submit Evidence</h3>
          
          <div className="space-y-4">
            <div 
              onClick={() => { audioService.play(SOUNDS.CLICK); fileInputRef.current?.click(); }}
              className="group cursor-pointer aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-[#a855f7]/50 bg-white/5 hover:bg-[#a855f7]/5 flex flex-col items-center justify-center transition-all overflow-hidden relative"
            >
              {screenshot ? (
                <img src={screenshot} alt="Evidence" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="text-gray-500 group-hover:text-[#a855f7] mb-2 transition-colors" size={28} />
                  <p className="text-[10px] md:text-sm font-black text-gray-500 group-hover:text-white uppercase tracking-widest">Protocol Upload Portal</p>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>

            <div className="space-y-2">
              <label className="block text-[8px] md:text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Behavioral Match Logs</label>
              <textarea 
                value={matchLogs}
                onChange={(e) => setMatchLogs(e.target.value)}
                placeholder="Log suspicious behavior observed in the Nexoria Arena..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-[#a855f7]/50 focus:bg-white/10 transition-all font-mono text-xs md:text-sm"
              />
            </div>

            <button 
              onClick={handleRunAnalysis}
              disabled={analyzing || !screenshot || !matchLogs}
              className="w-full bg-[#a855f7] text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black tracking-widest transition-all flex items-center justify-center gap-2 group disabled:opacity-50 text-xs md:text-base uppercase italic"
            >
              {analyzing ? <RefreshCw className="animate-spin" /> : (
                <>
                  INITIATE SENTINEL SCAN
                  <Search size={18} className="group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
          <h3 className="text-lg md:text-xl font-black font-cyber uppercase tracking-widest text-[#a855f7] italic">Sentinel Output</h3>
          
          <div className="cyber-card rounded-2xl md:rounded-3xl p-6 md:p-10 border border-white/5 min-h-[300px] md:min-h-[400px] flex flex-col justify-center bg-black/20 backdrop-blur-md h-full">
            {analyzing ? (
              <div className="text-center space-y-4 md:space-y-6">
                <div className="relative inline-block">
                  <Cpu className="text-[#a855f7] animate-spin" size={48} />
                  <div className="absolute inset-0 bg-[#a855f7] opacity-20 blur-xl rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm md:text-lg font-black font-cyber text-white uppercase italic tracking-widest animate-pulse">Scanning Matrix...</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6 md:space-y-8 animate-in zoom-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest">SENTINEL VERDICT</p>
                    <h4 className={`text-3xl md:text-5xl font-black font-cyber italic leading-none ${result.status === 'CLEAN' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                      {result.status}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest">CONFIDENCE</p>
                    <p className="text-xl md:text-2xl font-black font-cyber italic">{result.confidence}%</p>
                  </div>
                </div>

                <div className="bg-white/5 p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/5">
                  <p className="text-[8px] text-gray-600 font-black mb-2 uppercase tracking-widest">Sentinel Summary</p>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-300 font-medium">{result.analysis}</p>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button onClick={() => { audioService.play(SOUNDS.CLICK); setResult(null); }} className="w-full py-3 bg-white/5 text-gray-500 border border-white/10 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                    Reset Sync
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-40">
                <Terminal size={32} className="mx-auto text-gray-700" />
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-gray-600">Sentinel Idle • Awaiting Data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AntiCheatView;
