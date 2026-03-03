import { api } from "./api";
import type { User } from "./types";

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export const authApi = {
  adminLogin: async (data: AdminLoginRequest): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/admin/login", data);
    if (res.token && res.user) {
      localStorage.setItem("auth_token", res.token);
      localStorage.setItem("user_email", res.user.email);
      localStorage.setItem("is_admin", String(res.user.profile?.is_admin ?? true));
    }
    return res;
  },

  adminLogout: async (): Promise<void> => {
    try {
      await api.post("/admin/logout");
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.setItem("is_admin", "false");
    }
  },

  userLogin: async (data: UserLoginRequest): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/user/login", data);
    if (res.token && res.user) {
      localStorage.setItem("auth_token", res.token);
      localStorage.setItem("user_email", res.user.email);
      localStorage.setItem("is_admin", String(res.user.profile?.is_admin ?? false));
    }
    return res;
  },

  userLogout: async (): Promise<void> => {
    try {
      await api.post("/user/logout");
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.setItem("is_admin", "false");
    }
  },

  getProfile: async (): Promise<User> => {
    return api.get<User>("/user/profile");
  },

  isAuthenticated: (): boolean => !!localStorage.getItem("auth_token"),
  isAdmin: (): boolean => localStorage.getItem("is_admin") === "true",
};
