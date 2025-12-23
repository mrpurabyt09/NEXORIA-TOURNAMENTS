
import React, { useState } from 'react';
import { Info, ShieldCheck, FileText, User as UserIcon, Code, Globe, Shield } from 'lucide-react';

const LegalInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ABOUT' | 'AGREEMENT' | 'PRIVACY' | 'AUTHOR'>('ABOUT');

  const sections = [
    { id: 'ABOUT', label: 'About Nexoria', icon: <Globe size={18} /> },
    { id: 'AGREEMENT', label: 'Operator Agreement', icon: <FileText size={18} /> },
    { id: 'PRIVACY', label: 'Privacy Protocol', icon: <Shield size={18} /> },
    { id: 'AUTHOR', label: 'Dev Collective', icon: <Code size={18} /> },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-4xl font-black font-cyber text-[#a855f7] neon-glow-purple italic uppercase tracking-tighter">Nexoria Hub</h2>
        <div className="flex flex-wrap justify-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === section.id ? 'bg-[#a855f7] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {section.icon}
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cyber-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          {activeTab === 'ABOUT' && <Globe size={200} />}
          {activeTab === 'AGREEMENT' && <FileText size={200} />}
          {activeTab === 'PRIVACY' && <Shield size={200} />}
          {activeTab === 'AUTHOR' && <Code size={200} />}
        </div>

        {activeTab === 'ABOUT' && (
          <div className="space-y-6 relative z-10">
            <h3 className="text-2xl font-black font-cyber text-white uppercase italic">The Nexoria Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              Established in 2024, <span className="text-[#a855f7] font-bold">Nexoria Tournaments</span> represents the pinnacle of competitive mobile gaming. We provide a sanitized, high-stakes arena where skill is the only currency that matters.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our <span className="text-[#ec4899] font-bold">Nexoria Sentinel</span> system ensures absolute integrity through quantum behavioral analysis. Nexoria is more than a platform—it is the digital evolution of the warrior spirit.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-[#a855f7] text-xl font-black">25K+</p>
                <p className="text-[10px] text-gray-500 font-black uppercase">Operators</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-[#22c55e] text-xl font-black">1.2K+</p>
                <p className="text-[10px] text-gray-500 font-black uppercase">Combat Ops</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-[#ec4899] text-xl font-black">₹12M+</p>
                <p className="text-[10px] text-gray-500 font-black uppercase">Prizes Synced</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'AGREEMENT' && (
          <div className="space-y-6 relative z-10">
            <h3 className="text-2xl font-black font-cyber text-white uppercase italic">Rules of Engagement</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <p>By entering the Nexoria Arena, you agree to absolute adherence to our competitive protocols. Zero tolerance for anomalies.</p>
            </div>
          </div>
        )}

        {activeTab === 'PRIVACY' && (
          <div className="space-y-6 relative z-10">
            <h3 className="text-2xl font-black font-cyber text-white uppercase italic">Nexoria Privacy Protocol</h3>
            <p className="text-gray-300 leading-relaxed">Your biometric and digital signatures are encrypted using Nexoria's proprietary vault architecture.</p>
          </div>
        )}

        {activeTab === 'AUTHOR' && (
          <div className="space-y-8 relative z-10 text-center py-4">
            <div className="inline-flex flex-col items-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#a855f7] to-[#ec4899] p-1 shadow-[0_0_30px_rgba(168,85,247,0.4)] mb-4">
                <div className="w-full h-full bg-[#0a0a0f] rounded-[22px] flex items-center justify-center text-[#a855f7]">
                  <span className="text-5xl font-black font-cyber skew-x-[-12deg]">X</span>
                </div>
              </div>
              <h3 className="text-3xl font-black font-cyber text-white uppercase italic tracking-tighter">Nexoria Dev Collective</h3>
              <p className="text-[#a855f7] font-bold uppercase tracking-[0.3em] text-xs">Architects of the Arena</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalInfo;
