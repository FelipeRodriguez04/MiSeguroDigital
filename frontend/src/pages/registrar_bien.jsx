import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegistrarBien() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [tipoDeBien, setTipoDeBien] = useState("bien_inmueble");
  const [nombre_bien, setNombreBien] = useState("");
  const [valoracion, setValoracion] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const TipoBien = {
    bien_inmueble: "Bien Inmueble",
    bien_automotriz: "Bien Automotriz",
    otro: "Otro",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("No se encontró el usuario en la sesión.");
      return;
    }

    if (!valoracion || Number(valoracion) <= 0) {
      setError("La valoración del bien debe ser un número mayor que 0.");
      return;
    }

    const payload = {
      userId: Number(userId),
      nombreBien: nombre_bien,
      valoracionBien: Number(valoracion),
      tipoDeBien: tipoDeBien,
    };

    try {
      setSaving(true);

      const resp = await fetch(
        "http://localhost:33761/api/bienes/usuario/registrar-bien", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await resp.json();

      if (resp.ok && data.success) {
        alert("Bien registrado correctamente.");
        navigate("/me/bienes");
      } else {
        setError(
          data.message || "No se pudo registrar el bien. Intenta nuevamente."
        );
      }
    } catch (err) {
      console.error("Error al registrar bien:", err);
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Volver a Mis Bienes
        </Link>
      </header>

      <main className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
        <div className="max-w-xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-green-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-2 text-center md:text-left">
            Registrar nuevo bien
          </h1>
          <p className="text-gray-700 text-sm md:text-base mb-6 text-center md:text-left">
            Agrega un bien a tu perfil para poder asociarlo a tus futuras
            pólizas.
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-800">
            <div>
              <label className="block font-semibold mb-1">Tipo de bien</label>
              <select
                value={tipoDeBien}
                onChange={(e) => setTipoDeBien(e.target.value)}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                required
              >
                <option value="bien_inmueble">{TipoBien.bien_inmueble}</option>
                <option value="bien_automotriz">{TipoBien.bien_automotriz}</option>
                <option value="otro">{TipoBien.otro}</option>
              </select>
            </div>

            <div>
                <label className="block font-semibold mb-1">Nombre del Bien</label>
                <input
                  type="text"
                    value={nombre_bien}
                    onChange={(e) => setNombreBien(e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                  placeholder="Ej: Casa en la playa, Auto deportivo, etc."
                  required
                />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Valoración del bien (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valoracion}
                onChange={(e) => setValoracion(e.target.value)}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                placeholder="Ej: 15000"
                required
              />
            </div>

            <div className="pt-4 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate("/me/bienes")}
                className="w-1/2 px-4 py-2 rounded-lg border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-1/2 px-4 py-2 rounded-lg !bg-green-700 hover:bg-green-800 !text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Guardando..." : "Registrar bien"}
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
