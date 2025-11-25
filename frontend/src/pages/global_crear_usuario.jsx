import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    nombrePrim: "",
    apellidoPrim: "",
    fullNombre: "",
    telefono: "",
    fechaNacimiento: "",
    rolUsuario: "global_user", 
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminId = localStorage.getItem("userId");
    if (!adminId) {
      alert("No se encontró el ID del administrador (adminId).");
      return;
    }

    if (
      !form.email ||
      !form.password ||
      !form.nombrePrim ||
      !form.apellidoPrim ||
      !form.fullNombre ||
      !form.telefono ||
      !form.fechaNacimiento ||
      !form.rolUsuario
    ) {
      alert("Por favor completa todos los campos obligatorios (*).");
      return;
    }

    try {
      setLoading(true);

      const resp = await fetch(
        "http://localhost:33761/api/autenticacion/admins/registrar-usuario",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            adminId, 
          }),
        }
      );

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        alert(data.message || "Error al crear el usuario.");
        return;
      }

      alert("Usuario creado correctamente (ID: " + data.usuarioId + ")");
      navigate("/global_user/usuarios"); 
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Error interno al intentar crear el usuario.");
    } finally {
      setLoading(false);
    }
  };

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

        <main className="flex-1 flex flex-col justify-start items-center px-6 mt-6">
          <div className="max-w-xl w-full bg-white/85 rounded-2xl shadow-xl p-8 border border-green-100">
            <h1 className="text-3xl font-extrabold text-green-700 mb-2 text-center">
              Crear nuevo usuario
            </h1>
            <p className="text-gray-700 mb-6 text-center">
              Completa la información del <strong>nuevo cliente</strong>.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico 
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña 
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre primario 
                </label>
                <input
                  type="text"
                  name="nombrePrim"
                  value={form.nombrePrim}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Juan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido primario 
                </label>
                <input
                  type="text"
                  name="apellidoPrim"
                  value={form.apellidoPrim}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo 
                </label>
                <input
                  type="text"
                  name="fullNombre"
                  value={form.fullNombre}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Juan Pérez Andrade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono 
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  placeholder="0999999999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de nacimiento 
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol de usuario 
                </label>
                <select
                  name="rolUsuario"
                  value={form.rolUsuario}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="global_user">Global User</option>
                  <option value="global_admin">Global Administrador</option>
                    <option value="global_superadmin">Global SuperAdministrador</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg !border border-gray-300 text-sm !text-gray-700 hover:!bg-gray-100"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg !bg-green-600 !text-white text-sm font-semibold hover:!bg-green-700 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </main>

        <footer className="py-4 text-gray-600 text-sm text-center">
          © 2025 MiSeguroDigital — Crear Usuario.
        </footer>
      </div>
    </div>
  );
}
