import { storage } from "@sr/common/storage";
import { create } from "zustand";

export type PerfilAcesso = "ADMIN" | "CORRETOR" | "PROPRIETARIO";

export type UsuarioSession = {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilAcesso;
};

type AuthState = {
  token: string | null;
  usuario: UsuarioSession | null;
  setSession: (token: string, usuario: UsuarioSession) => void;
  logout: () => void;
};

const storedToken = storage.get<string>("token");
const storedUsuario = storage.get<UsuarioSession>("usuario");

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  usuario: storedUsuario,
  setSession: (token, usuario) => {
    storage.set("token", token);
    storage.set("usuario", usuario);
    set({ token, usuario });
  },
  logout: () => {
    storage.remove("token");
    storage.remove("usuario");
    set({ token: null, usuario: null });
  },
}));
