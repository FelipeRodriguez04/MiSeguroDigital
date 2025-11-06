import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import HomeAdmin from "./pages/home_admin";
import HomeAnalista from "./pages/home_analista";
import HomeUser from "./pages/home_user";
import RequireRole from "./components/RequireRole";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            localStorage.getItem("role")
              ? <Navigate to={`/${localStorage.getItem("role")}`} replace />
              : <Login />
          }
        />

        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <HomeAdmin />
            </RequireRole>
          }
        />

        <Route
          path="/analista"
          element={
            <RequireRole role="analista">
              <HomeAnalista />
            </RequireRole>
          }
        />

        <Route
          path="/usuario"
          element={
            <RequireRole role="usuario">
              <HomeUser />
            </RequireRole>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}


