import { useState, useEffect } from "react";

export default function ReporteAseguradora() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recuperar el ID guardado
  const id_aseguradora = localStorage.getItem("id_aseguradora");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:33761/api/brokers/admin/reporte-performance-total-aseguradora/${id_aseguradora}`
        );

        if (!res.ok) {
          throw new Error("Error al obtener el reporte");
        }

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Error cargando el reporte");
        }

        setData(json.data || []);
      } catch (err) {
        console.error("Error obteniendo reporte:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_aseguradora]);

  const aseguradora = data[0]; // siempre 1 registro

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">

        {/* Header */}
        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl">MiSeguroDigital</div>
        </header>

        {/* Titulo */}
        <div>
          <h1 className="text-3xl font-extrabold text-green-700 text-center">
            Reporte de Performance - Aseguradora
          </h1>
          <p className="text-center text-slate-600 mt-1">
            Detalle consolidado de la actividad de la aseguradora.
          </p>
        </div>

        {/* Loading / Error */}
        {loading && (
          <p className="text-center mt-8 text-slate-600">Cargando datos...</p>
        )}

        {error && (
          <p className="text-center mt-8 text-red-600">Error: {error}</p>
        )}

        {/* CONTENIDO */}
        {!loading && !error && aseguradora && (
          <section className="px-8 mt-6">

            {/* TARJETAS RESUMEN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Total aplicaciones */}
              <div className="bg-white rounded-2xl shadow p-4 border border-green-100">
                <p className="text-sm text-slate-500">Total de solicitudes</p>
                <p className="text-2xl font-bold text-green-700">
                  {aseguradora.total_aplicaciones}
                </p>
              </div>

              {/* Pendientes */}
              <div className="bg-white rounded-2xl shadow p-4 border border-green-100">
                <p className="text-sm text-slate-500">Aplicaciones pendientes</p>
                <p className="text-2xl font-bold text-green-700">
                  {aseguradora.aplicaciones_pendientes}
                </p>
              </div>

              {/* Aprobadas */}
              <div className="bg-white rounded-2xl shadow p-4 border border-green-100">
                <p className="text-sm text-slate-500">Aplicaciones aprobadas</p>
                <p className="text-2xl font-bold text-green-700">
                  {aseguradora.aplicaciones_aprobadas}
                </p>
              </div>

              {/* Rechazadas */}
              <div className="bg-white rounded-2xl shadow p-4 border border-green-100">
                <p className="text-sm text-slate-500">Aplicaciones rechazadas</p>
                <p className="text-2xl font-bold text-green-700">
                  {aseguradora.aplicaciones_rechazadas}
                </p>
              </div>

              {/* Nombre de aseguradora */}
              <div className="bg-white rounded-2xl shadow p-4 border border-green-100 col-span-1 md:col-span-2">
                <p className="text-sm text-slate-500">Aseguradora</p>
                <p className="text-xl font-bold text-green-700">
                  {aseguradora.nombre_aseguradora}
                </p>
              </div>
            </div>

            {/* TABLA */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow border mt-8">
              <table className="min-w-full text-sm">
                <thead className="bg-green-50 text-green-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Métrica</th>
                    <th className="px-4 py-3 text-left">Valor</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3">Total aplicaciones</td>
                    <td className="px-4 py-3">{aseguradora.total_aplicaciones}</td>
                  </tr>

                  <tr className="border-t">
                    <td className="px-4 py-3">Pendientes</td>
                    <td className="px-4 py-3">{aseguradora.aplicaciones_pendientes}</td>
                  </tr>

                  <tr className="border-t">
                    <td className="px-4 py-3">Aprobadas</td>
                    <td className="px-4 py-3">{aseguradora.aplicaciones_aprobadas}</td>
                  </tr>

                  <tr className="border-t">
                    <td className="px-4 py-3">Rechazadas</td>
                    <td className="px-4 py-3">{aseguradora.aplicaciones_rechazadas}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        <footer className="py-6 text-center text-slate-500 text-sm">
          © 2025 MiSeguroDigital — Reporte de Aseguradora.
        </footer>
      </div>
    </div>
  );
}
