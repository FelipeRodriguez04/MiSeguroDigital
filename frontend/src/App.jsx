import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import HomeAdmin from "./pages/home_admin";
import HomeAnalista from "./pages/home_analista";
import HomeUser from "./pages/home_user";
import RequireRole from "./components/RequireRole";
import Catalog from "./pages/catalog";
import MyApplications from "./pages/user_applications"; 
import BrokerApplications from "./pages/analista_applications";
import BrokerReports from "./pages/broker_reports";
import BrokerPolicies from "./pages/broker_policies";
import BrokerNewPolicy from "./pages/new_policy";
import BrokerVersioning from "./pages/versionamiento";
import AdminApplications from "./pages/admin_applications";
import BrokerReviews from "./pages/analista_reviews";

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
          path="/broker/policies"
          element={
            <RequireRole role="admin">
              <BrokerPolicies />
            </RequireRole>
          }
        />

        <Route
          path="/broker/policies/new"
          element={
            <RequireRole role="admin">
              <BrokerNewPolicy />
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
          path="/broker/applications"
          element={
            <BrokerApplications />
          }
        />

        <Route
          path="/broker/reports"
          element={
            <BrokerReports />
          }
        />

        <Route
          path="/broker/versions"
          element={
            <RequireRole role="admin">
              <BrokerVersioning />
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
        <Route path="/catalog" element={<RequireRole role="usuario"><Catalog /></RequireRole>} />
        <Route path="/admin/applications" element={<RequireRole role="admin"><AdminApplications /></RequireRole>} />  

        <Route path="/me/applications" element={<RequireRole role="usuario"><MyApplications /></RequireRole>} />
        <Route path="/broker/reviews" element={<RequireRole role="analista"><BrokerReviews /></RequireRole>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}


