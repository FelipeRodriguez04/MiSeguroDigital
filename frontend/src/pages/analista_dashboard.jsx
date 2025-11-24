import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AnalystDashboard() {
  const [polizas, setPolizas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const EstadoPoliza={
    activa: 'Activa',
    pausada: 'Pausada',
    despublicada: 'Despublicada',
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:33761/api/polizas/analyst/dashboard", {
            method: "GET",
        });

        if (!res.ok) {
          throw new Error("Error al obtener datos (" + res.status + ")");
        }

        const data = await res.json();
        setPolizas(data);
      } catch (err) {
        setError(err.message || "Error al cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
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
        <div className="flex items-center gap-4">
        <Link
          to="/analista"
          className="!text-green-700 hover:text-green-900 transition flex items-center gap-1 no-underline"
          title="Volver"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Volver
        </Link>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
        <div className="max-w-5xl w-full bg-white/85 rounded-2xl shadow-xl p-10 backdrop-blur-md mx-4 border border-green-100">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-3">
            Dashboard del Analista
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-6">
            Visualiza las pólizas del catálogo y el resumen de sus solicitudes:
            totales, pendientes, aprobadas y rechazadas.
          </p>

          {loading && (
            <div className="text-gray-700 text-base font-medium">
              Cargando información del dashboard...
            </div>
          )}

          {!loading && error && (
            <div className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              Error al cargar datos: {error}
            </div>
          )}

          {!loading && !error && polizas.length === 0 && (
            <div className="text-gray-700 text-base bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
              No se encontraron pólizas para mostrar en el dashboard.
            </div>
          )}

          {!loading && !error && polizas.length > 0 && (
            <>
                <div className="mt-2">
                <div className="overflow-auto max-h-[420px] rounded-xl border border-gray-200">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-green-600 text-white sticky top-0">
                      <tr>
                        <th className="px-3 py-2">Póliza</th>
                        <th className="px-3 py-2">Aseguradora</th>
                        <th className="px-3 py-2">Estado</th>
                        <th className="px-3 py-2 text-center">Totales</th>
                        <th className="px-3 py-2 text-center">Pendientes</th>
                        <th className="px-3 py-2 text-center">Aprobadas</th>
                        <th className="px-3 py-2 text-center">Rechazadas</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/90">
                      {polizas.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-gray-100 hover:bg-green-50/60 transition"
                        >
                          <td className="px-3 py-2 align-top">
                            <div className="font-semibold text-gray-800">
                              {p.nombre}
                            </div>
                          </td>
                          <td className="px-3 py-2 align-top text-gray-700">
                            {p.nombreAseguradora}
                          </td>
                          <td className="px-3 py-2 align-top">
                            <span
                              className={
                                "inline-block px-2 py-1 rounded-full text-xs font-semibold " +
                                (p.estadoPoliza &&
                                p.estadoPoliza.toLowerCase().includes("activa")
                                  ? "!bg-green-100 text-green-800"
                                  : p.estadoPoliza &&
                                    p.estadoPoliza
                                      .toLowerCase()
                                      .includes("pausada")
                                  ? "!bg-yellow-100 text-yellow-800"
                                  : "!bg-gray-100 text-gray-800")
                              }
                            >
                              {EstadoPoliza[p.estadoPoliza]}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center font-semibold !text-gray-800">
                            {p.totalAplicaciones}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold !text-amber-700">
                            {p.totalPendientes}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold !text-green-700">
                            {p.totalAprobadas}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold !text-red-600">
                            {p.totalRechazadas}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        <footer className="mt-10 text-gray-600 text-sm">
          © 2025 MiSeguroDigital — Dashboard del Analista.
        </footer>
      </main>
    </div>
  );
}
