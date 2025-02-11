export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: string; // Дата регистрации
  avatarUrl?: string; // Фото профиля
  balance?: number; // Текущий баланс (если нужно)
}

export interface IAuthResponse {
  userId: string; // id пользователя
  token: string;
  refreshToken: string;
}

export type TTransaction = {
  id: string;
  userId: number;
  categoryId: string;
  category: TCategory;
  amount: number;
  description: string;
  date: string;
  isIncome: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export enum TCategoryType {
  INCOME = "income",
  EXPENSE = "expense",
}

export type TCategory = {
  id: string;
  name: string;
  type: TCategoryType; // Теперь можно различать типы категорий
};
