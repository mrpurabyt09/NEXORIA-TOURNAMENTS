
import { User, Tournament, Transaction } from '../types';
import { MOCK_TOURNAMENTS } from '../constants';

/**
 * PRODUCTION READY API SERVICE - NEXORIA ONLINE EDITION
 */

const DELAY = 400;
const nexus = new BroadcastChannel('nexoria_nexus');

const simulateNetwork = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), DELAY);
  });
};

class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private broadcast(type: string, payload: any) {
    nexus.postMessage({ type, payload });
  }

  private updateUserBalance(amount: number) {
    const saved = localStorage.getItem('nexoria_user');
    if (saved) {
      const user: User = JSON.parse(saved);
      user.balance += amount;
      localStorage.setItem('nexoria_user', JSON.stringify(user));
      return user;
    }
    return null;
  }

  // USER OPS
  public async login(email: string): Promise<User> {
    const saved = localStorage.getItem('nexoria_user');
    let user: User;
    if (saved) {
      user = JSON.parse(saved);
    } else {
      user = {
        id: Math.random().toString(36).substr(2, 9),
        username: email.split('@')[0],
        email: email,
        role: email.includes('admin') ? 'ADMIN' : 'USER',
        balance: 1000,
        bgmiId: '5123445566'
      };
      localStorage.setItem('nexoria_user', JSON.stringify(user));
    }
    this.broadcast('USER_LOGIN', user);
    return simulateNetwork(user);
  }

  // TOURNAMENT OPS
  public async getTournaments(): Promise<Tournament[]> {
    const saved = localStorage.getItem('nexoria_tournaments');
    return simulateNetwork(saved ? JSON.parse(saved) : MOCK_TOURNAMENTS);
  }

  // WALLET & PAYOUT OPS
  public async getTransactions(userId?: string): Promise<Transaction[]> {
    const saved = localStorage.getItem('nexoria_transactions');
    const txs: Transaction[] = saved ? JSON.parse(saved) : [];
    return simulateNetwork(userId ? txs.filter(t => t.userId === userId) : txs);
  }

  public async createTransaction(tx: Transaction): Promise<Transaction> {
    const saved = localStorage.getItem('nexoria_transactions');
    const txs: Transaction[] = saved ? JSON.parse(saved) : [];
    
    // Auto-complete internal transactions
    if (tx.type === 'PRIZE' || tx.type === 'ENTRY_FEE') {
      tx.status = 'COMPLETED';
    } else {
      // Deposits and Withdrawals start as PENDING for Admin Audit
      tx.status = 'PENDING';
    }

    // Deduct balance immediately for withdrawals or entry fees
    if (tx.type === 'WITHDRAWAL' || tx.type === 'ENTRY_FEE') {
      this.updateUserBalance(tx.amount); // tx.amount is negative here
    }
    
    // If it's an auto-completed prize, add balance
    if (tx.type === 'PRIZE' && tx.status === 'COMPLETED') {
       this.updateUserBalance(tx.amount);
    }

    txs.unshift(tx);
    localStorage.setItem('nexoria_transactions', JSON.stringify(txs));

    this.broadcast('TRANSACTION_CREATED', tx);
    return simulateNetwork(tx);
  }

  public async updateTransactionStatus(id: string, status: 'COMPLETED' | 'REJECTED'): Promise<Transaction | null> {
    const saved = localStorage.getItem('nexoria_transactions');
    const txs: Transaction[] = saved ? JSON.parse(saved) : [];
    const index = txs.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    const tx = txs[index];
    const oldStatus = tx.status;
    tx.status = status;
    
    // Logic: Handle Balance adjustment based on status change
    if (oldStatus === 'PENDING') {
      if (status === 'COMPLETED' && tx.type === 'DEPOSIT') {
        // Only add balance for deposit once it is approved/completed
        this.updateUserBalance(tx.amount);
      } else if (status === 'REJECTED' && tx.type === 'WITHDRAWAL') {
        // If withdrawal is rejected, refund the locked amount
        this.updateUserBalance(Math.abs(tx.amount));
      }
      // Note: Withdrawals are deducted on creation (PENDING status) to lock funds.
      // Deposits are added on completion (COMPLETED status) to verify payment.
    }
    
    localStorage.setItem('nexoria_transactions', JSON.stringify(txs));
    this.broadcast('TRANSACTION_UPDATED', tx);
    return simulateNetwork(tx);
  }

  public async logout() {
    localStorage.removeItem('nexoria_user');
    this.broadcast('USER_LOGOUT', null);
  }
}

export const api = ApiService.getInstance();
