// context/UserContext.tsx
import React from "react";
import { createContext, useContext, useState, ReactNode } from "react";

// Defines the shape of user data used across the app
interface User {
  id: number;
  email: string;
  name: string;
  role: "tutor" | "lecturer";
  avatar?: string; // optional avatar image path
  createdAt?: string; // used for formatting join date
}

// Defines the structure of the context state
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create a context with default empty values
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

// Custom hook to access the user context
export const useUser = () => useContext(UserContext);

// Context provider component to wrap around the app
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
