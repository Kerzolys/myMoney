import { TTransaction } from "../services/types/types";

const API_URL = "./api";

async function request<T>(
  endpoint: string,
  method = "GET",
  body?: object
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  return request<{ user: object; token: string }>("/register", "POST", {
    name,
    email,
    password,
  });
}

export async function loginUser(email: string, password: string) {
  return request<{ user: object; token: string }>("/login", "POST", {
    email,
    password,
  });
}

export async function changePassword(password: string) {
  return request<{ message: string; user: object }>("/user/password", "POST", {
    password,
  });
}

export async function changeName(name: string) {
  return request<{ message: string; user: object }>("/user/name", "POST", {
    name,
  });
}

export async function getUserTransactions() {
  return request<{ transactions: TTransaction[] }>("/transactions");
}

export async function addTransaction(
  categoryId: string,
  amount: number,
  description: string,
  isIncome: boolean
) {
  // console.log({ categoryId, amount, description, isIncome })
  if (!categoryId || !amount || !description || typeof isIncome !== "boolean") {
    throw new Error("All fields are required and must be valid.");
  }
  return request<{ message: string; transactions: TTransaction[] }>(
    "/transaction",
    "POST",
    {
      categoryId,
      amount,
      description,
      isIncome,
    }
  );
}

export async function editTransaction(
  id: string,
  updatedTransaction: Partial<TTransaction>
) {
  if (!id) {
    throw new Error("Transaction is not found");
  }
  return request<{ message: string; transactions: TTransaction[] }>(
    `/transaction/${id}`,
    "PUT",
    updatedTransaction
  );
}

export async function deleteTransaction(id: string) {
  if (!id) {
    throw new Error("Transaction is not found");
  }
  return request<{ message: string; transactions: TTransaction[] }>(
    `/transaction/${id}`,
    "DELETE"
  );
}
