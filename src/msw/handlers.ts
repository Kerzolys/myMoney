import { HttpResponse, http } from "msw";
import { IUserState, useUserState } from "../services/zustand/store";

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
    const state = useUserState.getState()
    console.log(state);
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
];
