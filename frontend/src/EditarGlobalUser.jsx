import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EditarGlobalUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    username: "",
    email: "",
    telefono: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
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
              Editar Usuario #{id}
            </h1>

            <div className="space-y-4">

              <input
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                placeholder="Nombres"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

              <input
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                placeholder="Apellidos"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Nombre de Usuario"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Correo Electrónico"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Número de Teléfono"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

            </div>

            {/* BOTONES — Volver a la izquierda, Guardar a la derecha */}
            <div className="flex justify-between mt-6">
              
              <button
                className="px-5 py-2 !bg-gray-500 !text-white rounded-lg hover:bg-gray-700 transition shadow"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>

              <button
                className="px-5 py-2 !bg-green-600 !text-white rounded-lg hover:bg-green-700 transition shadow"
                onClick={handleSave}
              >
                Guardar cambios
              </button>

            </div>

          </div>
        </main>

        <footer className="py-4 text-gray-600 text-sm text-center w-full">
          © 2025 MiSeguroDigital — Global User.
        </footer>

      </div>
    </div>
  );
}

