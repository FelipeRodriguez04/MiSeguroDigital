export default function MyApplications() {
  const APPS_BY_USER = {
    "user@example.com": [
      { id: 1001, policy: "Seguro Vehicular", date: "2025-10-21", status: "Aprobada" },
      { id: 1002, policy: "Seguro de Vida Familiar", date: "2025-11-03", status: "Pendiente" },
    ],
    "ana@example.com": [
      { id: 2001, policy: "Seguro Hogar Plus", date: "2025-08-12", status: "Pendiente" },
      { id: 2002, policy: "Seguro Viaje Anual", date: "2025-11-01", status: "Rechazada" },
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
        <h1 className="text-4xl font-extrabold text-green-700 mb-4 text-center">
          Mis Solicitudes
        </h1>
        <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto text-center">
          Hola <span className="font-semibold text-green-700">{userName}</span>, estas son tus solicitudes.
        </p>

        <div className="w-full bg-white/80 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
          {apps.length === 0 ? (
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
                    <th className="py-3 px-4 text-green-800 text-lg">Fecha</th>
                    <th className="py-3 px-4 text-green-800 text-lg">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-gray-200 hover:bg-green-50 transition"
                    >
                      <td className="py-3 px-4">{app.policy}</td>
                      <td className="py-3 px-4">{app.date}</td>
                      <td className={`py-3 px-4 ${statusColors[app.status] || ""}`}>
                        {app.status}
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
