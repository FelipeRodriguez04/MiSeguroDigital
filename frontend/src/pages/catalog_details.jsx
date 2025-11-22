import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";

export default function CatalogDetails() {
  const { id } = useParams();
  console.log("CatalogDetails ID:", id);
  const location = useLocation();
  const policy = location.state?.policy;
  const [reviews, setReviews] = useState([]);
  const [requirements, setRequirements] = useState([]);

  const EstadoPoliza = {
    activa: "Activa",
    pausada: "Pausada",
    despublicada: "Despublicada",
  };

  const TiposPolizas = {
    seguro_automotriz: "Seguro Automotriz",
    seguro_inmobiliario: "Seguro Inmobiliario",
    seguro_de_vida: "Seguro de Vida",
    seguro_de_salud: "Seguro de Salud",
  };

  const HiddenFees = {
    0: "No",
    1: "Sí",
  };

  const TiposRequerimientos = {
    registros_medicos: "Registros Médicos",
    estados_de_cuenta: "Comprobante de Domicilio",
    historial_crediticio: "Historial Crediticio",
    prueba_de_residencia: "Prueba de Residencia",
    otro: "Otro",
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:33761/api/comentarios/obtener-comentarios-poliza/${id}`,
          { method: "GET" }
        );

        const data = await res.json();
        console.log("Reviews fetched:", data);

        if (!res.ok) {
          console.error("Error al obtener comentarios:", data);
          return;
        }
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error de red:", err);
      }
    };

    const fetchRequirements = async () => {
      try {
        const res = await fetch(
          `http://localhost:33761/api/polizas/usuarios/requerimientos-de-poliza/${id}`,
          { method: "GET" }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error("Error al obtener requerimientos:", data);
          return;
        }
        setRequirements(data.data || []);
      } catch (err) {
        console.error("Error de red:", err);
      }
    };

    fetchReviews();
    fetchRequirements();
  }, [id]);

  if (!policy) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-xl">
        Póliza no encontrada.
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
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[10px]"></div>

      <header className="relative flex justify-between items-center px-8 py-4 text-green-700 font-semibold z-10">
        <div className="text-xl">MiSeguroDigital</div>
      </header>

      <main className="relative z-10 flex-1 flex justify-center px-6 py-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-10 max-w-2xl w-full">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-extrabold text-green-700 text-center mb-2">
              {policy.nombre_poliza}
            </h1>

            <p className="text-gray-600 text-center">{policy.descripcion}</p>
          </div>

          <ul className="text-gray-700 text-lg space-y-2 mb-6">
            <li><strong>Tipo:</strong> {TiposPolizas[policy.tipo_poliza]}</li>
            <li><strong>Pago mensual:</strong> ${policy.pago_mensual}</li>
            <li><strong>Monto Cobertura:</strong> ${policy.monto_cobertura}</li>
            <li><strong>Duración del contrato:</strong> {policy.duracion_contrato} meses</li>
            <li><strong>Porcentaje de aprobación:</strong> {policy.porcentaje_aprobacion}%</li>
            <li><strong>Importe por cancelación:</strong> ${policy.importe_cancelacion}</li>
            <li><strong>Aseguradora:</strong> {policy.nombre_aseguradora}</li>
            <li><strong>Estado:</strong> {EstadoPoliza[policy.estado_de_la_poliza]}</li>
          </ul>

          <h2 className="text-2xl font-bold text-green-700 mb-3">Requerimientos</h2>

          {requirements.length === 0 ? (
            <p className="text-gray-500 mb-8">
              Esta póliza no tiene requerimientos específicos registrados.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-green-100 hover:shadow-lg transition"
                >
                  <ul>
                    <li>
                      <strong>Tipo de Requerimiento:</strong>{" "}
                      {TiposRequerimientos[req.tipo_requerimiento]}
                    </li>
                    <li>
                      <strong>Descripción del Requerimiento:</strong>{" "}
                      {req.descripcion_requerimiento}
                    </li>
                    <li>
                      <strong>Obligatorio:</strong>{" "}
                      {req.requerimiento_obligatorio ? "Sí" : "No"}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-2xl font-bold text-green-700 mb-3">Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500 mb-8">
              Esta póliza todavía no tiene reviews. ¡Sé el primero en opinar!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full">
              {reviews.map((rew, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-green-100 hover:shadow-lg transition"
                >
                  <ul>
                    <li><strong>Nombre Usuario:</strong> {rew.full_nombre_usuario}</li>
                    <li><strong>Rating del Usuario:</strong> {rew.rating_del_usuario}/5</li>
                    <li><strong>Contexto:</strong> {rew.contexto_review}</li>
                    <li><strong>Hidden Fees:</strong> {HiddenFees[rew.tiene_hidden_fees]}</li>
                    {rew.tiene_hidden_fees === 1 && (
                      <li><strong>Detalle Hidden Fees:</strong> {rew.detalle_hidden_fees}</li>
                    )}
                    <li>
                      <strong>Fecha:</strong>{" "}
                      {new Date(rew.fecha_creacion_review).toLocaleDateString()}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Link
              to={`/me/apply/${policy.id_poliza}`}
              className="border-2 border-green-600 !text-green-700 hover:bg-green-600 hover:text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-sm"
            >
              Solicitar
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-gray-500 text-sm text-center pb-6 z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
