// context/UserContext.tsx
import React from "react";
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  role: "tutor" | "lecturer";
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
