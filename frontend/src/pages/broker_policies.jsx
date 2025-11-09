export default function BrokerPolicies() {
  const policies = [
    {
      id: 1,
      name: "Seguro Vehicular Premium",
      coverage: "Daños, robo total y responsabilidad civil",
      price: "$45/mes",
    },
    {
      id: 2,
      name: "Seguro de Vida Familiar",
      coverage: "Cobertura por fallecimiento y gastos médicos",
      price: "$30/mes",
    },
    {
      id: 3,
      name: "Seguro Hogar Plus",
      coverage: "Incendio, robo y daños por agua",
      price: "$25/mes",
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-green-50 via-white to-green-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
          Gestión de Pólizas
        </h1>
        <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto text-center">
          Aquí puedes revisar, editar o eliminar las pólizas que ofrece el broker.
        </p>

        <div className="w-full bg-white/80 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b-2 border-green-200">
                  <th className="py-3 px-4 text-green-800 text-lg">Nombre</th>
                  <th className="py-3 px-4 text-green-800 text-lg">Cobertura</th>
                  <th className="py-3 px-4 text-green-800 text-lg">Precio</th>
                  <th className="py-3 px-4 text-green-800 text-lg text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr
                    key={policy.id}
                    className="border-b border-gray-200 hover:bg-green-50 transition"
                  >
                    <td className="py-3 px-4 font-semibold">{policy.name}</td>
                    <td className="py-3 px-4">{policy.coverage}</td>
                    <td className="py-3 px-4">{policy.price}</td>
                    <td className="py-3 px-4 flex justify-center gap-3">
                      <button className="!bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition">
                        Editar
                      </button>
                      <button className="!bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="mt-12 text-gray-500 text-sm text-center">
          © 2025 MiSeguroDigital — Panel del Administrador del Broker.
        </footer>
      </div>
    </div>
  );
}
