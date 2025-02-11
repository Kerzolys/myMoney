import { create } from "zustand";
import { IUser, TCategory, TCategoryType, TTransaction } from "../types/types";

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

export interface ITransactionState {
  transactions: TTransaction[];
  isLoading: boolean;
  error: string | null;
  setTransaction: (transaction: TTransaction) => void;
  editTransaction: (updatedTransaction: TTransaction) => void;
  deleteTransaction: (id: string) => void;
}

export const useTransactionState = create<ITransactionState>((set) => ({
  transactions: [
    {
      id: "1",
      userId: "1",
      categoryId: "1",
      category: { id: "1", name: "Дом", type: TCategoryType.EXPENSE },
      amount: 1000,
      description: "Заправка автомобиля",
      date: "2022-01-01",
      isIncome: false,
      createdAt: "2022-01-01",
      updatedAt: "2022-01-01",
    },
  ],
  isLoading: false,
  error: null,
  setTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
  editTransaction: (updatedTransaction) =>
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        typeof transaction === "object" &&
        transaction.id === updatedTransaction.id
          ? { ...transaction, ...updatedTransaction }
          : transaction
      ),
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: [...state.transactions].filter((t) => t.id !== id),
    })),
}));

export interface ICategoryState {
  categories: TCategory[];
  isLoading: boolean;
  error: string | null;
  addCategory: (category: TCategory) => void;
  editCategory: (updatedCategory: TCategory) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryState = create<ICategoryState>((set) => ({
  categories: [
    { id: "1", name: "Дом", type: TCategoryType.EXPENSE },
    { id: "2", name: "Работа", type: TCategoryType.INCOME },
  ],
  isLoading: false,
  error: null,
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  editCategory: (updatedCategory) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === updatedCategory.id
          ? { ...category, ...updatedCategory }
          : category
      ),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    })),
}));
