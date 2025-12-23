
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Tournament, Transaction } from './types';
import { NAVIGATION, ADMIN_NAVIGATION, NexoriaLogo } from './constants';
import { LogOut, Wallet, Menu, Plus, Loader2, Globe, SignalHigh, Bell, X, Zap, Cpu, Radio } from 'lucide-react';
import { audioService, SOUNDS } from './services/audioService';
import { api } from './services/apiService';
import { ws, GlobalEvent } from './services/webSocketService';

// Sub-views
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import TournamentList from './views/TournamentList';
import TournamentDetail from './views/TournamentDetail';
import WalletView from './views/Wallet';
import AntiCheatView from './views/AntiCheat';
import AdminHub from './views/Admin/AdminHub';
import LegalInfo from './views/LegalInfo';
import Profile from './views/Profile';
import AIConsultant from './views/AIConsultant';
import MatchRecon from './views/MatchRecon';

const NEXUS_CHANNEL = new BroadcastChannel('nexoria_nexus');

const NeuralTicker: React.FC = () => {
  const messages = [
    "PROTOCOL ALERT: SENTINEL DETECTED 4 ANOMALIES IN ASIA-1",
    "MARKET INTEL: TOURNAMENT PRIZE POOLS SURGED BY 15% THIS HOUR",
    "OPERATOR STATUS: GHOST_OPS SECURED RANK #1 IN POCHINKI SCRIMS",
    "SYSTEM UPDATE: NEX-IA QUANTUM-X CORE UPGRADED TO V5.2",
    "LIVE EVENT: PRO INVITATIONAL STARTS IN T-MINUS 2 HOURS"
  ];
  
  return (
    <div className="h-6 md:h-8 bg-[#a855f7]/10 border-b border-[#a855f7]/20 flex items-center overflow-hidden z-[60] relative">
      <div className="ticker-animation py-1 px-4">
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="mx-8 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#a855f7] whitespace-nowrap">
            <Radio size={12} className="inline mr-2 mb-0.5" />
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [currentRegion, setCurrentRegion] = useState('MUMBAI-CENTRAL');
  const [notifications, setNotifications] = useState<GlobalEvent[]>([]);

  const refreshData = useCallback(async (userId: string) => {
    const [ts, txs] = await Promise.all([
      api.getTournaments(),
      api.getTransactions(user?.role === 'ADMIN' ? undefined : userId)
    ]);
    setTournaments(ts);
    setTransactions(txs);
    
    const savedUser = localStorage.getItem('nexoria_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, [user?.role]);

  useEffect(() => {
    const init = async () => {
      const savedUser = localStorage.getItem('nexoria_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setUser(u);
        refreshData(u.id);
      } else {
        const ts = await api.getTournaments();
        setTournaments(ts);
      }
    };
    init();

    NEXUS_CHANNEL.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'USER_LOGOUT') {
        setUser(null);
        setActiveTab('dashboard');
      } else if (['TRANSACTION_CREATED', 'TRANSACTION_UPDATED', 'TOURNAMENT_JOIN'].includes(type)) {
        if (user) refreshData(user.id);
      } else if (type === 'USER_LOGIN') {
        setUser(payload);
        refreshData(payload.id);
      }
    };

    const unsubscribe = ws.subscribe((event) => {
      setNotifications(prev => [event, ...prev].slice(0, 3));
      audioService.play(SOUNDS.NOTIF, 0.1);
      setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== event.id)), 5000);
    });

    return () => {
      NEXUS_CHANNEL.close();
      unsubscribe();
    };
  }, [user?.id, refreshData]);

  const handleLogin = useCallback(async (u: User) => {
    setIsGlobalLoading(true);
    const validatedUser = await api.login(u.email);
    setUser(validatedUser);
    await refreshData(validatedUser.id);
    setIsGlobalLoading(false);
  }, [refreshData]);

  const handleLogout = useCallback(async () => {
    audioService.play(SOUNDS.REJECT);
    await api.logout();
    setUser(null);
  }, []);

  const addTransaction = useCallback(async (tx: Transaction) => {
    await api.createTransaction(tx);
    if (user) refreshData(user.id);
  }, [user, refreshData]);

  const updateBalance = useCallback((amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, balance: prev.balance + amount };
      localStorage.setItem('nexoria_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const navigateTo = useCallback((tab: string) => {
    audioService.play(SOUNDS.CLICK);
    setActiveTab(tab);
    setSelectedTournament(null);
    setSidebarOpen(false);
  }, []);

  const navItems = useMemo(() => user?.role === 'ADMIN' ? ADMIN_NAVIGATION : NAVIGATION, [user?.role]);

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden font-rajdhani transform-gpu">
      <NeuralTicker />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Notifications */}
        <div className="fixed top-24 right-4 left-4 md:left-auto md:right-6 z-[100] space-y-3 pointer-events-none">
          {notifications.map(notif => (
            <div key={notif.id} className="w-full md:w-80 p-4 bg-black/90 border border-[#a855f7]/40 rounded-2xl shadow-xl pointer-events-auto animate-in slide-in-from-right-8 backdrop-blur-xl">
               <div className="flex gap-3">
                  <div className="p-2 bg-[#a855f7]/20 text-[#a855f7] rounded-lg shrink-0">
                     <Bell size={16} />
                  </div>
                  <div className="flex-1">
                     <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">{notif.type}</p>
                     <p className="text-xs font-bold text-white">{notif.message}</p>
                  </div>
                  <button onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))} className="text-gray-600 hover:text-white">
                     <X size={14} />
                  </button>
               </div>
            </div>
          ))}
        </div>

        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0f] border-r border-white/5 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-8 flex justify-between items-center">
              <NexoriaLogo size={32} />
              <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
            </div>
            <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === item.path 
                      ? 'bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20' 
                      : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className={`${activeTab === item.path ? 'scale-110' : 'group-hover:scale-105'} transition-transform shrink-0`}>{item.icon}</div>
                  <span className="font-black uppercase text-[10px] tracking-[0.2em] whitespace-nowrap">{item.name}</span>
                </button>
              ))}
            </nav>
            <div className="p-6 border-t border-white/5">
               <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center font-black text-white text-lg uppercase shrink-0">{user.username.charAt(0)}</div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold truncate text-[11px] uppercase tracking-wider">{user.username}</p>
                    <p className="text-[9px] text-gray-600 font-bold truncate uppercase tracking-tighter">{user.role}</p>
                  </div>
                  <button onClick={handleLogout} className="text-gray-600 hover:text-rose-500 transition-colors"><LogOut size={16} /></button>
               </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-2.5rem)] overflow-hidden relative">
          <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-10 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="flex items-center gap-3 md:gap-6">
              <button className="lg:hidden p-2 text-gray-500" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
              <div className="hidden lg:flex items-center gap-6">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">NEXUS CONNECTED</span>
                 </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 md:gap-4 bg-white/5 border border-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl cursor-pointer hover:bg-white/10 transition-all active:scale-95" onClick={() => navigateTo('wallet')}>
                <Wallet size={14} className="text-[#a855f7]" />
                <div className="flex flex-col">
                  <span className="text-[7px] md:text-[8px] text-gray-600 font-black uppercase tracking-widest leading-none mb-0.5">Balance</span>
                  <span className="font-black text-white text-[10px] md:text-xs font-cyber tracking-widest leading-none">₹{user.balance.toLocaleString()}</span>
                </div>
                <div className="ml-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#a855f7] text-white flex items-center justify-center shrink-0"><Plus size={10} /></div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar relative bg-[#050505]">
            <div key={activeTab} className="view-transition">
              {activeTab === 'dashboard' && <Dashboard user={user} tournaments={tournaments} onSelectTournament={(t) => { setSelectedTournament(t); setActiveTab('detail'); }} currentRegion={currentRegion} />}
              {activeTab === 'tournaments' && <TournamentList tournaments={tournaments} onSelectTournament={(t) => { setSelectedTournament(t); setActiveTab('detail'); }} />}
              {activeTab === 'detail' && selectedTournament && <TournamentDetail tournament={selectedTournament} user={user} onUpdateBalance={updateBalance} addTransaction={addTransaction} onBack={() => setActiveTab('tournaments')} />}
              {activeTab === 'wallet' && <WalletView user={user} transactions={transactions} addTransaction={addTransaction} />}
              {activeTab === 'match_recon' && <MatchRecon />}
              {activeTab === 'anticheat' && <AntiCheatView user={user} />}
              {activeTab === 'ai_consultant' && <AIConsultant />}
              {activeTab === 'legal' && <LegalInfo />}
              {activeTab === 'profile' && <Profile user={user} />}
              {activeTab === 'admin' && user.role === 'ADMIN' && (
                <AdminHub 
                  user={user} 
                  tournaments={tournaments} 
                  setTournaments={setTournaments} 
                  transactions={transactions}
                  approveTransaction={() => refreshData(user.id)} 
                />
              )}
            </div>
          </div>
        </main>
        {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
      </div>
    </div>
  );
};

export default App;
