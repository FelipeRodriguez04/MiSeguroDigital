import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearBroker() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombrePrim: "",
    apellidoPrim: "",
    fullNombre: "",
    telefono: "",
    fechaNacimiento: "",
    aseguradoraId: "",
    estadoBroker: "pendiente",
    rolBroker: "broker_admin"
  });

  const estadoEnum = ["pendiente", "activo"];
  const rolEnum = ["broker_superadmin", "broker_admin", "broker_analyst"];

  // ============================================================
  // 🎯 Manejar cambios del formulario
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================================
  // 🚀 Enviar formulario
  // ============================================================
  const handleSubmit = async () => {
    const adminId = Number(localStorage.getItem("userId"));

    if (!adminId) {
      alert("No se encontró adminId en sesión.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:33761/api/brokers/admin/registrar-broker",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            aseguradoraId: Number(formData.aseguradoraId),
            adminId
          })
        }
      );

      const raw = await res.text();
      let data = JSON.parse(raw);

      if (!res.ok || !data.success) {
        alert(`Error: ${data.message}`);
        return;
      }

      alert("Broker creado correctamente.");
      navigate("/admin/brokers"); // <-- Ajusta esta ruta si tu pantalla está en otro path

    } catch (err) {
      console.error("❌ ERROR CREANDO BROKER:", err);
      alert("Error interno al crear el broker.");
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
          <div>Crear Nuevo Broker</div>
        </header>

        <div className="max-w-4xl w-full bg-white/80 rounded-2xl shadow-lg p-8 mx-auto my-10 flex-1">

          <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
            Registrar Broker
          </h1>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

            {/* EMAIL */}
            <div>
              <label className="font-semibold text-green-800">Email</label>
              <input
                type="email"
                name="email"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@empresa.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="font-semibold text-green-800">Contraseña</label>
              <input
                type="password"
                name="password"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingrese contraseña"
              />
            </div>

            {/* Primer Nombre */}
            <div>
              <label className="font-semibold text-green-800">Primer Nombre</label>
              <input
                type="text"
                name="nombrePrim"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={formData.nombrePrim}
                onChange={handleChange}
              />
            </div>

            {/* Primer Apellido */}
            <div>
              <label className="font-semibold text-green-800">Primer Apellido</label>
              <input
                type="text"
                name="apellidoPrim"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={formData.apellidoPrim}
                onChange={handleChange}
              />
            </div>

            {/* Nombre Completo */}
            <div>
              <label className="font-semibold text-green-800">Nombre Completo</label>
              <input
                type="text"
                name="fullNombre"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={formData.fullNombre}
                onChange={handleChange}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="font-semibold text-green-800">Teléfono</label>
              <input
                type="text"
                name="telefono"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            {/* Fecha Nacimiento */}
            <div>
              <label className="font-semibold text-green-800">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={formData.fechaNacimiento}
                onChange={handleChange}
              />
            </div>

            {/* Aseguradora */}
            <div>
              <label className="font-semibold text-green-800">ID Aseguradora</label>
              <input
                type="number"
                name="aseguradoraId"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={formData.aseguradoraId}
                onChange={handleChange}
                placeholder="Ej: 1"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="font-semibold text-green-800">Estado</label>
              <select
                name="estadoBroker"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={formData.estadoBroker}
                onChange={handleChange}
              >
                {estadoEnum.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {/* Rol */}
            <div>
              <label className="font-semibold text-green-800">Rol del Broker</label>
              <select
                name="rolBroker"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                value={formData.rolBroker}
                onChange={handleChange}
              >
                {rolEnum.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {/* BOTONES */}
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
              {loading ? "Creando..." : "Crear Broker"}
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
