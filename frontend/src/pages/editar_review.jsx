import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function EditReview() {
  const { id_review } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { review, policy } = location.state || {};
  const userId = localStorage.getItem("userId");

  if (!review || !policy) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-xl">
        No se pudo cargar la información del review.
      </div>
    );
  }

  const [rating, setRating] = useState(review.rating_del_usuario || 5);
  const [contexto, setContexto] = useState(review.contexto_review || "");
  const [tieneHiddenFees, setTieneHiddenFees] = useState(
    Boolean(review.tiene_hidden_fees)
  );
  const [detalleHiddenFees, setDetalleHiddenFees] = useState(
    review.detalle_hidden_fees || ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const polizaIdNumber = policy.id_poliza;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("No se encontró el usuario en la sesión.");
      return;
    }

    if (!rating) {
      setError("Debes seleccionar un rating.");
      return;
    }

    if (!contexto.trim()) {
      setError("Debes escribir un contexto/comentario.");
      return;
    }

    if (tieneHiddenFees && !detalleHiddenFees.trim()) {
      setError(
        "Si indicas que la póliza tiene cargos ocultos, debes detallar cuáles son."
      );
      return;
    }

    const payload = {
      usuarioId: Number(userId),
      rating: Number(rating),
      contexto: contexto.trim(),
      tieneHiddenFees: Boolean(tieneHiddenFees),
      detalleHiddenFees: tieneHiddenFees ? detalleHiddenFees.trim() : "",
    };

    try {
      setSaving(true);

      const resp = await fetch(
        `http://localhost:33761/api/comentarios/usuarios/actualizar-comentario-en-poliza/${id_review}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await resp.json();

      if (resp.ok && data.success) {
        alert("Comentario actualizado correctamente.");
        navigate(`/catalog/details/${polizaIdNumber}`, {
          state: { policy },
        });
      } else {
        setError(
          data.message || "No se pudo actualizar el comentario. Intenta nuevamente."
        );
      }
    } catch (err) {
      console.error("Error al actualizar comentario:", err);
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

      <main className="relative flex-1 flex flex-col items-center px-4 py-6 z-10">
        <div className="max-w-2xl w-full bg-white/85 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-green-100">
          <h1 className="text-3xl font-extrabold text-green-700 mb-2 text-center">
            Editar Review
          </h1>

          <div className="mb-6 p-4 bg-green-50/70 border border-green-100 rounded-xl text-sm text-gray-800">
            <p className="font-semibold text-green-800 mb-1">
              Póliza #{polizaIdNumber}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Nombre: </span>
              {policy.nombre_poliza}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Aseguradora: </span>
              {policy.nombre_aseguradora}
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-800">
            <div>
              <label className="block font-semibold mb-1">
                Calificación (1 a 5)
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                required
              >
                <option value={5}>5 - Excelente</option>
                <option value={4}>4 - Buena</option>
                <option value={3}>3 - Aceptable</option>
                <option value={2}>2 - Mala</option>
                <option value={1}>1 - Muy mala</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Comentario / Contexto
              </label>
              <textarea
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70 resize-none"
                placeholder="Actualiza tu experiencia con esta póliza..."
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                ¿Tiene cargos ocultos (hidden fees)?
              </label>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hiddenFees"
                    value="no"
                    checked={!tieneHiddenFees}
                    onChange={() => setTieneHiddenFees(false)}
                  />
                  <span>No</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hiddenFees"
                    value="si"
                    checked={tieneHiddenFees}
                    onChange={() => setTieneHiddenFees(true)}
                  />
                  <span>Sí</span>
                </label>
              </div>
            </div>

            {tieneHiddenFees && (
              <div>
                <label className="block font-semibold mb-1">
                  Detalle de los cargos ocultos
                </label>
                <textarea
                  value={detalleHiddenFees}
                  onChange={(e) => setDetalleHiddenFees(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70 resize-none"
                  placeholder="Ej: cargos por emisión, recargos no informados, comisiones extra, etc."
                  required={tieneHiddenFees}
                />
              </div>
            )}

            <div className="pt-4 flex justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate(`/catalog/details/${polizaIdNumber}`, {
                    state: { policy },
                  })
                }
                className="w-1/2 px-4 py-2 rounded-lg border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition"
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
