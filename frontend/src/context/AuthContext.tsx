import { createContext, useContext } from "react";

export interface User {
  name: string;
  email: string;
  role: "user" | "admin";
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (data: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);
