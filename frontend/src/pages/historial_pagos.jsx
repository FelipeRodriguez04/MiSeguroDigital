import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function HistorialPagos() {
  const {registryID} = useParams();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistorial = async () => { 
      try {
        setLoading(true);
        setError("");

        const resp = await fetch(
          `http://localhost:33761/api/pagos/usuario/historial-de-pagos/${registryID}`
        );
        const data = await resp.json();

        if (!resp.ok) {
          console.error("Error al obtener historial de pagos:", data);
          if (resp.status !== 404) {
            setError(
              data.message || "Error al obtener el historial de pagos."
            );
          } else {
            setPagos([]);
          }
        } else {
          setPagos(data.data || []);
        }
      } catch (err) {
        console.error("Error de red al obtener historial de pagos:", err);
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [registryID]);

  const EstadoPagoMap = {
    completado: "Completado",
    pendiente: "Pendiente",
    fallido: "Fallido",
    reembolsado: "Reembolsado",
  };

  const MetodoPagoMap = {
    tarjeta_credito: "Tarjeta de crédito",
    tarjeta_debito: "Tarjeta de débito",
    transferencia: "Transferencia bancaria",
    efectivo: "Efectivo",
  };

  const MotivoPagoMap={
    pago_mensualidad: "Pago de mensualidad",
    pago_importe_cancelacion: "Pago por importe de cancelación",
  }

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
      </header>

      <main className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
        <div className="max-w-5xl w-full bg-white/80 rounded-2xl shadow-lg p-10 backdrop-blur-md border border-green-100">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2 text-center md:text-left">
            Historial de pagos
          </h1>
          <p className="text-gray-700 text-sm md:text-base mb-6 text-center md:text-left">
              Aquí puedes revisar todos los pagos realizados para tu registro {registryID}
          </p>

          {loading ? (
            <div className="text-center text-gray-600 py-10">
              Cargando historial de pagos...
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
              )}

              {pagos.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                  No se encontraron pagos registrados.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-green-100 bg-green-50/60">
                        <th className="px-4 py-3 text-left font-semibold text-green-800">
                          ID Pago
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-green-800">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-green-800">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-green-800">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-green-800">
                          Método de pago
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-green-800">
                          Motivo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/60">
                      {pagos.map((pago) => (
                        <tr
                          key={pago.id_pago}
                          className="border-b border-green-100 hover:bg-green-50/60 transition"
                        >
                          <td className="px-4 py-3 text-gray-800">
                            {pago.id_pago}
                          </td>
                          <td className="px-4 py-3 text-gray-800 font-semibold">
                            ${pago.cantidad_pago}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {pago.fecha_de_pago
                              ? new Date(
                                  pago.fecha_de_pago
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {EstadoPagoMap[pago.estado_del_pago] ||
                              pago.estado_del_pago}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {MetodoPagoMap[pago.metodo_de_pago] ||
                              pago.metodo_de_pago}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {MotivoPagoMap[pago.motivo_del_pago] ||
                              pago.motivo_del_pago}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="relative py-6 text-gray-600 text-sm text-center z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
