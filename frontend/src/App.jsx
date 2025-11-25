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
import AdminDashboard from "./pages/admin_dashboard";
import AdminApplications from "./pages/admin_applications";
import BrokerReviews from "./pages/analista_reviews";
import GlobalUserHome from "./pages/global_user_home";
import GlobalBrokerHome from "./pages/global_broker_home";
import GlobalUserUsuarios from "./pages/global_user_usuarios";
import GlobalUserBrokers from "./pages/global_user_brokers";
import GlobalUserPolizas from "./pages/global_user_polizas";
import GlobalBrokerEquipo from "./pages/global_broker_equipo";
import GlobalBrokerPolizas from "./pages/global_broker_polizas";
import GlobalBrokerSolicitudesEquipo from "./pages/global_broker_solicitudes";
import BrokerEditPolicy from "./pages/broker_edit_policy";  
import AdminApplicationDetails from "./pages/admin_application_details";
import CatalogDetails from "./pages/catalog_details";
import Inicio from "./pages/inicio";
import RegistroUsuarios from "./pages/registroUsuarios";
import RUsuario from "./pages/RUsuario";
import RBroker from "./pages/RBroker";
import PagarPolizas from "./pages/pagar_user";
import PagarPolizaDetalle from "./pages/pagar_poliza_detalle";
import BrokerPayments from "./pages/broker_payments"; 
import SolicitarP from "./pages/SolicitarP";
import EditarGlobalUser from "./EditarGlobalUser";
import EditarGlobalBroker from "./pages/EditarGlobalBroker";
import EditarGlobalPoliza from "./pages/EditarGlobalPoliza";
import HistorialPagos from "./pages/historial_pagos";
import PerfilUsuario from "./pages/perfil_usuario";
import EditarPerfilUsuario from "./pages/editar_perfil";
import CreateReview from "./pages/crear_review";
import EditReview from "./pages/editar_review";
import MisBienes from "./pages/bienes_user";
import RegistrarBien from "./pages/registrar_bien";
import EditarBienUsuario from "./pages/editar_bien";
import AnalystDashboard from "./pages/analista_dashboard";
import BrokerProfile from "./pages/broker_profile";
import PendientesAnalyst from "./pages/solicitudes_pendientes";
import DetalleSolicitud from "./pages/detalle_solicitud";
import GlobalUserCreateUsuarios from "./pages/global_crear_usuario";

export default function App() {
  return (
    <Router>
      <Routes>
      <Route
  path="/"
  element={<Inicio />}

        />
<Route path="/me/apply/:id" element={<SolicitarP />} />
<Route path="/" element={<Inicio />} />
<Route path="/inicio" element={<Inicio />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<RegistroUsuarios />} />
<Route path="/register/user" element={<RUsuario />} />
<Route path="/register/broker" element={<RBroker />} />
<Route path="/global-user/brokers/editar/:id" element={<EditarGlobalBroker />} />
<Route path="/broker_edit_policy/:id" element={<BrokerEditPolicy />} />
<Route path="/editar-poliza/:id" element={<EditarGlobalPoliza />} />



        <Route
          path="/admin"
          element={
            <RequireRole role="broker_admin">
              <HomeAdmin />
            </RequireRole>
          }
        />

<Route path="/catalog/details/:id" element={<CatalogDetails />} />

<Route path="/global/edit-user/:id" element={<EditarGlobalUser />} />

<Route path="/admin/application-details" element={<AdminApplicationDetails />} />


        <Route
          path="/broker/policies"
          element={
            <RequireRole role="broker_admin">
              <BrokerPolicies />
            </RequireRole>
          }
        />

        <Route
          path="/broker/policies/new"
          element={
            <RequireRole role="broker_admin">
              <BrokerNewPolicy />
            </RequireRole>
          }
        />

        <Route
          path="/analista"
          element={
              <HomeAnalista />
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
          path="/broker/dashboard"
          element={
            <RequireRole role="broker_admin">
              <AdminDashboard />
            </RequireRole>
          }
        />

        <Route
          path="/usuario"
          element={
            <RequireRole role="global_user">
              <HomeUser />
            </RequireRole>
          }
        />
        <Route path="/catalog" element={<RequireRole role="global_user"><Catalog /></RequireRole>} />
        <Route path="/broker/applications" element={<RequireRole role="broker_admin"><BrokerApplications /></RequireRole>} />  
          
        <Route path="/me/applications" element={<RequireRole role="global_user"><MyApplications /></RequireRole>} />
        <Route path="/broker/reviews" element={<RequireRole role="analista"><BrokerReviews /></RequireRole>} />

        <Route path="/global_user" element={<GlobalUserHome />} />
        <Route path="/global_broker" element={<RequireRole role="global_broker"><GlobalBrokerHome /></RequireRole>} />

        <Route path="/global_user/usuarios" element={<GlobalUserUsuarios />} />

        <Route path="/global_user/brokers" element={<GlobalUserBrokers />} />
        <Route path="/global_user/polizas" element={<GlobalUserPolizas />} />
        <Route path="/global_broker/equipo" element={<GlobalBrokerEquipo />} />
        <Route path="/global_broker/polizas" element={<GlobalBrokerPolizas />} />
        <Route path="/global_broker/solicitudes" element={<RequireRole role="global_broker"><GlobalBrokerSolicitudesEquipo /></RequireRole>} />
        <Route path="/me/pagar_polizas" element={<PagarPolizas />} />
        <Route path="/me/pagar_polizas/:id_solicitud" element={<RequireRole role="global_user"><PagarPolizaDetalle /></RequireRole>} />
        <Route path="/broker/payments" element={<RequireRole role="analista"><BrokerPayments /></RequireRole>} />
        <Route path="/me/historial_pagos/:registryID" element={<HistorialPagos />} />
        <Route path="/me/perfil" element={<PerfilUsuario />} />
        <Route path="/usuario/editar_perfil" element={<RequireRole role="global_user"><EditarPerfilUsuario /></RequireRole>} />
        <Route path="/crear_review/:id_poliza" element={<RequireRole role="global_user"><CreateReview /></RequireRole>} />
        <Route path="/me/edit_review/:id_review" element={<RequireRole role="global_user"><EditReview /></RequireRole>} />
        <Route path="/me/bienes" element={<MisBienes />} />
        <Route path="/me/bienes/nuevo" element={<RegistrarBien />} />
        <Route path="/me/bienes/editar/:idBien" element={<EditarBienUsuario />} />
        <Route path="/broker/dashboard" element={<AnalystDashboard />} />
        <Route path="/broker/profile" element={<BrokerProfile />} />
        <Route path="/broker/solicitudes-pendientes" element={<PendientesAnalyst />} />
<Route path="/analista/solicitud/:id/:id_user" element={<DetalleSolicitud />} />
<Route path="/global/create-user" element={<GlobalUserCreateUsuarios />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}


