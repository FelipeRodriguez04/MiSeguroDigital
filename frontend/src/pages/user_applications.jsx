export default function MyApplications() {
  // Mock alineado a AplicacionPoliza + relación con Polizas y Brokers
  const APPS_BY_USER = {
    "user@example.com": [
      {
        id_aplicacion_poliza: 1001,
        poliza: "Seguro Vehicular",
        fecha_solicitud: "2025-10-21",
        estado_aplicacion: "Aprobada",
      },
      {
        id_aplicacion_poliza: 1002,
        poliza: "Seguro de Vida Familiar",
        fecha_solicitud: "2025-11-03",
        estado_aplicacion: "Pendiente",
      },
    ],
    "ana@example.com": [
      {
        id_aplicacion_poliza: 2001,
        poliza: "Seguro Hogar Plus",
        fecha_solicitud: "2025-08-12",
        estado_aplicacion: "Pendiente",
      },
      {
        id_aplicacion_poliza: 2002,
        poliza: "Seguro Viaje Anual",
        fecha_solicitud: "2025-11-01",
        estado_aplicacion: "Rechazada",
      },
    ],
  };

  const userId = localStorage.getItem("userId") || "";
  const userName = localStorage.getItem("userName") || "Usuario";
  const apps = APPS_BY_USER[userId] || [];

  const statusColors = {
    Aprobada: "text-green-700 font-semibold",
    Pendiente: "text-yellow-600 font-semibold",
    Rechazada: "text-red-600 font-semibold",
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-green-50 via-white to-green-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-green-700 mb-2 text-center">Mis Solicitudes</h1>
        <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto text-center">
          Hola <span className="font-semibold text-green-700">{userName}</span>, estas son tus solicitudes.
        </p>

        <div className="w-full bg-white/80 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
          {apps.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              <p>No tienes solicitudes registradas.</p>
              <a href="/catalog" className="inline-block mt-4 text-green-700 hover:text-green-800 underline font-semibold">
                Ir al catálogo de pólizas →
              </a>
            </div>
          ) : (
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b-2 border-green-200">
                    <th className="py-3 px-4 text-green-800 text-lg">Póliza</th>
                    <th className="py-3 px-4 text-green-800 text-lg">Fecha solicitud</th>
                    <th className="py-3 px-4 text-green-800 text-lg">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr key={app.id_aplicacion_poliza} className="border-b border-gray-200 hover:bg-green-50 transition">
                      <td className="py-3 px-4">{app.poliza}</td>
                      <td className="py-3 px-4">{app.fecha_solicitud}</td>
                      <td className={`py-3 px-4 ${statusColors[app.estado_aplicacion] || ""}`}>
                        {app.estado_aplicacion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="mt-12 text-gray-500 text-sm text-center">© 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.</footer>
      </div>
    </div>
  );
}

