import { HttpResponse, http } from "msw";
import {
  ICategoryState,
  ITransactionState,
  IUserState,
  useCategoryState,
  useTransactionState,
  useUserState,
} from "../services/zustand/store";
import {
  TCategory,
  TCategoryType,
  TTransaction,
} from "../services/types/types";

export const handlers = [
  http.get("/api/user", () => {
    const user = useUserState.getState().user;
    return HttpResponse.json({ user });
  }),
  http.post("/api/register", async ({ request }) => {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return new HttpResponse({
        status: 400,
        body: { error: "All fields are required" },
      });
    }
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
      avatarUrl: "",
      balance: 0,
    };

    useUserState.getState().setUser(newUser);
    useUserState.getState().setIsLoggedIn(true);

    return HttpResponse.json({
      user: newUser,
      token: Math.random().toString(36).substr(2, 9),
      refreshToken: Math.random().toString(36).substr(2, 9),
      message: "User registered successfully",
    });
  }),
  http.post("/api/login", async ({ request }) => {
    const { email, password } = await request.json();

    if (!email || !password) {
      return HttpResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    const state = useUserState.getState();
    const user = state.user;

    if (user.email === email && user.password === password) {
      return HttpResponse.json({
        user,
        token: Math.random().toString(36).substr(2, 9),
        refreshToken: Math.random().toString(36).substr(2, 9),
        message: "User authenticated successfully",
      });
    }

    return HttpResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }),

  http.post("/api/user/password", async ({ request }) => {
    type RequestBody = { password: string };
    const { password } = (await request.json()) as RequestBody;
    const state = useUserState.getState() as IUserState;
    if (!state.isLoggedIn) {
      return HttpResponse.json(
        { error: "You should be logged in" },
        { status: 401 }
      );
    }
    if (!password || password.length < 6) {
      return HttpResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const updatedUser = { ...state.user, password };
    state.setUser(updatedUser);

    return HttpResponse.json({
      message: "Password updated successfully",
    });
  }),
  http.post("/api/user/name", async ({ request }) => {
    type RequestBody = { name: string };

    const { name } = (await request.json()) as RequestBody;
    const state = useUserState.getState() as IUserState;

    // if (!state.isLoggedIn) {
    //     return HttpResponse.json(
    //         { error: "You should be logged in" },
    //         { status: 401 }
    //     );
    // }

    const updatedUser = { ...state.user, name };
    state.setUser(updatedUser);
    const user = useUserState.getState().user;
    return HttpResponse.json({
      user,
      message: "Username updated successfully",
    });
  }),

  http.get("api/user/transactions", async ({ request }) => {
    const userState = useUserState.getState() as IUserState;
    const transactionState = useTransactionState.getState();
    if (!userState.isLoggedIn) {
      return HttpResponse.json(
        { error: "You should be logged in" },
        { status: 401 }
      );
    }

    const transactions: TTransaction[] = transactionState.transactions;

    return HttpResponse.json({
      transactions,
      message: "Transactions fetched successfully",
    });
  }),
  http.post("/api/transaction", async ({ request }) => {
    type RequestBody = {
      categoryId: string;
      amount: number;
      description: string;
      isIncome: boolean;
    };
    const { categoryId, amount, description, isIncome } =
      (await request.json()) as RequestBody;
    const userState = useUserState.getState() as IUserState;
    const transactionState =
      useTransactionState.getState() as ITransactionState;

    if (!userState.isLoggedIn) {
      return HttpResponse.json(
        { error: "You should be logged in" },
        { status: 401 }
      );
    }

    // if (!categoryId || !amount || !description || !isIncome) {
    //   return HttpResponse.json(
    //     { error: "All fields are required" },
    //     { status: 400 }
    //   );
    // }

    const newTransaction: TTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: userState.user.id,
      categoryId,
      category: {
        id: categoryId,
        name: "Uncategorized",
        type: TCategoryType.EXPENSE,
      },
      amount,
      description,
      date: new Date().toISOString(),
      isIncome,
      createdAt: new Date().toISOString(),
    };
    const transactions: TTransaction[] = transactionState.transactions;
    transactionState.setTransaction(newTransaction);

    return HttpResponse.json({
      transactions,
      message: "Transaction added successfully",
    });
  }),
  http.put("/api/transaction/:id", async ({ params, request }) => {
    const { id } = params;
    const updatedTransaction = (await request.json()) as Partial<TTransaction>;

    const userState = useUserState.getState() as IUserState;
    const transactionState =
      useTransactionState.getState() as ITransactionState;

    if (!userState.isLoggedIn) {
      return HttpResponse.json(
        { error: "You should be logged in" },
        { status: 401 }
      );
    }

    const transactions: TTransaction[] = transactionState.transactions;
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) {
      return HttpResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }
    const updatedTransactionData: TTransaction = {
      ...transaction,
      ...updatedTransaction,
    };

    transactionState.editTransaction(updatedTransactionData);

    console.log(updatedTransaction);
    console.log(transactions);

    return HttpResponse.json({
      transactions,
      message: "Transactions updated successfully",
    });
  }),
  http.delete("/api/transaction/:id", async ({ params }) => {
    const id = params.id as string;

    if (!id) {
      return HttpResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    const userState = useUserState.getState() as IUserState;
    const transactionState =
      useTransactionState.getState() as ITransactionState;

    if (!userState.isLoggedIn) {
      return HttpResponse.json(
        { error: "You should be logged in" },
        { status: 401 }
      );
    }

    const transactions = transactionState.transactions;
    const deletedTransaction = transactions.find((t) => t.id === id);

    if (!deletedTransaction) {
      return HttpResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    console.log("Before deletion:", transactions);

    transactionState.deleteTransaction(id); // Удаляем по ID

    const updatedTransactions = transactionState.transactions; // Получаем обновлённый список

    console.log("After deletion:", updatedTransactions);
    return HttpResponse.json({
      transactions: transactions.filter((t) => t.id !== deletedTransaction.id),
      message: "Transaction deleted successfully",
    });
  }),

  http.get("/api/user/categories", async () => {
    const categories = useCategoryState.getState().categories;
    return HttpResponse.json({ categories });
  }),
  http.post("/api/category", async ({ request }) => {
    const { name, type } = await request.json();

    const userState = useUserState.getState() as IUserState;
    const categoryState = useCategoryState.getState();

    if (!userState.isLoggedIn) {
      return HttpResponse.json(
        { error: "You should be logged in" },
        { status: 401 }
      );
    }
    if (!name || !type) {
      return HttpResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const newCategory: TCategory = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
    };

    categoryState.addCategory(newCategory);
    console.log(categoryState);
    return HttpResponse.json({
      categories: categoryState.categories,
      message: "Category added successfully",
    });
  }),
  http.put("/api/category/:id", async ({ params, request }) => {
    const { id } = params;
    const updatedCategory = (await request.json()) as Partial<TCategory>;

    const userState = useUserState.getState() as IUserState;
    const categoryState = useCategoryState.getState();

    if (!userState.isLoggedIn) {
      return HttpResponse.json(
        { error: "You should be logged in" },
        { status: 401 }
      );
    }

    const categories = categoryState.categories;
    const category = categories.find((c) => c.id === id);
    if (!category) {
      return HttpResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const updatedCategoryData: TCategory = {
      ...category,
      ...updatedCategory,
    };

    categoryState.editCategory(updatedCategoryData);
    console.log(updatedCategoryData);
    console.log(categoryState);
    return HttpResponse.json({
      categories: categoryState.categories,
      message: "Category updated successfully",
    });
  }),
  http.delete("/api/category/:id", async ({ params }) => {
    const id = params.id as string;
    if (!id) {
      return HttpResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const userState = useUserState.getState() as IUserState;
    const categoryState = useCategoryState.getState() as ICategoryState;

    if (!userState.isLoggedIn) {
      return HttpResponse.json(
        { error: "You should be logged in" },
        { status: 401 }
      );
    }

    const categories = categoryState.categories;
    const deletedCategory = categories.find((c) => c.id === id);
    if (!deletedCategory) {
      return HttpResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    console.log("Before deletion:", categories);
    categoryState.deleteCategory(id); // Удаляем по ID
    const updatedCategories = categoryState.categories; // Получаем обновлённый список
    console.log("After deletion:", updatedCategories);
    return HttpResponse.json({
      categories: updatedCategories.filter((c) => c.id !== deletedCategory.id),
      message: "Category deleted successfully",
    });
  }),
];
