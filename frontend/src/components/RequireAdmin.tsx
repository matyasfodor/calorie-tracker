import { PropsWithChildren, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "../contexts/AuthContext";

export const RequireAdmin: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useContext(AuthContext) as AuthContextType;

  return (<>
    {user?.isAdmin === true ? children : <Navigate to="/" replace />}
  </>);
}