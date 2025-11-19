import { Link } from "react-router-dom";

const MOCK_POLIZAS_ACEPTADAS = [
  {
    id_solicitud: 1,
    numero_poliza: "VID-2025-001",
    nombre_poliza: "Seguro de Vida Familiar",
    aseguradora: "Andes Seguros S.A.",
    pago_mensual: 30,
    monto_pendiente: 120,
    moneda: "USD",
  },
  {
    id_solicitud: 2,
    numero_poliza: "AUT-2025-045",
    nombre_poliza: "Seguro Vehicular Todo Riesgo",
    aseguradora: "Quito Insurance",
    pago_mensual: 45,
    monto_pendiente: 45,
    moneda: "USD",
  },
];

export default function PagarPolizas() {
  const userName = localStorage.getItem("userName") || "Usuario";

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

        <div className="flex items-center gap-6">

          <Link
            to="/usuario"
            className="text-green-700 hover:text-green-900 transition flex items-center gap-1 no-underline"
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
          <button
            className="text-red-600 hover:text-red-700 transition flex items-center gap-2"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            title="Cerrar sesión"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
        <div className="max-w-4xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-green-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-2 text-center md:text-left">
            Pagar pólizas aceptadas
          </h1>
          <p className="text-gray-700 text-sm md:text-base mb-6 text-center md:text-left">
            Aquí puedes ver todas tus pólizas{" "}
            <span className="font-semibold">aceptadas</span> y realizar el pago con un clic.
          </p>

          {MOCK_POLIZAS_ACEPTADAS.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              No tienes pólizas aceptadas pendientes de pago.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-green-100 bg-green-50/60">
                    <th className="px-4 py-3 text-left font-semibold text-green-800">N° Póliza</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800">Nombre</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800">Aseguradora</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800">Pago mensual</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800">Monto pendiente</th>
                    <th className="px-4 py-3 text-center font-semibold text-green-800">Acción</th>
                  </tr>
                </thead>

                <tbody className="bg-white/60">
                  {MOCK_POLIZAS_ACEPTADAS.map((poliza) => (
                    <tr
                      key={poliza.id_solicitud}
                      className="border-b border-green-100 hover:bg-green-50/60 transition"
                    >
                      <td className="px-4 py-3 text-gray-800">{poliza.numero_poliza}</td>
                      <td className="px-4 py-3 text-gray-800">{poliza.nombre_poliza}</td>
                      <td className="px-4 py-3 text-gray-700">{poliza.aseguradora}</td>
                      <td className="px-4 py-3 text-gray-800">
                        {poliza.pago_mensual.toFixed(2)} {poliza.moneda}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">
                        {poliza.monto_pendiente.toFixed(2)} {poliza.moneda}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/me/pagar_polizas/${poliza.id_solicitud}`}
                          state={{ poliza }}
                          className="inline-block no-underline border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                        >
                          Pagar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative py-6 text-gray-600 text-sm text-center z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
