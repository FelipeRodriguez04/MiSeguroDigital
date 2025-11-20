import { Link, useNavigate } from "react-router-dom";

const aseguradoras = [
  { id_aseguradora: 1, nombre: "Aseguradora Andina" },
  { id_aseguradora: 2, nombre: "Seguros Pacífico" },
];

const brokers = [
  { id_broker: 1, nombre: "Juan", apellido: "Pérez", telefono: "0991234567", id_aseguradora: 1 },
  { id_broker: 2, nombre: "Ana", apellido: "Rodríguez", telefono: "0987654321", id_aseguradora: 1 },
  { id_broker: 3, nombre: "Luis", apellido: "Gómez", telefono: "0975558888", id_aseguradora: 2 },
];

export default function GlobalUserBrokers() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=1650&q=80')",
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">

        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl">MiSeguroDigital</div>
        </header>

        <div className="px-6 mt-6 text-center">
          <h1 className="text-5xl font-extrabold text-green-700 drop-shadow-sm">
            Brokers Registrados
          </h1>

          <p className="text-gray-700 mt-2 text-lg">
            Lista de todos los <strong>brokers</strong> registrados en las aseguradoras.
          </p>
        </div>

        <main className="flex-1 flex flex-col justify-start items-center px-6 mt-6">
          <div className="max-w-5xl w-full bg-white/85 rounded-2xl shadow-xl p-10">

            <table className="min-w-full border text-sm rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-green-50 text-green-900">
                <tr>
                  <th className="border px-3 py-2">ID</th>
                  <th className="border px-3 py-2">Nombre</th>
                  <th className="border px-3 py-2">Teléfono</th>
                  <th className="border px-3 py-2">Aseguradora</th>
                  <th className="border px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((b) => {
                  const aseg = aseguradoras.find(a => a.id_aseguradora === b.id_aseguradora);

                  return (
                    <tr key={b.id_broker} className="odd:bg-gray-50 hover:bg-green-50 transition">
                      <td className="border px-3 py-2 font-medium">{b.id_broker}</td>
                      <td className="border px-3 py-2">{b.nombre} {b.apellido}</td>
                      <td className="border px-3 py-2">{b.telefono}</td>
                      <td className="border px-3 py-2">{aseg?.nombre}</td>

                      <td className="border px-3 py-2 text-center space-x-3">

                        <button
                          className="px-3 py-1 !bg-yellow-500 !text-white text-xs rounded-lg hover:bg-yellow-700 transition"
                          onClick={() => navigate(`/global-user/brokers/editar/${b.id_broker}`)}
                        >
                          Editar
                        </button>

                        <button
                          className="px-3 py-1 !bg-red-600 !text-white text-xs rounded-lg hover:bg-red-700 transition"
                          onClick={() => alert(`Eliminar broker ${b.id_broker}`)}
                        >
                          Eliminar
                        </button>

                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
        </main>

        <footer className="py-4 text-gray-600 text-sm text-center">
          © 2025 MiSeguroDigital — Global User.
        </footer>

      </div>
    </div>
  );
}
