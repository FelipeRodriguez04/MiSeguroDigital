import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarBroker() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [broker, setBroker] = useState(null);

  const rolEnum = ["broker_superadmin", "broker_admin", "broker_analyst"];

  useEffect(() => {
    const fetchBroker = async () => {
      try {
        const res = await fetch(
          "http://localhost:33761/api/brokers/admin/listado-brokers-historico"
        );

        const raw = await res.text();
        const data = JSON.parse(raw);

        const found = data.data.find((b) => b.id_broker == id);
        setBroker(found);
      } catch (e) {
        alert("Error obteniendo datos del broker");
      }
    };

    fetchBroker();
  }, [id]);

  if (!broker) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-green-700">
        Cargando datos del broker...
      </div>
    );
  }

  // ============================================================
  // 📝 Enviar actualización
  // ============================================================
  const handleSubmit = async () => {
    const adminId = Number(localStorage.getItem("userId"));
    if (!adminId) return alert("Error: adminId no encontrado.");

    setLoading(true);


    try {
      const res = await fetch(
        `http://localhost:33761/api/brokers/admin/actualizar-datos/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombrePrim: broker.nombre_prim_broker,
            apellidoPrim: broker.apellido_prim_broker,
            fullNombre: broker.full_nombre_broker,
            telefono: broker.numero_telefono_broker,
            fechaNacimiento: broker.fecha_nacimiento_broker,
            adminId,
            rolBrokerNuevo: broker.broker_role,
            estadoBroker: broker.estado_broker 
          })
        }
      );

      const raw = await res.text();
      const data = JSON.parse(raw);

      if (!res.ok || !data.success) {
        alert(`Error: ${data.message}`);
        return;
      }

      alert("Broker actualizado correctamente");
      navigate("/admin/brokers");
    } catch (err) {
      alert("Error interno al actualizar broker");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80')"
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">

        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl cursor-pointer" onClick={() => navigate("/")}>
            MiSeguroDigital
          </div>
          <div>Editar Broker</div>
        </header>

        <div className="max-w-3xl w-full bg-white/80 rounded-2xl shadow-lg p-10 mx-auto my-10">

          <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
            Editar Broker
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nombre */}
            <div>
              <label className="font-semibold text-green-800">Primer Nombre</label>
              <input
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={broker.nombre_prim_broker}
                onChange={(e) =>
                  setBroker({ ...broker, nombre_prim_broker: e.target.value })
                }
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="font-semibold text-green-800">Primer Apellido</label>
              <input
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={broker.apellido_prim_broker}
                onChange={(e) =>
                  setBroker({ ...broker, apellido_prim_broker: e.target.value })
                }
              />
            </div>

            {/* Nombre completo */}
            <div>
              <label className="font-semibold text-green-800">Nombre Completo</label>
              <input
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={broker.full_nombre_broker}
                onChange={(e) =>
                  setBroker({ ...broker, full_nombre_broker: e.target.value })
                }
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="font-semibold text-green-800">Teléfono</label>
              <input
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={broker.numero_telefono_broker}
                onChange={(e) =>
                  setBroker({
                    ...broker,
                    numero_telefono_broker: e.target.value
                  })
                }
              />
            </div>

            {/* Fecha */}
            <div>
              <label className="font-semibold text-green-800">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={broker.fecha_nacimiento_broker}
                onChange={(e) =>
                  setBroker({
                    ...broker,
                    fecha_nacimiento_broker: e.target.value
                  })
                }
              />
            </div>

            {/* Rol */}
            <div>
              <label className="font-semibold text-green-800">Rol del Broker</label>
              <select
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={broker.broker_role}
                onChange={(e) =>
                  setBroker({ ...broker, broker_role: e.target.value })
                }
              >
                {rolEnum.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="font-semibold text-green-800">Estado</label>
              <select
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={broker.estado_broker}
                onChange={(e) =>
                  setBroker({ ...broker, estado_broker: e.target.value })
                }
              >
                <option value="pendiente">pendiente</option>
                <option value="activo">activo</option>
                <option value="rechazado">rechazado</option>
              </select>
            </div>

          </div>

          <div className="flex justify-center gap-6 mt-10">

            <button
              onClick={() => navigate("/admin/brokers")}
              className="!bg-gray-400 text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition"
            >
              Cancelar
            </button>

            <button
              disabled={loading}
              onClick={handleSubmit}
              className="!bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
            >
              {loading ? "Actualizando..." : "Guardar Cambios"}
            </button>

          </div>
        </div>

        <footer className="py-6 text-gray-500 text-sm text-center">
          © 2025 MiSeguroDigital — Panel del Administrador.
        </footer>

      </div>
    </div>
  );
}
