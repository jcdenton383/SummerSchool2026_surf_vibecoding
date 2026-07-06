import { create } from "zustand";
import { api, configureApi } from "@/api/client";
import type { Client } from "@/api/types";
import { tokenStorage } from "./tokenStorage";

type SessionState = {
  accessToken: string | null;
  client: Client | null;
  returnTo: string | null;
  setReturnTo: (value: string | null) => void;
  setSession: (token: string, client: Client) => Promise<void>;
  restore: () => Promise<void>;
  clear: () => Promise<void>;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  accessToken: null,
  client: null,
  returnTo: null,
  setReturnTo: (value) => set({ returnTo: value }),
  setSession: async (token, client) => {
    await tokenStorage.setToken(token);
    set({ accessToken: token, client });
  },
  restore: async () => {
    const token = await tokenStorage.getToken();
    if (!token) {
      set({ accessToken: null, client: null });
      return;
    }
    set({ accessToken: token });
    try {
      const client = await api.getCurrentClient();
      set({ client });
    } catch {
      await get().clear();
    }
  },
  clear: async () => {
    await tokenStorage.deleteToken();
    set({ accessToken: null, client: null });
  }
}));

configureApi({
  getAccessToken: () => useSessionStore.getState().accessToken,
  onUnauthorized: () => {
    void useSessionStore.getState().clear();
  }
});

export function requireAuth(returnTo: string): boolean {
  const hasToken = Boolean(useSessionStore.getState().accessToken);
  if (!hasToken) useSessionStore.getState().setReturnTo(returnTo);
  return hasToken;
}
