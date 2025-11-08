export default function BrokerApplications() {
  const pendingApps = [
    { id: 101, user: "user@example.com", policy: "Seguro Vehicular", date: "2025-11-03", status: "Pendiente" },
    { id: 102, user: "ana@example.com", policy: "Seguro Hogar Plus", date: "2025-10-27", status: "Pendiente" },
  ];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-green-50 via-white to-green-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
          Solicitudes Pendientes
        </h1>
        <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto text-center">
          Aquí puedes revisar, aprobar o rechazar las solicitudes enviadas por los usuarios.
        </p>

        <div className="w-full bg-white/80 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
          {pendingApps.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              <p>No hay solicitudes pendientes.</p>
            </div>
          ) : (
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b-2 border-green-200">
                    <th className="py-3 px-4 text-green-800 text-lg">Usuario</th>
                    <th className="py-3 px-4 text-green-800 text-lg">Póliza</th>
                    <th className="py-3 px-4 text-green-800 text-lg">Fecha</th>
                    <th className="py-3 px-4 text-green-800 text-lg text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApps.map((app) => (
                    <tr key={app.id} className="border-b border-gray-200 hover:bg-green-50 transition">
                      <td className="py-3 px-4">{app.user}</td>
                      <td className="py-3 px-4">{app.policy}</td>
                      <td className="py-3 px-4">{app.date}</td>
                      <td className="py-3 px-4 flex justify-center gap-3">
                        <button className="!bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                          Aprobar
                        </button>
                        <button className="!bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                          Rechazar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="mt-12 text-gray-500 text-sm text-center">
          © 2025 MiSeguroDigital — Panel del Analista.
        </footer>
      </div>
    </div>
  );
}
