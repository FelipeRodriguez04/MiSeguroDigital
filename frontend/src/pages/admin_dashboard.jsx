import { useState, useMemo, useEffect } from "react";

export default function BrokerVersioning() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("resumen"); 

  const TiposPolizas = {
    seguro_automotriz: "Seguro Automotriz",
    seguro_inmobiliario: "Seguro Inmobiliario",
    seguro_de_vida: "Seguro de Vida",
    seguro_de_salud: "Seguro de Salud",
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:33761/api/polizas/admin/polizas-dashboard"
        );

        const json = await response.json().catch(() => ({}));

        if (!response.ok || !json.success) {
          throw new Error(json.message || "Error al cargar dashboard de pólizas");
        }

        setDashboard(json.data);
      } catch (err) {
        console.error("Error obteniendo polizas-dashboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const resumen = dashboard?.resumen_general;
  const polizasDetalladas = dashboard?.polizas_detalladas || [];
  const metricasPorAseguradora = dashboard?.metricas_por_aseguradora || [];


  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">
        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl">MiSeguroDigital</div>
        </header>

        <div>
          <h1 className="text-3xl font-extrabold text-green-700 text-center">
            Dashboard de Pólizas
          </h1>
          <p className="text-center text-slate-600 mt-1">
            Información detallada de pólizas y su comportamiento.
          </p>
        </div>

        <div className="mt-6 px-8">
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <button
              onClick={() => setActiveTab("resumen")}
              className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                activeTab === "resumen"
                  ? "border-green-600 text-green-700 bg-white"
                  : "border-transparent text-slate-600 hover:text-green-700"
              }`}
            >
              Resumen general
            </button>

            <button
              onClick={() => setActiveTab("detalladas")}
              className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                activeTab === "detalladas"
                  ? "border-green-600 text-green-700 bg-white"
                  : "border-transparent text-slate-600 hover:text-green-700"
              }`}
            >
              Pólizas detalladas
            </button>

            <button
              onClick={() => setActiveTab("metricas")}
              className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                activeTab === "metricas"
                  ? "border-green-600 text-green-700 bg-white"
                  : "border-transparent text-slate-600 hover:text-green-700"
              }`}
            >
              Métricas por aseguradora
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-center mt-8 text-slate-600">Cargando datos...</p>
        )}
        {error && (
          <p className="text-center mt-8 text-red-600">Error: {error}</p>
        )}

        {!loading && !error && (
          <>
            {activeTab === "resumen" && resumen && (
              <section className="px-8 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl shadow p-4 border border-green-100">
                    <p className="text-sm text-slate-500">Total de pólizas</p>
                    <p className="text-2xl font-bold text-green-700">
                      {resumen.total_polizas}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Activas: {resumen.polizas_activas} · Pausadas:{" "}
                      {resumen.polizas_pausadas} · Despublicadas:{" "}
                      {resumen.polizas_despublicadas}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl shadow p-4 border border-green-100">
                    <p className="text-sm text-slate-500">Aplicaciones</p>
                    <p className="text-2xl font-bold text-green-700">
                      {resumen.total_aplicaciones_pendientes +
                        resumen.total_aplicaciones_aprobadas}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Pendientes: {resumen.total_aplicaciones_pendientes} ·
                      Aprobadas: {resumen.total_aplicaciones_aprobadas}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl shadow p-4 border border-green-100">
                    <p className="text-sm text-slate-500">Estado de pólizas</p>
                    <p className="text-sm text-slate-700 mt-1">
                      Despublicadas:{" "}
                      <span className="font-semibold">
                        {resumen.polizas_despublicadas}
                      </span>
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "detalladas" && (
              <>

                <section className="px-8 mt-6">
                  <div className="overflow-x-auto bg-white rounded-2xl shadow border">
                    <table className="min-w-full text-sm">
                      <thead className="bg-green-50 text-green-700">
                        <tr>
                          <th className="text-left px-4 py-3">ID Póliza</th>
                          <th className="text-left px-4 py-3">Nombre</th>
                          <th className="text-left px-4 py-3">Aseguradora</th>
                          <th className="text-left px-4 py-3">Tipo</th>
                          <th className="text-left px-4 py-3">
                            Pago Mensual
                          </th>
                          <th className="text-left px-4 py-3">
                            Cobertura Total
                          </th>
                          <th className="text-left px-4 py-3">
                            Duración (meses)
                          </th>
                          <th className="text-left px-4 py-3">% Aprobación</th>
                          <th className="text-left px-4 py-3">Estado</th>
                          <th className="text-left px-4 py-3">
                            Aplicaciones (Pend / Aprob)
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {polizasDetalladas.map((p) => (
                          <tr
                            key={p.id_poliza}
                            className="border-t hover:bg-slate-50/50"
                          >
                            <td className="px-4 py-3 font-mono">
                              {p.id_poliza}
                            </td>
                            <td className="px-4 py-3">{p.nombre_poliza}</td>
                            <td className="px-4 py-3">
                              {p.aseguradora?.nombre_aseguradora || "-"}
                            </td>
                            <td className="px-4 py-3">{TiposPolizas[p.tipo_poliza]}</td>
                            <td className="px-4 py-3">
                              ${Number(p.pago_mensual || 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              $
                              {Number(p.monto_cobertura_total || 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              {p.duracion_contrato ?? "-"}
                            </td>
                            <td className="px-4 py-3">
                              {p.porcentaje_aprobacion != null
                                ? `${p.porcentaje_aprobacion}%`
                                : "-"}
                            </td>
                            <td className="px-4 py-3 capitalize">
                              {p.estado_poliza}
                            </td>
                            <td className="px-4 py-3">
                              {p.estadisticas_aplicaciones
                                ?.aplicaciones_pendientes ?? 0}{" "}
                              /{" "}
                              {p.estadisticas_aplicaciones
                                ?.aplicaciones_aprobadas ?? 0}
                            </td>
                          </tr>
                        ))}

                        {polizasDetalladas.length === 0 && (
                          <tr>
                            <td
                              colSpan={10}
                              className="px-4 py-10 text-center text-slate-500"
                            >
                              No se encontraron pólizas que coincidan con la
                              búsqueda.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {activeTab === "metricas" && (
              <section className="px-8 mt-6">
                <div className="overflow-x-auto bg-white rounded-2xl shadow border">
                  <table className="min-w-full text-sm">
                    <thead className="bg-green-50 text-green-700">
                      <tr>
                        <th className="text-left px-4 py-3">Aseguradora</th>
                        <th className="text-left px-4 py-3">
                          Total de pólizas
                        </th>
                        <th className="text-left px-4 py-3">
                          Total aplicaciones
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {metricasPorAseguradora.map((m, idx) => (
                        <tr
                          key={`${m.id_aseguradora}-${idx}`}
                          className="border-t hover:bg-slate-50/50"
                        >
                          <td className="px-4 py-3">
                            {m.nombre_aseguradora}
                          </td>
                          <td className="px-4 py-3">
                            {m.total_polizas ?? 0}
                          </td>
                          <td className="px-4 py-3">
                            {m.total_aplicaciones ?? 0}
                          </td>
                    
                        </tr>
                      ))}

                      {metricasPorAseguradora.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-10 text-center text-slate-500"
                          >
                            No hay métricas consolidadas por aseguradora.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}

        <footer className="py-6 text-center text-slate-500 text-sm">
          © 2025 MiSeguroDigital — Dashboard de Pólizas.
        </footer>
      </div>
    </div>
  );
}
