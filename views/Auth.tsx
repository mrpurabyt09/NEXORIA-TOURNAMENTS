
import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, Mail, Lock, User as UserIcon, Gamepad2, Hash, Loader2 } from 'lucide-react';
import { audioService, SOUNDS } from '../services/audioService';
import { NexoriaLogo } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bgmiId, setBgmiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (loginState: boolean) => {
    setIsLogin(loginState);
    audioService.play(SOUNDS.CLICK);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isLogin) {
      audioService.play(SOUNDS.CLICK);
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: username || email.split('@')[0],
        email: email,
        role: email.includes('admin') ? 'ADMIN' : 'USER',
        balance: 500,
        bgmiId: bgmiId || '5123445566' 
      };
      
      onLogin(mockUser);
    } else {
      audioService.play(SOUNDS.SUCCESS);
      setTimeout(() => {
        setIsLoading(false);
        alert("ACCOUNT SYNC COMPLETE!");
        setIsLogin(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-rajdhani">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#a855f7] opacity-20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ec4899] opacity-10 blur-[150px] rounded-full animate-pulse"></div>
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        <div className="text-center mb-6 md:mb-10 space-y-2 scale-90 md:scale-100">
          <NexoriaLogo className="mb-6 animate-bounce" />
        </div>

        <div className="cyber-card w-full p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-[#a855f7] rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 border-b-2 border-l-2 border-[#a855f7] rounded-bl-3xl"></div>

          <div className="flex mb-6 md:mb-8 bg-white/5 p-1 rounded-xl">
            <button 
              disabled={isLoading}
              onClick={() => handleTabChange(true)}
              className={`flex-1 py-2.5 md:py-3 text-xs md:text-sm font-black rounded-lg transition-all ${isLogin ? 'bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:text-white'}`}
            >
              LOGIN
            </button>
            <button 
              disabled={isLoading}
              onClick={() => handleTabChange(false)}
              className={`flex-1 py-2.5 md:py-3 text-xs md:text-sm font-black rounded-lg transition-all ${!isLogin ? 'bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:text-white'}`}
            >
              REGISTER
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Username</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#a855f7]" size={18} />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-[#a855f7]/50 focus:bg-[#a855f7]/5 transition-all font-bold text-sm"
                      placeholder="NexoriaStriker"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">BGMI ID</label>
                  <div className="relative group">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#a855f7]" size={18} />
                    <input 
                      type="text" 
                      value={bgmiId}
                      onChange={(e) => setBgmiId(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-[#a855f7]/50 focus:bg-[#a855f7]/5 transition-all font-mono font-bold tracking-widest text-sm"
                      placeholder="5123445566"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#a855f7]" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-[#a855f7]/50 focus:bg-[#a855f7]/5 transition-all font-bold text-sm"
                  placeholder="warrior@nexoria.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#a855f7]" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-[#a855f7]/50 focus:bg-[#a855f7]/5 transition-all font-bold text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-4 rounded-xl font-black text-sm md:text-lg tracking-widest transition-all shadow-[0_4px_20px_rgba(168,85,247,0.4)] active:scale-[0.98] flex items-center justify-center gap-2 group uppercase mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Initialize' : 'Register'}
                  <ShieldCheck size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
