import { useNavigate } from "react-router-dom";

export default function BrokerPolicies() {
  const navigate = useNavigate();

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
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">
        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl">MiSeguroDigital</div>
        </header>

        <div className="max-w-5xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-sm justify-center mx-auto my-10 flex-1">
          <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
            Gestión de Pólizas
          </h1>
          <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto text-center">
            Aquí puedes revisar, editar o eliminar las pólizas que ofrece el broker.
          </p>

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
                      
                      {/* BOTÓN EDITAR ACTUALIZADO */}
                      <button
                        onClick={() => navigate(`/broker_edit_policy/${policy.id}`)}
                        className="!bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                      >
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

        <footer className="py-6 text-gray-500 text-sm text-center">
          © 2025 MiSeguroDigital — Panel del Administrador.
        </footer>
      </div>
    </div>
  );
}
