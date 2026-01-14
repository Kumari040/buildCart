import { useState } from "react";
import { AuthContext} from "./AuthContext";
import type { User } from "./AuthContext";
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stored = localStorage.getItem("user");
    const [user, setUser] = useState<User | null>(
    stored ? JSON.parse(stored) : null
    );

  const login = (data: User) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
