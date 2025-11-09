export default function BrokerReports() {
  const stats = [
    { label: "Solicitudes Aprobadas", value: 18, color: "text-green-700" },
    { label: "Solicitudes Rechazadas", value: 5, color: "text-red-600" },
    { label: "Solicitudes Pendientes", value: 7, color: "text-yellow-600" },
  ];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-green-50 via-white to-green-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
          Reportes del Analista
        </h1>
        <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto text-center">
          Visualiza el resumen de solicitudes procesadas por los usuarios y su estado actual.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 rounded-2xl shadow-md p-6 text-center backdrop-blur-sm hover:shadow-lg transition"
            >
              <p className={`text-5xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-700 font-medium mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => alert("Generando reporte en PDF...")}
            className="!bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition"
          >
            Generar Reporte PDF
          </button>
        </div>

        <footer className="mt-12 text-gray-500 text-sm text-center">
          © 2025 MiSeguroDigital — Panel del Analista.
        </footer>
      </div>
    </div>
  );
}
