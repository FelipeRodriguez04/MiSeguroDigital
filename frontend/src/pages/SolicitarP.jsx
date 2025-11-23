import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";

export default function SolicitarP() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");
  const policy = location.state?.policy || location.state; 

  const [bienes, setBienes] = useState([]);
  const [bienSeleccionado, setBienSeleccionado] = useState("");
  const [loadingBienes, setLoadingBienes] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const polizaIdNumber = Number(id);

  const TipoBien = {
    bien_inmueble: "Bien inmueble",
    bien_automotriz: "Bien automotriz",
    otro: "Otro",
  };

    const TiposPolizas = {
    seguro_automotriz: "Seguro Automotriz",
    seguro_inmobiliario: "Seguro Inmobiliario",
    seguro_de_vida: "Seguro de Vida",
    seguro_de_salud: "Seguro de Salud",
  };

  useEffect(() => {
    const fetchBienes = async () => {
      if (!userId) {
        setError("No se encontró el usuario en la sesión.");
        setLoadingBienes(false);
        return;
      }

      try {
        setLoadingBienes(true);
        setError("");

        const resp = await fetch(
          `http://localhost:33761/api/bienes/usuario/bienes-registrados/${userId}`
        );
        const data = await resp.json();

        if (!resp.ok) {
          console.error("Error al obtener bienes registrados:", data);
          if (resp.status !== 404) {
            setError(
              data.message || "Error al obtener los bienes registrados."
            );
          } else {
            setBienes([]);
          }
        } else {
          setBienes(data.data || []);
        }
      } catch (err) {
        console.error("Error de red al obtener bienes:", err);
        setError("Error de conexión con el servidor.");
      } finally {
        setLoadingBienes(false);
      }
    };

    fetchBienes();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("No se encontró el usuario en la sesión.");
      return;
    }

    if (!polizaIdNumber || polizaIdNumber <= 0) {
      setError("No se encontró un ID de póliza válido.");
      return;
    }

    if (!bienSeleccionado) {
      setError("Debes seleccionar un bien para asegurar.");
      return;
    }

    const payload = {
      usuarioId: Number(userId),
      polizaId: Number(polizaIdNumber),
      bienId: Number(bienSeleccionado),
    };

    console.log("Payload de solicitud:", payload);

    try {
      setSaving(true);

      const resp = await fetch(
        "http://localhost:33761/api/aplicaciones/usuarios/crear-aplicacion-a-poliza",
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
        alert("Solicitud registrada correctamente.");
        navigate("/me/applications");
      } else {
        setError("No se pudo crear la aplicación. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error al crear aplicación:", err);
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
        <div className="max-w-3xl w-full bg-white/85 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-green-100">
          <h1 className="text-3xl font-extrabold text-green-700 mb-4 text-center">
            Solicitar póliza
          </h1>

          <div className="mb-6 p-4 bg-green-50/70 border border-green-100 rounded-xl text-sm text-gray-800">
            <p className="font-semibold text-green-800 mb-1">
              Póliza #{polizaIdNumber}
            </p>
            {policy ? (
              <>
                <p className="mb-1">
                  <span className="font-semibold">Nombre: </span>
                  {policy.nombre_poliza}
                </p>
                {policy.nombre_aseguradora && (
                  <p className="mb-1">
                    <span className="font-semibold">Aseguradora: </span>
                    {policy.nombre_aseguradora}
                  </p>
                )}
                {policy.tipo_poliza && (
                  <p className="mb-1">
                    <span className="font-semibold">Tipo de póliza: </span>
                    {TiposPolizas[policy.tipo_poliza]}
                  </p>
                )}
                {policy.pago_mensual && (
                  <p className="mb-1">
                    <span className="font-semibold">Pago mensual: </span>
                    ${policy.pago_mensual}
                  </p>
                )}
              </>
            ) : (
              <p className="italic text-gray-600">
                No se recibió el detalle completo de la póliza, pero puedes
                continuar con la solicitud.
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          {loadingBienes ? (
            <div className="text-center text-gray-600 py-6">
              Cargando tus bienes registrados...
            </div>
          ) : bienes.length === 0 ? (
            <div className="text-center text-gray-700 py-6">
              No tienes bienes registrados aún.
              <div className="mt-3">
                <Link
                  to="/me/bienes"
                  className="inline-block no-underline border-2 !border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  Ir a registrar bienes
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-sm text-gray-800"
            >
              <div>
                <label className="block font-semibold mb-1">
                  Selecciona el bien que deseas asegurar
                </label>
                <select
                  value={bienSeleccionado}
                  onChange={(e) => setBienSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
                  required
                >
                  <option value="">Selecciona un bien</option>
                  {bienes.map((b) => (
                    <option key={b.id_bien} value={b.id_bien}>
                      {TipoBien[b.tipo_de_bien] || b.tipo_de_bien} — $
                      {b.valoracion_bien} (ID: {b.id_bien})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/catalog")}
                  className="w-1/2 px-4 py-2 rounded-lg !border !border-green-600 !text-green-700 font-semibold hover:!bg-green-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 px-4 py-2 rounded-lg !bg-green-700 hover:bg-green-800 !text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Enviando solicitud..." : "Confirmar solicitud"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="relative py-6 text-gray-600 text-sm text-center z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
