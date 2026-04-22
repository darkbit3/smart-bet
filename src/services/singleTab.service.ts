const TAB_EVENT_KEY = 'smartbet_single_tab_event';

interface TabEvent {
  type: 'login' | 'logout';
  userId?: number;
  username?: string;
  timestamp: number;
  senderTabId?: string;
}

export class SingleTabService {
  private static instance: SingleTabService | null = null;
  private channel: BroadcastChannel | null = null;
  private tabId: string;

  private constructor() {
    this.tabId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('smartbet_single_tab');
      this.channel.onmessage = (event) => this.handleMessage(event.data);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageEvent.bind(this));
    }
  }

  static getInstance(): SingleTabService {
    if (!SingleTabService.instance) {
      SingleTabService.instance = new SingleTabService();
    }
    return SingleTabService.instance;
  }

  private handleMessage(event: TabEvent) {
    if (event?.senderTabId === this.tabId) {
      return;
    }

    if (event?.type === 'login' || event?.type === 'logout') {
      const reason = event.type === 'logout' ? 'another_tab_logout' : 'another_tab_login';
      window.dispatchEvent(new CustomEvent('smartbet_tab_logout', { detail: { reason, userId: event.userId } }));
    }
  }

  private handleStorageEvent(event: StorageEvent) {
    if (event.key !== TAB_EVENT_KEY || !event.newValue) {
      return;
    }

    try {
      const payload = JSON.parse(event.newValue) as TabEvent;
      if (payload?.senderTabId === this.tabId) {
        return;
      }

      if (payload?.type === 'login' || payload?.type === 'logout') {
        const reason = payload.type === 'logout' ? 'another_tab_logout' : 'another_tab_login';
        window.dispatchEvent(new CustomEvent('smartbet_tab_logout', { detail: { reason, userId: payload.userId } }));
      }
    } catch {
      // ignore invalid messages
    }
  }

  private broadcast(event: TabEvent) {
    const payload = { ...event, senderTabId: this.tabId };

    if (this.channel) {
      this.channel.postMessage(payload);
    }

    try {
      localStorage.setItem(TAB_EVENT_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage write failures
    }
  }

  onLogin(userId: number, username: string) {
    this.broadcast({ type: 'login', userId, username, timestamp: Date.now() });
  }

  onLogout(userId?: number) {
    this.broadcast({ type: 'logout', userId, timestamp: Date.now() });
  }
}
