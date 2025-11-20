import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EditarGlobalPoliza() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    pago_mensual: "",
    cobertura_total: "",
    duracion_contrato: "",
    aseguradora: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    alert("Cambios guardados correctamente.");
    navigate(-1);
  }

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=1650&q=80')",
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">

        <header className="px-8 py-4 text-green-700 font-semibold flex items-center justify-between">
          <span className="text-xl !text-green-700">MiSeguroDigital</span>
        </header>

        <main className="flex-1 flex justify-center items-start px-6 py-10">
          <div className="bg-white/90 rounded-2xl shadow-xl p-10 max-w-3xl w-full">

            <h1 className="text-4xl font-extrabold text-green-700 text-center mb-8">
              Editar Póliza #{id}
            </h1>

            <div className="grid grid-cols-1 gap-6">

              <input
                type="text"
                name="nombre"
                placeholder="Nombre de la póliza"
                value={form.nombre}
                onChange={handleChange}
                className="p-3 border rounded-lg shadow-sm w-full"
              />

              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={handleChange}
                className="p-3 border rounded-lg shadow-sm w-full"
              />

              <input
                type="text"
                name="tipo"
                placeholder="Tipo"
                value={form.tipo}
                onChange={handleChange}
                className="p-3 border rounded-lg shadow-sm w-full"
              />

              <input
                type="number"
                name="pago_mensual"
                placeholder="Pago mensual"
                value={form.pago_mensual}
                onChange={handleChange}
                className="p-3 border rounded-lg shadow-sm w-full"
              />

              <input
                type="number"
                name="cobertura_total"
                placeholder="Cobertura total"
                value={form.cobertura_total}
                onChange={handleChange}
                className="p-3 border rounded-lg shadow-sm w-full"
              />

              <input
                type="text"
                name="duracion_contrato"
                placeholder="Duración del contrato"
                value={form.duracion_contrato}
                onChange={handleChange}
                className="p-3 border rounded-lg shadow-sm w-full"
              />

              <input
                type="text"
                name="aseguradora"
                placeholder="Aseguradora"
                value={form.aseguradora}
                onChange={handleChange}
                className="p-3 border rounded-lg shadow-sm w-full"
              />

            </div>

            <div className="flex justify-between mt-10">

              <button
                className="px-5 py-2 rounded-lg !bg-gray-500 text-white hover:bg-gray-700 transition shadow-md"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>

              <button
                className="px-5 py-2 rounded-lg !bg-green-600 text-white hover:bg-green-700 transition shadow-md"
                onClick={handleSave}
              >
                Guardar Cambios
              </button>

            </div>

          </div>
        </main>

        <footer className="text-gray-600 text-sm text-center py-6">
          © 2025 MiSeguroDigital — Global User.
        </footer>

      </div>
    </div>
  );
}
