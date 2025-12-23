
import React, { useState, useMemo } from 'react';
import { User, Transaction } from '../types';
import { 
  Plus, ArrowUpRight, ArrowDownLeft, QrCode, CheckCircle2, 
  Copy, Shield, Lock, CreditCard as CardIcon, Hash, 
  User as UserIcon, Calendar, ShieldAlert, ReceiptText, 
  Landmark, Zap, ChevronLeft, ArrowRight, AlertTriangle,
  ShieldCheck, Activity, UserCheck, Wifi, Clock, XCircle
} from 'lucide-react';
import { audioService, SOUNDS } from '../services/audioService';

interface WalletProps {
  user: User;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
}

const WalletView: React.FC<WalletProps> = ({ user, transactions, addTransaction }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'BANK'>('UPI');
  const [step, setStep] = useState<'AMOUNT' | 'PAYMENT'>('AMOUNT');
  const [isConfirming, setIsConfirming] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // User Bank Details for Withdrawal
  const [userAccName, setUserAccName] = useState('');
  const [userAccNum, setUserAccNum] = useState('');
  const [userAccIfsc, setUserAccIfsc] = useState('');

  const handleProceedToPayment = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < 50) {
      audioService.play(SOUNDS.REJECT);
      alert("Minimum magnitude is ₹50");
      return;
    }
    if (showWithdraw && user.balance < val) {
      audioService.play(SOUNDS.REJECT);
      alert("Insufficient credits in Nexoria vault.");
      return;
    }
    audioService.play(SOUNDS.CLICK);
    setStep('PAYMENT');
  };

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (showWithdraw && method === 'BANK' && (!userAccName || !userAccNum || !userAccIfsc)) {
      audioService.play(SOUNDS.REJECT);
      alert("Please provide all recipient bank details.");
      return;
    }
    audioService.play(SOUNDS.CLICK);
    setIsConfirming(true);
  };

  const executeTransaction = () => {
    setIsConfirming(false);
    audioService.play(SOUNDS.CLICK);
    const val = parseFloat(amount);
    
    const newTx: Transaction = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      amount: showWithdraw ? -val : val,
      type: showWithdraw ? 'WITHDRAWAL' : 'DEPOSIT',
      status: 'PENDING',
      timestamp: new Date().toISOString(),
      paymentMethod: method
    };

    addTransaction(newTx);
    setAmount('');
    setStep('AMOUNT');
    audioService.play(SOUNDS.SUCCESS);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    audioService.play(SOUNDS.CLICK);
    alert(`${label} copied!`);
  };

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [transactions]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-24 font-rajdhani px-2 md:px-0">
      {/* Confirmation Modal */}
      {isConfirming && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className={`cyber-card w-full max-w-lg p-1 rounded-[2.5rem] border-2 ${showWithdraw ? 'border-rose-500/60 shadow-[0_0_80px_rgba(239,68,68,0.4)]' : 'border-emerald-500/60 shadow-[0_0_80px_rgba(34,197,94,0.4)]'}`}>
            <div className="bg-[#0f0f14] p-6 md:p-8 rounded-[2.3rem] text-center space-y-6">
               <ReceiptText className={showWithdraw ? 'text-rose-500 mx-auto' : 'text-emerald-500 mx-auto'} size={40} />
               <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-black font-cyber uppercase italic">{showWithdraw ? 'Payout Auth' : 'Credit Sync'}</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">Magnitude: ₹{amount}</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setIsConfirming(false)} className="flex-1 py-3 md:py-4 bg-white/5 rounded-xl font-black uppercase text-[10px] tracking-widest border border-white/10">Abort</button>
                  <button onClick={executeTransaction} className={`flex-1 py-3 md:py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-white ${showWithdraw ? 'bg-rose-600' : 'bg-emerald-600'}`}>Authorize</button>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-4xl font-black font-cyber text-[#a855f7] italic uppercase tracking-tighter">Nexoria Vault</h2>
        <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <Shield size={14} className="text-[#22c55e]" />
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sentinels Active</span>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8 items-start">
        <div className="lg:col-span-4 space-y-4 md:space-y-6 w-full">
          {/* Balance Card - Dynamic Scaling */}
          <div className="cyber-card p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-[#121218] to-[#0a0a0f] border-2 border-white/5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#a855f7] opacity-10 blur-[100px] rounded-full"></div>
            <div className="flex justify-between items-start mb-6 md:mb-8">
               <span className="text-2xl md:text-4xl font-black font-cyber skew-x-[-12deg] text-[#a855f7]/60">X</span>
               <span className="text-[8px] md:text-[10px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[#a855f7] font-black tracking-widest uppercase">VAULT_NODE</span>
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.4em]">Credits Available</p>
            <h4 className="text-3xl md:text-5xl font-black font-cyber text-white italic tracking-tighter mt-1 truncate">₹{user.balance.toLocaleString()}</h4>
            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                <p className="font-bold text-[10px] md:text-sm tracking-widest uppercase text-white/60 truncate max-w-[150px]">{user.username}</p>
                <ShieldCheck size={16} className="text-[#22c55e]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button onClick={() => { setShowWithdraw(false); setStep('AMOUNT'); }} className={`p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 md:gap-3 ${!showWithdraw ? 'bg-[#a855f7]/10 border-[#a855f7]' : 'bg-white/5 border-white/5'}`}>
              <Plus size={24} className="md:w-8 md:h-8" />
              <span className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">Load Credits</span>
            </button>
            <button onClick={() => { setShowWithdraw(true); setStep('AMOUNT'); }} className={`p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 md:gap-3 ${showWithdraw ? 'bg-rose-500/10 border-rose-500' : 'bg-white/5 border-white/5'}`}>
              <ArrowDownLeft size={24} className="md:w-8 md:h-8" />
              <span className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">Withdraw</span>
            </button>
          </div>

          {/* Mini History - Collapsible or simpler for mobile */}
          <div className="cyber-card p-6 rounded-2xl md:rounded-[2rem] border-white/5 space-y-4">
             <h3 className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <ReceiptText size={14} /> Protocol Ledger
             </h3>
             <div className="space-y-2 max-h-48 md:max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {sortedTransactions.slice(0, 5).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                     <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`p-1.5 rounded-lg shrink-0 ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                           {tx.amount > 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                        </div>
                        <div className="overflow-hidden">
                           <p className="text-[10px] md:text-xs font-black text-white italic truncate">₹{Math.abs(tx.amount)}</p>
                           <p className="text-[7px] md:text-[8px] text-gray-600 font-bold uppercase truncate">{tx.type}</p>
                        </div>
                     </div>
                     <span className={`text-[7px] font-black px-1.5 py-0.5 rounded border shrink-0 ${tx.status === 'COMPLETED' ? 'border-emerald-500/20 text-emerald-500' : 'border-amber-500/20 text-amber-500'}`}>{tx.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Wizard Panel - Full width on mobile */}
        <div className="lg:col-span-8 cyber-card p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-white/5 min-h-[500px] md:min-h-[600px] flex flex-col shadow-2xl bg-black/40 backdrop-blur-md w-full">
           {step === 'AMOUNT' ? (
              <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full space-y-8 md:space-y-12">
                <div className="text-center space-y-2">
                   <h3 className="text-xl md:text-3xl font-black font-cyber uppercase italic">{showWithdraw ? 'Payout Magnitude' : 'Credit Sync'}</h3>
                   <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">Establish Transfer Value</p>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-2xl md:text-4xl font-black text-[#a855f7]">₹</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-8 md:py-10 pl-12 md:pl-16 pr-6 md:pr-8 text-3xl md:text-6xl font-black outline-none focus:border-[#a855f7]/50 focus:bg-[#a855f7]/5 transition-all font-cyber italic placeholder:opacity-5"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                   {[100, 500, 1000].map(v => (
                     <button key={v} onClick={() => { audioService.play(SOUNDS.CLICK); setAmount(v.toString()); }} className="py-2.5 md:py-4 bg-white/5 border border-white/10 rounded-xl font-black text-[#a855f7] hover:bg-[#a855f7]/10 transition-all text-xs md:text-base">+₹{v}</button>
                   ))}
                </div>
                <button onClick={handleProceedToPayment} className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-[#a855f7] text-white font-black text-sm md:text-xl tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 md:gap-4 group">
                  PROCEED <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
           ) : (
              <div className="flex-1 flex flex-col h-full">
                <button onClick={() => setStep('AMOUNT')} className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 md:mb-10 hover:text-white transition-colors">
                   <ChevronLeft size={14} /> Back to Magnitude
                </button>

                <div className="flex gap-2 md:gap-4 mb-6 md:mb-10 bg-white/5 p-1 rounded-xl md:rounded-2xl border border-white/10">
                   {(['UPI', 'CARD', 'BANK'] as const).map(m => (
                     <button key={m} onClick={() => { audioService.play(SOUNDS.CLICK); setMethod(m); }} className={`flex-1 py-2 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${method === m ? 'bg-[#a855f7] text-white' : 'text-gray-500 hover:text-white'}`}>{m}</button>
                   ))}
                </div>

                <div className="flex-1 bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 p-4 md:p-8">
                   {method === 'UPI' && (
                     <div className="flex flex-col items-center gap-6 md:gap-8 py-4 md:py-10">
                        <div className="p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                           <QrCode size={140} className="text-black md:hidden" />
                           <QrCode size={200} className="text-black hidden md:block" />
                        </div>
                        <div className="text-center space-y-2">
                           <p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase">Transfer ID</p>
                           <p className="text-sm md:text-lg font-black font-mono text-white break-all">nexoria.ops@upi</p>
                           <button onClick={() => copyToClipboard('nexoria.ops@upi', 'ID')} className="flex items-center gap-2 mx-auto px-4 md:px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[8px] font-black text-[#a855f7] uppercase tracking-widest transition-all mt-3 border border-white/5">
                              <Copy size={12} /> Copy Protocol
                           </button>
                        </div>
                     </div>
                   )}

                   {method === 'CARD' && (
                     <div className="max-w-md mx-auto space-y-6 md:space-y-10">
                        <div className="hidden md:block relative aspect-[1.586/1] rounded-[1.5rem] bg-gradient-to-br from-[#121218] via-[#0a0a0f] to-[#121218] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                           <div className="relative z-10 h-full flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                 <span className="text-xl font-black font-cyber text-[#a855f7] italic tracking-tight">NEXORIA</span>
                              </div>
                              <p className="text-2xl font-black font-mono text-white tracking-[0.2em]">{cardNumber || '•••• •••• •••• ••••'}</p>
                              <div className="flex justify-between items-end">
                                 <div>
                                    <p className="text-[8px] text-gray-600 font-black uppercase">Identity</p>
                                    <p className="text-xs font-black text-white/80 uppercase tracking-widest">{cardName || 'OP-NAME'}</p>
                                 </div>
                                 <p className="text-xs font-black text-white/80 tracking-widest">{cardExpiry || 'MM/YY'}</p>
                              </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:gap-4">
                           <input type="text" placeholder="CARDHOLDER NAME" value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} className="bg-black/40 border border-white/10 rounded-xl py-3 md:py-4 px-4 md:px-6 outline-none focus:border-[#a855f7]/50 text-[10px] font-black uppercase tracking-widest"/>
                           <input type="text" placeholder="CARD SEQUENCE" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim())} maxLength={19} className="bg-black/40 border border-white/10 rounded-xl py-3 md:py-4 px-4 md:px-6 outline-none focus:border-[#a855f7]/50 text-[10px] font-black font-mono tracking-widest"/>
                           <div className="grid grid-cols-2 gap-3">
                              <input type="text" placeholder="EXP (MM/YY)" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} maxLength={5} className="bg-black/40 border border-white/10 rounded-xl py-3 md:py-4 px-4 md:px-6 outline-none focus:border-[#a855f7]/50 text-[10px] font-black tracking-widest"/>
                              <input type="password" placeholder="CVV" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))} maxLength={3} className="bg-black/40 border border-white/10 rounded-xl py-3 md:py-4 px-4 md:px-6 outline-none focus:border-[#a855f7]/50 text-[10px] font-black tracking-widest"/>
                           </div>
                        </div>
                     </div>
                   )}

                   {method === 'BANK' && (
                     <div className="space-y-4 md:space-y-6 max-w-md mx-auto">
                        <div className="p-3 md:p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl md:rounded-2xl flex gap-2 md:gap-3">
                           <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                           <p className="text-[8px] md:text-[10px] text-gray-300 font-bold uppercase leading-relaxed">Manual vault audit required. Delay: 2-4 Hours.</p>
                        </div>
                        <div className="space-y-3 md:space-y-4">
                           <input type="text" placeholder="ACCOUNT NAME" value={userAccName} onChange={e => setUserAccName(e.target.value.toUpperCase())} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 md:py-4 px-4 md:px-6 outline-none focus:border-rose-500/50 text-[9px] font-black uppercase tracking-widest" />
                           <input type="text" placeholder="ACCOUNT SEQUENCE" value={userAccNum} onChange={e => setUserAccNum(e.target.value.replace(/\D/g, ''))} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 md:py-4 px-4 md:px-6 outline-none focus:border-rose-500/50 text-[9px] font-black font-mono tracking-widest" />
                           <input type="text" placeholder="BRANCH ID (IFSC)" value={userAccIfsc} onChange={e => setUserAccIfsc(e.target.value.toUpperCase())} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 md:py-4 px-4 md:px-6 outline-none focus:border-rose-500/50 text-[9px] font-black font-mono uppercase tracking-widest" />
                        </div>
                     </div>
                   )}
                </div>

                <div className="pt-6 md:pt-10">
                   <button onClick={handleInitiate} className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-xl tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] ${showWithdraw ? 'bg-rose-600 shadow-rose-500/20' : 'bg-[#a855f7] shadow-[#a855f7]/20'}`}>
                      {showWithdraw ? 'INITIATE PAYOUT' : 'INITIALIZE SYNC'}
                   </button>
                </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default WalletView;
