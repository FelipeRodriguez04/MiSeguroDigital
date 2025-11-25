import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EditarGlobalUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const usuarioFromState = location.state?.usuario || null;

  const [form, setForm] = useState({
    nombrePrim: "",
    apellidoPrim: "",
    fullNombre: "",
    telefono: "",
    fechaNacimiento: "",
    rolUsuario: "global_user",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuarioFromState) {
      setForm((prev) => ({
        ...prev,
        nombrePrim: usuarioFromState.nombre_primario || "",
        apellidoPrim: usuarioFromState.apellido_primario || "",
        fullNombre: usuarioFromState.nombre_completo || "",
        telefono: usuarioFromState.telefono || "",
        rolUsuario: usuarioFromState.rol_usuario || "",
      }));
    }
  }, [usuarioFromState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (
      !form.nombrePrim.trim() ||
      !form.apellidoPrim.trim() ||
      !form.telefono.trim() ||
      !form.fechaNacimiento ||
      !form.rolUsuario
    ) {
      alert(
        "Por favor completa nombre primario, apellido primario, teléfono, fecha de nacimiento y rol."
      );
      return;
    }

    const adminId = localStorage.getItem("userId");
    if (!adminId) {
      alert("No se encontró adminId en localStorage. Inicia sesión nuevamente.");
      return;
    }

    const fullNombre =
      form.fullNombre?.trim() ||
      `${form.nombrePrim} ${form.apellidoPrim}`.trim();

    const payload = {
      comingFrom: "admin",
      nombrePrim: form.nombrePrim,
      apellidoPrim: form.apellidoPrim,
      fullNombre:form.fullNombre,
      telefono: form.telefono,
      fechaNacimiento: form.fechaNacimiento, 
      rolUsuario: form.rolUsuario,
      adminId: Number(adminId),
    };

    try {
      setLoading(true);

      const resp = await fetch(
        `http://localhost:33761/api/usuarios/admin/actualizar-perfil-usuario/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || !data.success) {
        alert(data.message || "Error al actualizar el perfil del usuario.");
        setLoading(false);
        return;
      }

      alert(data.message || "Perfil actualizado correctamente.");
      navigate("/global_user/usuarios");
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      alert("Error interno al actualizar el usuario: " + err.message);
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
                name="nombrePrim"
                value={form.nombrePrim}
                onChange={handleChange}
                placeholder="Nombre Primario"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

              <input
                name="apellidoPrim"
                value={form.apellidoPrim}
                onChange={handleChange}
                placeholder="Apellido Primario"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

              <input
                name="fullNombre"
                value={form.fullNombre}
                onChange={handleChange}
                placeholder="Nombre Completo"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Número de Teléfono"
                className="w-full px-4 py-2 border rounded-lg !text-black"
              />

              <div className="flex flex-col items-start gap-1">
                <label className="text-sm text-gray-700">
                  Fecha de nacimiento
                </label>
                <input
                  name="fechaNacimiento"
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg !text-black"
                />
              </div>

              <div className="flex flex-col items-start gap-1">
                <label className="text-sm text-gray-700">Rol del usuario</label>
                <select
                  name="rolUsuario"
                  value={form.rolUsuario}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg !text-black bg-white"
                >
                  <option value="global_user">Global User</option>
                  <option value="global_admin">Global Admin</option>
                  <option value="global_superadmin">Global Superadmin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="px-5 py-2 !bg-gray-500 !text-white rounded-lg hover:bg-gray-700 transition shadow"
                onClick={() => navigate("/global_user/usuarios")}
                disabled={loading}
              >
                Volver
              </button>

              <button
                className="px-5 py-2 !bg-green-600 !text-white rounded-lg hover:bg-green-700 transition shadow disabled:opacity-60"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
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
