import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PendientesAnalyst() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost:33761/api/aplicaciones/brokers/aplicaciones-pendientes"
        );

        if (!response.ok) {
          const errText = await response.text();
          let errData = {};
          if (errText) {
            try {
              errData = JSON.parse(errText);
            } catch (e) {}
          }
          throw new Error(errData.message || "Error desconocido");
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApplications();
  }, []);

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-white/25 backdrop-blur-[12px]"></div>

      <header className="relative flex justify-between items-center px-8 py-4 text-green-700 font-semibold z-10">
        <div className="text-xl">MiSeguroDigital</div>
        <button
          className="text-red-600 hover:text-red-700 transition flex items-center gap-2"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Cerrar sesión
        </button>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
        <div className="max-w-5xl w-full bg-white/85 rounded-2xl shadow-xl p-10 backdrop-blur-md mx-4 border border-green-100">

          <h1 className="text-4xl font-extrabold text-green-700 mb-4">
            Solicitudes Pendientes
          </h1>

          {loading && <p>Cargando solicitudes...</p>}

          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && applications.length === 0 && (
            <p>No existen solicitudes pendientes</p>
          )}

          {!loading && applications.length > 0 && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse border border-gray-200 text-left text-sm">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="border border-gray-200 px-3 py-2 text-center">ID</th>
                    <th className="border border-gray-200 px-3 py-2">Usuario</th>
                    <th className="border border-gray-200 px-3 py-2">Póliza</th>
                    <th className="border border-gray-200 px-3 py-2">Aseguradora</th>
                    <th className="border border-gray-200 px-3 py-2 text-center">Fecha</th>
                    <th className="border border-gray-200 px-3 py-2 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id_aplicacion_poliza} className="hover:bg-gray-100 transition">
                      <td className="border px-3 py-2 text-center">{app.id_aplicacion_poliza}</td>
                      <td className="border px-3 py-2">
                        <div className="font-semibold">{app.full_nombre_usuario_aplicacion}</div>
                        <div className="text-xs text-gray-600">{app.correo_registro_usuario_aplicaicon}</div>
                      </td>

                      <td className="border px-3 py-2">{app.nombre_poliza_aplicacion}</td>
                      <td className="border px-3 py-2">{app.nombre_aseguradora_poliza_aplicacion}</td>

                      <td className="border px-3 py-2 text-center">
                        {new Date(app.fecha_aplicacion_poliza).toLocaleDateString()}
                      </td>

                      <td className="border px-3 py-2 text-center">
                        <button
                          onClick={() => navigate(`/analista/solicitud/${app.id_aplicacion_poliza}/${app.id_usuario_aplicacion}`)}
                          className="px-4 py-1 !bg-blue-600 !text-white rounded hover:bg-blue-700 transition"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Link
              to="/analista"
              className="border-2 !border-green-600 !text-green-700 px-6 py-2 rounded-lg hover:bg-green-600 hover:text-white transition"
            >
              Volver al Panel
            </Link>
          </div>

        </div>

        <footer className="mt-10 text-gray-600 text-sm">
          © 2025 MiSeguroDigital — Panel del Analista.
        </footer>
      </main>
    </div>
  );
}
