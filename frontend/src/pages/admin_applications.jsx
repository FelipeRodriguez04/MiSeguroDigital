import { useNavigate } from "react-router-dom";

export default function BrokerApplications() {
  const navigate = useNavigate();

  const pendingApps = [
    { 
      id: 101, 
      user: "user@example.com", 
      policy: "Seguro Vehicular", 
      date: "2025-11-03", 
      status: "Pendiente", 
      description: "Cobertura contra daños y robo.", 
      type: "Vehicular", 
      monthlyPayment: 35 
    },
    { 
      id: 102, 
      user: "ana@example.com", 
      policy: "Seguro Hogar Plus", 
      date: "2025-10-27", 
      status: "Pendiente", 
      description: "Cobertura completa para el hogar.", 
      type: "Hogar", 
      monthlyPayment: 42 
    },
  ];

  const goToDetails = (app) => {
    navigate("/admin/application-details", { state: app });
  };

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80')"
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">
        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl">MiSeguroDigital</div>
        </header>

        <main className="flex-1 flex flex-col justify-center items-center py-10 px-4">
          <div className="max-w-5xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
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

                            <button
                              onClick={() => goToDetails(app)}
                              className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                              Ver Detalles
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="py-6 text-gray-500 text-sm text-center">
          © 2025 MiSeguroDigital — Panel del Administrador.
        </footer>
      </div>
    </div>
  );
}
