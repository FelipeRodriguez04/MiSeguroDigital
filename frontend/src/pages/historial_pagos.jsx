import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HistorialPagos() {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const resp = await fetch(
          `http://localhost:33761/api/pagos/usuario/historial/${userId}`
        );
        const data = await resp.json();

        if (resp.ok) {
          setPagos(data);
        } else {
          console.error("Error al obtener historial:", data.message);
        }
      } catch (error) {
        console.error("Error al obtener historial:", error);
      }
    };

    fetchPagos();
  }, []);

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
          className="text-green-700 hover:text-green-900 transition flex items-center gap-1 no-underline"
        >
          ← Volver
        </Link>
      </header>

      <main className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
        <div className="max-w-4xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-green-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-4">
            Historial de Pagos
          </h1>

          {pagos.length === 0 ? (
            <div className="text-gray-600 text-center py-10">
              No tienes pagos registrados todavía.
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-green-100 bg-green-50/60">
                  <th className="px-4 py-3 text-left font-semibold text-green-800">N° Póliza</th>
                  <th className="px-4 py-3 text-left font-semibold text-green-800">Monto</th>
                  <th className="px-4 py-3 text-left font-semibold text-green-800">Método</th>
                  <th className="px-4 py-3 text-left font-semibold text-green-800">Motivo</th>
                  <th className="px-4 py-3 text-left font-semibold text-green-800">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white/60">
                {pagos.map((pago) => (
                  <tr key={pago.id_pago} className="border-b border-green-100">
                    <td className="px-4 py-3">{pago.id_poliza}</td>
                    <td className="px-4 py-3 font-semibold text-green-700">${pago.monto}</td>
                    <td className="px-4 py-3 capitalize">{pago.metodo_pago.replace("_", " ")}</td>
                    <td className="px-4 py-3 capitalize">{pago.motivo_pago.replace("_", " ")}</td>
                    <td className="px-4 py-3">{pago.fecha_pago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <footer className="relative py-6 text-gray-600 text-sm text-center z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
