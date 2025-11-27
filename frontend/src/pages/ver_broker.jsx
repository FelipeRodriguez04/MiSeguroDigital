import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerBrokers() {
  const navigate = useNavigate();
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // 🔍 Cargar brokers
  // ============================================================
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const res = await fetch(
          "http://localhost:33761/api/brokers/admin/listado-brokers-historico"
        );

        const raw = await res.text();
        const data = JSON.parse(raw);

        if (!res.ok || !data.success) {
          alert("Error al cargar brokers");
          return;
        }

        setBrokers(data.data);
      } catch (err) {
        console.error("❌ ERROR FETCHING BROKERS:", err);
        alert("No se pudo cargar el listado de brokers.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-green-700">
        Cargando brokers...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80')"
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">

        {/* HEADER */}
        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl cursor-pointer" onClick={() => navigate("/")}>
            MiSeguroDigital
          </div>
          <div className="text-lg">Listado de Brokers</div>
        </header>

        {/* PANEL */}
        <div className="max-w-6xl w-full bg-white/80 rounded-2xl shadow-lg p-10 mx-auto my-10 flex-1">
          <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
            Brokers Registrados
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white rounded-xl overflow-hidden shadow-md">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {brokers.map((b) => (
                  <tr key={b.id_broker} className="border-t border-gray-200">
                    <td className="py-3 px-4">{b.id_broker}</td>
                    <td className="py-3 px-4">{b.full_nombre_broker}</td>
                    <td className="py-3 px-4">{b.email}</td>
                    <td className="py-3 px-4">{b.broker_role}</td>
                    <td className="py-3 px-4 capitalize">{b.estado_broker}</td>

                    {/* ACCIONES */}
                    <td className="py-3 px-4 flex gap-3 justify-center">

                      {/* 🟩 EDITAR */}
                      <button
                        onClick={() =>
                          navigate(`/admin/brokers/editar/${b.id_broker}`)
                        }
                        className="px-4 py-2 rounded-lg !bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        Editar
                      </button>

                      {/* 🟥 ELIMINAR */}
                      <button
                        onClick={() =>
                          navigate(`/admin/brokers/eliminar/${b.id_broker}`)
                        }
                        className="px-4 py-2 rounded-lg !bg-red-600 text-white hover:bg-red-700 transition"
                      >
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
