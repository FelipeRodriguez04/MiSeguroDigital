import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

// Datos simulados (idealmente vendrían del backend o context)
const brokers = [
  { id_broker: 1, nombre: "Juan", apellido: "Pérez", telefono: "0991234567", estado: "activo" },
  { id_broker: 2, nombre: "Ana", apellido: "Rodríguez", telefono: "0987654321", estado: "activo" },
  { id_broker: 3, nombre: "Luis", apellido: "Gómez", telefono: "0975558888", estado: "inactivo" },
];

export default function EditarGlobalBroker() {
  const { id } = useParams();
  const navigate = useNavigate();

  const broker = brokers.find(b => b.id_broker === Number(id));

  const [form, setForm] = useState({
    nombre: broker?.nombre || "",
    apellido: broker?.apellido || "",
    telefono: broker?.telefono || "",
    estado: broker?.estado || "activo",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    alert("Cambios guardados (simulado)");
    navigate(-1);
  };

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=1650&q=80')",
      }}
    >
      <div className="bg-white/70 min-h-screen backdrop-blur-sm flex flex-col items-center">

        <header className="flex justify-between w-full px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl">MiSeguroDigital</div>
        </header>

        <main className="flex-1 flex justify-center items-start w-full px-6 py-8">
          <div className="bg-white/85 p-10 rounded-2xl shadow-xl max-w-xl w-full mt-8">

            <h1 className="text-4xl font-extrabold text-green-700 text-center mb-6">
              Editar Broker #{id}
            </h1>

            <div className="space-y-4">
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg !text-black"
              >
                <option value="activo">Activo</option>
                <option value="rechazado">Rechazado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>

            <div className="flex justify-between mt-6">

              <button
                className="px-5 py-2 !bg-gray-500 !text-white rounded-lg hover:bg-gray-700 transition shadow"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>

              <button
                className="px-5 py-2 !bg-green-600 !text-white rounded-lg hover:bg-green-700 transition shadow"
                onClick={handleGuardar}
              >
                Guardar cambios
              </button>

            </div>

          </div>
        </main>

        <footer className="py-4 text-gray-600 text-sm text-center w-full">
          © 2025 MiSeguroDigital — Editar Global User.
        </footer>

      </div>
    </div>
  );
}
