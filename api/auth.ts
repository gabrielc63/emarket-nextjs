import api, { apiWithResponse } from "./index";
import { setAccessToken } from "./authToken";

type User = APISchema.User;

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type RegisterRequest = {
  user: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  };
};

type LoginRequest = {
  user: LoginInput;
};

type UpdateCurrentUserInput = {
  name: string;
  email: string;
};

type Endpoints = {
  register: (input: RegisterInput) => Promise<User>;
  login: (input: LoginInput) => Promise<User>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User>;
  updateCurrentUser: (input: UpdateCurrentUserInput) => Promise<User>;
};

const saveAuthorizationHeader = (authorization?: string) => {
  if (authorization) {
    setAccessToken(authorization);
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await apiWithResponse<User>("refresh", {
      method: "post",
      skipRefresh: true,
    });

    saveAuthorizationHeader(response.headers.authorization);

    return true;
  } catch {
    setAccessToken(null);

    return false;
  }
};

const endpoints: Endpoints = {
  register: async (input) => {
    const response = await apiWithResponse<User>("users", {
      method: "post",
      data: {
        user: {
          name: input.name,
          email: input.email,
          password: input.password,
          password_confirmation: input.passwordConfirmation,
        },
      } satisfies RegisterRequest,
    });

    saveAuthorizationHeader(response.headers.authorization);

    return response.data;
  },

  login: async (input) => {
    const response = await apiWithResponse<User>("users/sign_in", {
      method: "post",
      data: {
        user: input,
      } satisfies LoginRequest,
    });

    saveAuthorizationHeader(response.headers.authorization);

    return response.data;
  },

  logout: async () => {
    await api<void>("users/sign_out", {
      method: "delete",
      skipRefresh: true,
    });

    setAccessToken(null);
  },

  getCurrentUser: async () => {
    return await api<User>("current_user");
  },

  updateCurrentUser: async (input) => {
    return await api<User>("current_user", {
      method: "patch",
      data: {
        user: input,
      },
    });
  },
};

export default endpoints;
