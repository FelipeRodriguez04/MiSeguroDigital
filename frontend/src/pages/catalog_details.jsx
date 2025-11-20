import { useParams, Link } from "react-router-dom";

export default function CatalogDetails() {
  const { id } = useParams();

  const policies = [
    {
      id_poliza: 101,
      nombre_de_la_poliza: "Seguro de Vida Familiar",
      descripcion: "Protección completa para tu familia en caso de fallecimiento.",
      tipo_de_poliza: "VIDA",
      pago_mensual: 30,
      duracion_contrato_meses: 12,
      estado_de_poliza: "ACTIVA",
      importe_cancelacion: 150,
      image: "https://cdn-icons-png.flaticon.com/512/1048/1048945.png",
      requerimientos: [
        "Cédula de identidad",
        "Declaración de salud",
        "Formulario de solicitud firmado",
      ],
    },
    {
      id_poliza: 102,
      nombre_de_la_poliza: "Seguro Vehicular",
      descripcion: "Cobertura completa contra daños, robo y accidentes.",
      tipo_de_poliza: "AUTO",
      pago_mensual: 45,
      duracion_contrato_meses: 12,
      estado_de_poliza: "ACTIVA",
      importe_cancelacion: 200,
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      requerimientos: [
        "Cédula de identidad",
        "Matrícula del vehículo",
        "Fotos del vehículo (frontal, posterior y costados)",
      ],
    },
    {
      id_poliza: 103,
      nombre_de_la_poliza: "Seguro Médico Integral",
      descripcion: "Cobertura médica completa para emergencias y consultas.",
      tipo_de_poliza: "SALUD",
      pago_mensual: 60,
      duracion_contrato_meses: 12,
      estado_de_poliza: "ACTIVA",
      importe_cancelacion: 180,
      image: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
      requerimientos: [
        "Cédula de identidad",
        "Historial médico básico",
        "Formulario de solicitud firmado",
      ],
    },
  ];

  const policy = policies.find((p) => p.id_poliza === Number(id));

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
            <img src={policy.image} alt={policy.nombre_de_la_poliza} className="w-28 h-28 mb-4" />

            <h1 className="text-3xl font-extrabold text-green-700 text-center mb-2">
              {policy.nombre_de_la_poliza}
            </h1>

            <p className="text-gray-600 text-center">{policy.descripcion}</p>
          </div>

          <ul className="text-gray-700 text-lg space-y-2 mb-6">
            <li><strong>Tipo:</strong> {policy.tipo_de_poliza}</li>
            <li><strong>Pago mensual:</strong> ${policy.pago_mensual}</li>
            <li><strong>Estado:</strong> {policy.estado_de_poliza}</li>
            <li><strong>Duración del contrato:</strong> {policy.duracion_contrato_meses} meses</li>
            <li><strong>Importe por cancelación:</strong> ${policy.importe_cancelacion}</li>
          </ul>

          {/* ---------------------- REQUERIMIENTOS ---------------------- */}

          <h2 className="text-2xl font-bold text-green-700 mb-3">Requerimientos</h2>

          <ul className="text-gray-700 space-y-2 mb-8">
            {policy.requerimientos.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-center mt-6">
            <Link
              to={`/me/apply/${policy.id_poliza}`}
              className="border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-sm"
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
