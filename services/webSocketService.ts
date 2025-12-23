
import { audioService, SOUNDS } from './audioService';

/**
 * NEXORIA WEBSOCKET EMULATOR
 * Simulates a real-time socket.io connection for "Online" feel.
 */

const nexus = new BroadcastChannel('nexoria_nexus');

export type GlobalEvent = {
  id: string;
  type: 'WIN' | 'JOIN' | 'BAN' | 'SYSTEM';
  message: string;
  timestamp: string;
  payload?: any;
};

class WebSocketService {
  private static instance: WebSocketService;
  private listeners: ((event: GlobalEvent) => void)[] = [];

  private constructor() {
    nexus.onmessage = (event) => {
      if (event.data.type === 'GLOBAL_BROADCAST') {
        this.notify(event.data.payload);
      }
    };

    // Periodically generate fake "Online" events to make the world feel alive
    setInterval(() => {
      if (Math.random() > 0.7) {
        this.generateRandomEvent();
      }
    }, 15000);
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public subscribe(callback: (event: GlobalEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify(event: GlobalEvent) {
    this.listeners.forEach(l => l(event));
  }

  public broadcast(event: Omit<GlobalEvent, 'id' | 'timestamp'>) {
    const fullEvent: GlobalEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    nexus.postMessage({ type: 'GLOBAL_BROADCAST', payload: fullEvent });
    this.notify(fullEvent);
  }

  private generateRandomEvent() {
    const messages = [
      { type: 'WIN', msg: "Operator 'Ghost_Ops' secured ₹2,500 in Pochinki Scrims!" },
      { type: 'JOIN', msg: "New Squad 'Hyper_recoil' just registered for Pro Invitational." },
      { type: 'BAN', msg: "Sentinel detected and terminated 4 suspicious nodes in ASIA-1." },
      { type: 'SYSTEM', msg: "Prize Pool for Cyber Duo escalated by 15%." }
    ];
    const rand = messages[Math.floor(Math.random() * messages.length)];
    this.broadcast({ type: rand.type as any, message: rand.msg });
  }
}

export const ws = WebSocketService.getInstance();
