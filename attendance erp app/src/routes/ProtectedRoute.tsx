import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks";
import type { Role } from "../types";
import { defaultRouteByRole } from "./navConfig";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  redirectTo?: string;
  children?: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, redirectTo, children }: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo ?? defaultRouteByRole[user.role]} replace />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
