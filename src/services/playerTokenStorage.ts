interface TokenData {
  accessToken: string;
  refreshToken?: string;
}

const STORAGE_KEY = 'smartbet_auth_tokens';

export const playerTokenStorage = {
  setTokens: (tokens: TokenData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  },

  getTokens: (): TokenData | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as TokenData;
    } catch (error) {
      console.error('Failed to parse stored tokens:', error);
      return null;
    }
  },

  clearTokens: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },

  getSessionTimeRemaining: (): number => {
    const tokens = playerTokenStorage.getTokens();
    if (!tokens?.accessToken) {
      return 0;
    }

    try {
      const payloadBase64 = tokens.accessToken.split('.')[1];
      if (!payloadBase64) {
        return 0;
      }

      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson) as { exp?: number };
      if (!payload.exp) {
        return 0;
      }

      const expiresAt = payload.exp * 1000;
      const remainingMs = expiresAt - Date.now();
      const remainingMinutes = Math.max(0, Math.floor(remainingMs / 1000 / 60));
      return remainingMinutes;
    } catch (error) {
      console.error('Failed to parse session expiration:', error);
      return 0;
    }
  }
};
