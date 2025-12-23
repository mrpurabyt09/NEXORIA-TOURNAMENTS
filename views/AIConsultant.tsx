
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Cpu, Zap, Send, BrainCircuit, ShieldCheck, RefreshCw, 
  Terminal, Image as ImageIcon, X, ExternalLink, Map as MapIcon, 
  Target, Info, ChevronRight, Activity, Radar, Mic, MicOff, Volume2, AudioWaveform
} from 'lucide-react';
import { 
  getTacticalAdviceStream, 
  connectLiveStrategist, 
  decodeAudio, 
  decodeAudioData, 
  encodeAudio 
} from '../services/geminiService';
import { audioService, SOUNDS } from '../services/audioService';
import { api } from '../services/apiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
  type?: 'fast' | 'thinking';
  images?: string[];
  grounding?: { uri: string; title: string }[];
  toolCall?: string;
}

const AIConsultant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      text: 'NEX-IA QUANTUM-X STRATEGIST ONLINE. Neural memory active.', 
      type: 'fast' 
    }
  ]);
  const [input, setInput] = useState('');
  const [useThinking, setUseThinking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Live API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isListening]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      audioService.play(SOUNDS.CLICK);
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setSelectedImages(prev => [...prev, reader.result as string].slice(-3));
        reader.readAsDataURL(file);
      });
    }
  };

  /**
   * LIVE TACTICAL LINK HANDLER
   */
  const toggleLiveLink = async () => {
    if (isLive) {
      // Shutdown
      setIsLive(false);
      setIsListening(false);
      mediaStreamRef.current?.getTracks().forEach(t => t.stop());
      liveSessionRef.current?.close();
      return;
    }

    try {
      audioService.play(SOUNDS.SCAN);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = connectLiveStrategist({
        onopen: () => {
          setIsLive(true);
          setIsListening(true);
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: { data: encodeAudio(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } });
            });
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: any) => {
          const audioBase64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioBase64) {
            const bytes = decodeAudio(audioBase64);
            const buffer = await decodeAudioData(bytes, outputCtx, 24000, 1);
            const source = outputCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtx.destination);
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
          }
        },
        onclose: () => setIsLive(false),
        onerror: () => setIsLive(false),
      });

      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      alert("Microphone access required for Live Tactical Link.");
    }
  };

  const handleSend = async (customQuery?: string) => {
    const queryToUse = customQuery || input;
    if (!queryToUse.trim() || isLoading) return;
    
    const userMsg = queryToUse;
    const currentImgs = [...selectedImages];
    
    setInput('');
    setSelectedImages([]);
    setMessages(prev => [...prev, { role: 'user', text: userMsg, images: currentImgs.length > 0 ? currentImgs : undefined }]);
    setIsLoading(true);
    audioService.play(SOUNDS.SCAN);

    try {
      const history = messages.slice(-4).map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const responseStream = await getTacticalAdviceStream(userMsg, useThinking, currentImgs, history);
      if (!responseStream) throw new Error("Stream disrupted.");

      let fullText = '';
      let grounding: any[] = [];
      setMessages(prev => [...prev, { role: 'ai', text: '', type: useThinking ? 'thinking' : 'fast' }]);

      for await (const chunk of responseStream) {
        const text = chunk.text || '';
        fullText += text;
        const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) grounding = chunks.map((c: any) => c.web).filter(Boolean);

        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === 'ai') {
            last.text = fullText;
            last.grounding = grounding;
          }
          return updated;
        });
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'TACTICAL LINK DISRUPTED.', type: 'fast' }]);
    } finally {
      setIsLoading(false);
      audioService.play(SOUNDS.NOTIF);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500 font-rajdhani h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] flex flex-col px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative shrink-0">
            <BrainCircuit className={`relative w-8 h-8 md:w-12 md:h-12 ${isLive ? 'text-[#ec4899] animate-pulse' : 'text-[#a855f7]'}`} />
          </div>
          <div>
            <h2 className="text-xl md:text-4xl font-black font-cyber text-white italic uppercase tracking-tighter flex items-center gap-2">
              NEX-IA <span className="text-[#a855f7] neon-glow-purple">QUANTUM-X</span>
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[7px] md:text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em]">NEURAL CORE OPERATIONAL</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5 backdrop-blur-xl">
           <button 
             onClick={toggleLiveLink}
             className={`flex items-center gap-1.5 px-3 py-1.5 md:px-6 md:py-2.5 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${isLive ? 'bg-rose-500 text-white' : 'bg-white/5 text-gray-500'}`}
           >
             {isLive ? <MicOff size={12} /> : <Mic size={12} />} {isLive ? 'TERMINATE' : 'LIVE LINK'}
           </button>
           <button 
             onClick={() => { setUseThinking(!useThinking); audioService.play(SOUNDS.CLICK); }}
             className={`flex items-center gap-1.5 px-3 py-1.5 md:px-6 md:py-2.5 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${useThinking ? 'bg-[#a855f7] text-white' : 'bg-white/5 text-gray-500'}`}
           >
             <Cpu size={12} /> {useThinking ? 'THINKING' : 'FLASH'}
           </button>
        </div>
      </div>

      <div className="flex-1 cyber-card rounded-2xl md:rounded-[3.5rem] border-white/5 bg-[#050505]/90 backdrop-blur-3xl overflow-hidden flex flex-col relative shadow-2xl">
        {isLive && (
          <div className="absolute top-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-b from-[#ec4899]/10 to-transparent pointer-events-none flex items-center justify-center gap-0.5 md:gap-1 overflow-hidden">
             {Array.from({ length: 30 }).map((_, i) => (
               <div key={i} className="w-0.5 md:w-1 bg-[#ec4899] rounded-full animate-bounce" style={{ height: `${Math.random() * 80}%`, animationDuration: `${0.5 + Math.random()}s` }}></div>
             ))}
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-14 space-y-8 md:space-y-12 custom-scrollbar relative z-10">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-6 duration-500`}>
              <div className={`max-w-[90%] md:max-w-[85%] space-y-2 md:space-y-4`}>
                <div className={`flex items-center gap-2 md:gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`w-6 h-6 md:w-9 md:h-9 rounded-lg flex items-center justify-center border ${m.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-[#a855f7]/10 border-[#a855f7]/40 text-[#a855f7]'}`}>
                      {m.role === 'user' ? <Terminal size={12} /> : <BrainCircuit size={12} />}
                   </div>
                   <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-gray-600">
                     {m.role === 'user' ? 'SIGNAL' : 'OUTPUT'}
                   </span>
                </div>

                <div className={`p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border ${m.role === 'user' ? 'bg-[#a855f7]/10 border-[#a855f7]/30 rounded-tr-none' : 'bg-white/5 border-white/5 rounded-tl-none'} shadow-2xl backdrop-blur-md overflow-hidden`}>
                  {m.images && (
                    <div className="flex gap-2 md:gap-4 mb-4 md:mb-6 overflow-x-auto pb-2 scrollbar-hide">
                       {m.images.map((img, idx) => (
                         <img key={idx} src={img} className="shrink-0 w-32 h-20 md:w-64 md:h-40 rounded-xl md:rounded-2xl object-cover border border-white/10" />
                       ))}
                    </div>
                  )}
                  
                  <p className={`text-xs md:text-base leading-relaxed whitespace-pre-wrap ${m.role === 'ai' ? 'text-gray-200' : 'text-white font-bold'}`}>
                    {m.text || <span className="inline-block w-1.5 h-4 bg-[#a855f7] animate-pulse"></span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && !messages[messages.length - 1].text && (
            <div className="flex justify-start">
               <div className="max-w-[70%] p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-white/5 border border-white/10 rounded-tl-none">
                  <RefreshCw size={16} className="animate-spin text-[#a855f7]" />
               </div>
            </div>
          )}
        </div>

        {/* Tactical Control Console - Responsive Input */}
        <div className="p-4 md:p-10 bg-black/80 border-t border-white/5 backdrop-blur-3xl">
          <div className="flex gap-2 md:gap-4 mb-4 md:mb-8 overflow-x-auto pb-2 scrollbar-hide">
             {[
               { label: 'META', icon: <Radar size={12}/>, query: 'Season weapon meta?' },
               { label: 'ROTATE', icon: <MapIcon size={12}/>, query: 'Georgopol rotations?' },
               { label: 'LOADOUT', icon: <Target size={12}/>, query: 'M416 optimization?' }
             ].map((cmd, i) => (
              <button key={i} disabled={isLoading} onClick={() => handleSend(cmd.query)} className="shrink-0 flex items-center gap-2 px-3 py-1.5 md:px-6 md:py-3 bg-white/5 border border-white/10 rounded-xl text-[7px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-all">
                {cmd.icon} {cmd.label}
              </button>
             ))}
          </div>

          <div className="flex items-end gap-2 md:gap-6">
            <div className="flex-1 relative">
              {selectedImages.length > 0 && (
                <div className="absolute bottom-full left-0 mb-4 flex gap-2 p-2 bg-black/60 border border-white/10 rounded-xl backdrop-blur-xl">
                   {selectedImages.map((img, i) => (
                     <div key={i} className="relative group/img">
                        <img src={img} className="w-10 h-10 md:w-16 md:h-16 rounded-lg object-cover border border-white/20" />
                        <button onClick={() => setSelectedImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1.5 -right-1.5 bg-rose-500 rounded-full p-0.5"><X size={10}/></button>
                     </div>
                   ))}
                </div>
              )}
              
              <div className="relative group">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isLive ? "Speak..." : "Tactical query..."}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-[2.5rem] py-4 md:py-8 pl-10 md:pl-16 pr-20 md:pr-32 outline-none focus:border-[#a855f7]/50 transition-all font-black tracking-widest text-[10px] md:text-sm"
                />
                <button onClick={() => fileInputRef.current?.click()} className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-gray-600"><ImageIcon size={18} /></button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" multiple accept="image/*" />
                
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || (!input.trim() && selectedImages.length === 0)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 md:px-8 md:py-4 bg-[#a855f7] text-white rounded-lg md:rounded-[1.5rem] font-black text-[9px] md:text-[11px] uppercase tracking-widest disabled:opacity-30"
                >
                  <Send size={14} className="md:hidden" />
                  <span className="hidden md:inline">EXECUTE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
