import jsPDF from "jspdf";

export default function BrokerReports() {
  const stats = [
    { label: "Solicitudes Aprobadas", value: 18, color: "text-green-700" },
    { label: "Solicitudes Rechazadas", value: 5, color: "text-red-600" },
    { label: "Solicitudes Pendientes", value: 7, color: "text-yellow-600" },
  ];

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Reporte del Analista - MiSeguroDigital", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Resumen de solicitudes procesadas:", 20, 35);

    let y = 50;
    stats.forEach((stat) => {
      doc.text(`${stat.label}: ${stat.value}`, 25, y);
      y += 10;
    });

    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 20, y + 10);

    doc.save("reporte_analista.pdf");
  };

  return (
    <div
          className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
"url('https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80')"
          }}
        >   
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">
      <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl">MiSeguroDigital</div>     
      </header>
      <main className="flex-1 flex flex-col justify-center items-center py-10 px-4">
        <div className="max-w-4xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-sm text-center">
          <h1 className="text-4xl font-extrabold text-green-700 mb-6">
            Reportes del Analista
          </h1>
          <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto">
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
              onClick={generarPDF}
              className="!bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition"
            >
              Generar Reporte PDF
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-gray-500 text-sm text-center">
        © 2025 MiSeguroDigital — Panel del Analista.
      </footer>
      </div>
    </div>
  );
}

