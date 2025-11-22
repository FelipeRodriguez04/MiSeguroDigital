import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function EditarPerfilUsuario() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombrePrim: "",
    apellidoPrim: "",
    fullNombre: "",
    telefono: "",
    fechaNacimiento: "",
    userId: userId,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const resp = await fetch(
          `http://localhost:33761/api/usuarios/obtener-perfil/${userId}`
        );
        const data = await resp.json();

        if (resp.ok && data.data && data.data[0]) {
          const user = data.data[0];

          setFormData({
            nombrePrim: user.nombre_prim_usuario || "",
            apellidoPrim: user.apellido_prim_usuario || "",
            fullNombre: user.full_nombre_usuario || "",
            telefono: user.numero_telefono_usuario || "",
            fechaNacimiento: (user.fecha_nacimiento_usuario || "").slice(0, 10),
            userId: userId,
          });
        } else {
          setError(data.message || "No se pudieron cargar los datos.");
        }
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setError("No se encontró el usuario en la sesión.");
      setLoading(false);
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const resp = await fetch(
        `http://localhost:33761/api/usuarios/actualizar-mi-perfil`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await resp.json();

      if (resp.ok) {
        alert("Perfil actualizado correctamente.");
        localStorage.setItem("userName", formData.fullNombre);
        navigate("/me/perfil");
      } else {
        setError(data.message || "No se pudo actualizar el perfil.");
      }
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[12px]"></div>

      <header className="relative flex justify-between items-center px-8 py-4 text-green-700 font-semibold z-10">
        <div className="text-xl">MiSeguroDigital</div>
      </header>

      <main className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
        <div className="max-w-xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-green-100">
          <h1 className="text-3xl font-extrabold text-green-700 mb-4 text-center">
            Editar Perfil
          </h1>

          {loading ? (
            <div className="text-center text-gray-600 py-6">
              Cargando datos del usuario...
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4 text-sm text-gray-800"
              >
                <div>
                  <label className="block font-semibold mb-1">
                    Primer nombre
                  </label>
                  <input
                    type="text"
                    name="nombrePrim"
                    value={formData.nombrePrim}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Primer apellido
                  </label>
                  <input
                    type="text"
                    name="apellidoPrim"
                    value={formData.apellidoPrim}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                    required
                  />
                </div>


                <div>
                  <label className="block font-semibold mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="fullNombre"
                    value={formData.fullNombre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                  />
                </div>

                <div className="pt-4 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/usuario/perfil")}
                    className="w-1/2 px-4 py-2 rounded-lg border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-1/2 px-4 py-2 rounded-lg !bg-green-700 hover:bg-green-800 text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      <footer className="relative py-6 text-gray-600 text-sm text-center z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
