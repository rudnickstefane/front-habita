import { storage } from "@sr/common/storage";
import { create } from "zustand";

export type PerfilCorretor = "ADMIN" | "CORRETOR";

export type CorretorSession = {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilCorretor;
};

type AuthState = {
  token: string | null;
  corretor: CorretorSession | null;
  setSession: (token: string, corretor: CorretorSession) => void;
  logout: () => void;
};

const storedToken = storage.get<string>("token");
const storedCorretor = storage.get<CorretorSession>("corretor");

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  corretor: storedCorretor,
  setSession: (token, corretor) => {
    storage.set("token", token);
    storage.set("corretor", corretor);
    set({ token, corretor });
  },
  logout: () => {
    storage.remove("token");
    storage.remove("corretor");
    set({ token: null, corretor: null });
  },
}));
