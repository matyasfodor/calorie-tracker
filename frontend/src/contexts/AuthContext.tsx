import { createContext, PropsWithChildren, useMemo, useState } from "react";
import jwtDecode from "jwt-decode";

import { LOCAL_STORAGE__AUTH } from "../consts";
import { User } from "../common/types";

export type AuthContextType = { user: User | null; setUser: (user: User | null) => void; };

const getUserFromJwt = (token: string): User | null => {
  const decodedToken: {user?: User} = jwtDecode(token);
  return decodedToken?.user ?? null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {

  const token = localStorage.getItem(LOCAL_STORAGE__AUTH);

  const [user, setUserState] = useState<User | null>(token !== null ? getUserFromJwt(token) : null);
  const setUser = (user: User | null) => {
    if (user !== null) {
      localStorage.setItem(LOCAL_STORAGE__AUTH, user.jwt);
    } else {
      localStorage.removeItem(LOCAL_STORAGE__AUTH);
    }
  
    setUserState(user);
  }
  const providerValue = useMemo(() => ({
    user, setUser
  }), [user]);

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};