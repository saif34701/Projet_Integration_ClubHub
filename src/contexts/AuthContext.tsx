import { createContext, useContext, useState, ReactNode } from "react";
import { AppUser, UserRole } from "@/types/club";
import { mockCurrentUser } from "@/data/mockData";

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<UserRole>("visitor");

  const login = (selectedRole: UserRole) => {
    setUser({ ...mockCurrentUser, role: selectedRole });
    setRole(selectedRole);
  };

  const logout = () => {
    setUser(null);
    setRole("visitor");
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
      setRole(newRole);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, role, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
