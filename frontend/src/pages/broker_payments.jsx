import { Link } from "react-router-dom";

const MOCK_PAGOS = [
  {
    id_pago: 1001,
    numero_poliza: "VID-2025-001",
    nombre_poliza: "Seguro de Vida Familiar",
    asegurado: "Carlos Pérez",
    metodo_pago: "tarjeta crédito",
    motivo_pago: "pago mensualidad",
    monto: 30,
    moneda: "USD",
    fecha_pago: "2025-11-10 14:32",
    estado: "Confirmado",
  },
  {
    id_pago: 1002,
    numero_poliza: "AUT-2025-045",
    nombre_poliza: "Seguro Vehicular Todo Riesgo",
    asegurado: "María López",
    metodo_pago: "efectivo",
    motivo_pago: "pago importe cancelación",
    monto: 450,
    moneda: "USD",
    fecha_pago: "2025-11-11 09:15",
    estado: "Pendiente revisión",
  },
  {
    id_pago: 1003,
    numero_poliza: "HOG-2025-020",
    nombre_poliza: "Seguro de Hogar Plus",
    asegurado: "Juan Gómez",
    metodo_pago: "tarjeta débito",
    motivo_pago: "pago mensualidad",
    monto: 55,
    moneda: "USD",
    fecha_pago: "2025-11-11 18:47",
    estado: "Confirmado",
  },
];

export default function BrokerPayments() {
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

        <div className="flex items-center gap-6">
          <button
            className="text-red-600 hover:text-red-700 transition flex items-center gap-2"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            title="Cerrar sesión"
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
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
        <div className="max-w-5xl w-full bg-white/85 rounded-2xl shadow-xl p-8 backdrop-blur-md mx-4 border border-green-100 text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-2 text-center md:text-left">
            Pagos registrados
          </h1>
          <p className="text-gray-700 text-sm md:text-base mb-6 text-center md:text-left">
            Revisa los pagos realizados por los usuarios, verifica su estado y
            mantén un control preciso del flujo de cobros.
          </p>

          {MOCK_PAGOS.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              No hay pagos registrados para revisar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-green-100 bg-green-50/60">
                    <th className="px-3 py-3 text-left font-semibold text-green-800">
                      ID Pago
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-green-800">
                      N° Póliza
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-green-800">
                      Asegurado
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-green-800">
                      Método
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-green-800">
                      Motivo
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-green-800">
                      Monto
                    </th>
                    <th className="px-3 py-3 text-left font-semibold text-green-800">
                      Fecha
                    </th>
                    <th className="px-3 py-3 text-center font-semibold text-green-800">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/70">
                  {MOCK_PAGOS.map((pago) => (
                    <tr
                      key={pago.id_pago}
                      className="border-b border-green-100 hover:bg-green-50/60 transition"
                    >
                      <td className="px-3 py-2 text-gray-800">{pago.id_pago}</td>
                      <td className="px-3 py-2 text-gray-800">
                        <div className="font-semibold">{pago.numero_poliza}</div>
                        <div className="text-[11px] text-gray-500">
                          {pago.nombre_poliza}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-gray-800">{pago.asegurado}</td>
                      <td className="px-3 py-2 text-gray-800 capitalize">
                        {pago.metodo_pago}
                      </td>
                      <td className="px-3 py-2 text-gray-800 capitalize">
                        {pago.motivo_pago}
                      </td>
                      <td className="px-3 py-2 text-gray-900 font-semibold">
                        {pago.monto.toFixed(2)} {pago.moneda}
                      </td>
                      <td className="px-3 py-2 text-gray-700">{pago.fecha_pago}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-[11px] font-semibold ${
                            pago.estado === "Confirmado"
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                          }`}
                        >
                          {pago.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="mt-10 text-gray-600 text-sm">
          © 2025 MiSeguroDigital — Panel del Analista.
        </footer>
      </main>
    </div>
  );
}
