
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "#/utils/auth";

export default function GuestRoute() {
  return isAuthenticated()
    ? <Navigate to="/guide" replace />
    : <Outlet />;
}
