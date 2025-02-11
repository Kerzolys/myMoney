import { create } from "zustand";
import { IUser } from "../types/types";

export interface IUserState {
  user: IUser;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  isRegistration: boolean;
  setAuthenticated: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setRegistration: (isRegistration: boolean) => void;
  setUser: (user: IUser) => void;
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setNewPassword: (newPassword: string) => void;
}

export const useUserState = create((set, get) => ({
  user: {
    id: "",
    name: "Gleb",
    email: "kerzolys@gmail.com",
    createdAt: "",
    avatarUrl: "",
    balance: 0,
  },
  isLoading: false,
  error: null,
  isLoggedIn: false,
  isRegistration: false,
  setAuthenticated: () => set(() => ({ isLoggedIn: true })),
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
  setRegistration: (isRegistration: boolean) => set({ isRegistration }),
  setUser: (user: IUser) => set({ user }),
  setError: (error: string | null) => set({ error }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setNewPassword: (newPassword: string) => set({ newPassword }),
}));
