import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const userId = localStorage.getItem("userId") || "";
  const userName = localStorage.getItem("userName") || "Usuario";

  const statusColors = {
    Aprobada: "text-green-700 font-semibold",
    Pendiente: "text-yellow-600 font-semibold",
    Rechazada: "text-red-600 font-semibold",
  };

  const TiposPolizas={
  seguro_automotriz: "Seguro Automotriz",
  seguro_inmobiliario: "Seguro Inmobiliario",
  seguro_de_vida: "Seguro de Vida",
  seguro_de_salud: "Seguro de Salud",
};

const TipoEstado={
  pendiente_procesar: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
}

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchApps = async () => {
      try {
        const res = await fetch(
          `http://localhost:33761/api/aplicaciones/usuarios/aplicaciones-de-usuario/${userId}`,
          {
            method: "GET",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setApiError(data.message || "Error al obtener solicitudes");
          console.error("Error al obtener solicitudes:", data);
          return;
        }

        setApps(data);
      } catch (err) {
        console.error("Error de red:", err);
        setApiError("No se pudo conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [userId]);

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[12px]"></div>

      <header className="relative flex justify-between items-center px-8 py-4 text-green-700 font-semibold z-10">
        <div className="text-xl">MiSeguroDigital</div>
          <Link
            to="/usuario"
            className="flex items-center gap-2 no-underline !text-green-700 hover:text-green-900 !transition font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Home
          </Link>
      </header>

      <div className="container mx-auto px-4 z-10 py-10">
        <h1 className="text-4xl font-extrabold text-green-700 mb-2 text-center z-10 mt-8">
          Mis Solicitudes
        </h1>
        <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto text-center">
          Hola{" "}
          <span className="font-semibold text-green-700">{userName}</span>, estas
          son tus solicitudes.
        </p>

        <div className="w-full bg-white/80 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
          {loading ? (
            <div className="text-center text-gray-600 py-10">
              Cargando solicitudes...
            </div>
          ) : apiError ? (
            <div className="text-center text-red-600 py-10">
              {apiError}
            </div>
          ) : apps.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              <p>No tienes solicitudes registradas.</p>
              <a
                href="/catalog"
                className="inline-block mt-4 text-green-700 hover:text-green-800 underline font-semibold"
              >
                Ir al catálogo de pólizas →
              </a>
            </div>
          ) : (
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b-2 border-green-200">
                    <th className="py-3 px-4 text-green-800 text-lg">Póliza</th>
                    <th className="py-3 px-4 text-green-800 text-lg">Tipo</th>
                    <th className="py-3 px-4 text-green-800 text-lg">Aseguradora</th>
                    <th className="py-3 px-4 text-green-800 text-lg">
                      Fecha solicitud
                    </th>
                    <th className="py-3 px-4 text-green-800 text-lg">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr
                      key={app.id_aplicacion_poliza}
                      className="border-b border-gray-200 hover:bg-green-50 transition"
                    >
                      <td className="py-3 px-4">{app.nombre_poliza}</td>
                      <td className="py-3 px-4">{TiposPolizas[app.tipo_poliza]}</td>
                      <td className="py-3 px-4">{app.nombre_aseguradora}</td>
                      <td className="py-3 px-4">{app.fecha_aplicacion_poliza}</td>
                      <td
                        className={`py-3 px-4 ${
                          statusColors[TipoEstado[app.estado_actual_aplicacion]] || ""
                        }`}
                      >
                        {TipoEstado[app.estado_actual_aplicacion]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="mt-12 text-gray-500 text-sm text-center">
          © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
        </footer>
      </div>
    </div>
  );
}
