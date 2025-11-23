import { useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";

export default function EditarBienUsuario() {
  const { idBien } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const bienFromState = location.state?.bien;

  const [formData, setFormData] = useState({
    nombreBien: "",
    valoracionBien: "",
    tipoDeBien: "bien_inmueble",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const TipoBien = {
    bien_inmueble: "Bien Inmueble",
    bien_automotriz: "Bien Automotriz",
    otro: "Otro",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("No se encontró el usuario en la sesión.");
      return;
    }

    if (!idBien || !bienFromState) {
      setError("No se encontró el bien a editar. Vuelve a Mis Bienes.");
      return;
    }

    if (!formData.nombreBien.trim()) {
      setError("El nombre del bien es obligatorio.");
      return;
    }

    if (!formData.valoracionBien || Number(formData.valoracionBien) <= 0) {
      setError("La valoración del bien debe ser mayor que 0.");
      return;
    }

    if (
      !formData.tipoDeBien ||
      !["bien_inmueble", "bien_automotriz", "otro"].includes(formData.tipoDeBien)
    ) {
      setError("Debe seleccionar un tipo de bien válido.");
      return;
    }

    const payload = {
      idBien: Number(idBien),
      userId: Number(userId),
      nombreBien: formData.nombreBien.trim(),
      valoracionBien: Number(formData.valoracionBien),
      tipoDeBien: formData.tipoDeBien,
    };

    try {
      setSaving(true);

      const resp = await fetch(
        "http://localhost:33761/api/bienes/usuario/modificar-bien",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await resp.json();

      if (resp.ok && data.success) {
        alert("Bien modificado correctamente.");
        navigate("/me/bienes");
      } else {
        setError(data.message || "No se pudo modificar el bien.");
      }
    } catch (err) {
      console.error("Error al modificar bien:", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  if (!bienFromState) {
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
          <Link
            to="/me/bienes"
            className="!text-green-700 hover:text-green-900 transition flex items-center gap-1 no-underline"
          >
            Volver a Mis Bienes
          </Link>
        </header>

        <main className="relative flex-1 flex justify-center items-center px-4 z-10">
          <div className="bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-red-100 max-w-md w-full text-center">
            <p className="text-red-600 font-semibold mb-2">
              No se pudo cargar la información del bien.
            </p>
            <p className="text-gray-700 text-sm mb-4">
              Vuelve a la página de <strong>Mis Bienes</strong> y selecciona nuevamente el bien que deseas editar.
            </p>
            <Link
              to="/me/bienes"
              className="inline-block no-underline border-2 !border-green-600 !text-green-700 hover:!bg-green-600 hover:!text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Volver a Mis Bienes
            </Link>
          </div>
        </main>
      </div>
    );
  }

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

        <Link
          to="/me/bienes"
          className="!text-green-700 hover:text-green-900 transition flex items-center gap-1 no-underline"
          title="Volver"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Volver a Mis Bienes
        </Link>
      </header>

      <main className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
        <div className="max-w-xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-green-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-2 text-center md:text-left">
            Editar bien #{idBien}
          </h1>
          <p className="text-gray-700 text-sm md:text-base mb-6 text-center md:text-left">
            Actualiza manualmente la información de este bien registrado.
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-800">
            <div>
              <label className="block font-semibold mb-1">Nombre del bien</label>
              <input
                type="text"
                name="nombreBien"
                value={formData.nombreBien}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                placeholder="Ej: Casa principal, Auto, Terreno..."
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Tipo de bien</label>
              <select
                name="tipoDeBien"
                value={formData.tipoDeBien}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                required
              >
                <option value="bien_inmueble">{TipoBien.bien_inmueble}</option>
                <option value="bien_automotriz">{TipoBien.bien_automotriz}</option>
                <option value="otro">{TipoBien.otro}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Valoración (USD)</label>
              <input
                type="number"
                name="valoracionBien"
                value={formData.valoracionBien}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                placeholder="Ej: 15000"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="pt-4 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate("/me/bienes")}
                className="w-1/2 px-4 py-2 rounded-lg border !border-green-600 !text-green-700 font-semibold hover:bg-green-50 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="w-1/2 px-4 py-2 rounded-lg !bg-green-700 hover:bg-green-800 !text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="relative py-6 text-gray-600 text-sm text-center z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
