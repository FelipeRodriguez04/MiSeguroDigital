import { useEffect, useState } from "react";
import jsPDF from "jspdf";

const API_BASE = "http://localhost:33761/api/reportes"; 

export default function BrokerReports() {
  const [solicitudes, setSolicitudes] = useState([]);   
  const [estadisticas, setEstadisticas] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const Estado={
    pendiente_procesar: 'Pendiente de procesar',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
  };

  const EstadoPoliza={
    activa: 'Activa',
    pausada: 'Pausada',
    despublicada: 'Despublicada',
  };

  useEffect(() => {
    const idAseguradora =
      localStorage.getItem("id_aseguradora") ||
      localStorage.getItem("idAseguradora");

      console.log("ID Aseguradora obtenido:", idAseguradora);

    if (!idAseguradora) {
      setError(
        "No se encontró el ID de la aseguradora. Verifica el login o el localStorage."
      );
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [resSolicitudes, resEstadisticas] = await Promise.all([
          fetch(
            `${API_BASE}/broker/reporte-solicitudes-totales/${idAseguradora}`
          ),
          fetch(`${API_BASE}/broker/estadistica-solicitudes-por-poliza`),
        ]);

        const dataSolicitudes = await resSolicitudes.json();
        const dataEstadisticas = await resEstadisticas.json();

        if (resSolicitudes.ok && dataSolicitudes.success) {
          setSolicitudes(dataSolicitudes.data || []);
        } else {
          setSolicitudes([]);
        }

        if (resEstadisticas.ok && dataEstadisticas.success) {
          setEstadisticas(dataEstadisticas.data || []);
        } else {
          setEstadisticas([]);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error al cargar la información de los reportes.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generarPDFSolicitudes = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Reporte de Solicitudes Totales por Aseguradora", 15, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    solicitudes.forEach((s) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(
        `ID Aplicación: ${s.id_aplicacion_poliza} | Fecha: ${new Date(
          s.fecha_de_aplicacion
        ).toLocaleString()}`,
        15,
        y
      );
      y += 5;
      doc.text(
        `Usuario: ${s.full_nombre_usuario} (${s.correo_registro}) Tel: ${
          s.numero_telefono_usuario || "-"
        }`,
        15,
        y
      );
      y += 5;
      doc.text(
        `Póliza: ${s.nombre_de_la_poliza} | Estado: ${Estado[s.estado_actual_aplicacion]} | Docs: ${
          s.cantidad_documentos ?? 0
        }`,
        15,
        y
      );
      y += 8;
    });

    doc.text(
      `Fecha de generación: ${new Date().toLocaleString()}`,
      15,
      y + 5
    );

    doc.save("reporte_solicitudes_totales.pdf");
  };

  const generarPDFEstadisticas = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Reporte de Estadísticas de Solicitudes por Póliza", 15, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    estadisticas.forEach((r) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(
        `Aseguradora: ${r.nombre_aseguradora} (ID: ${r.id_aseguradora})`,
        15,
        y
      );
      y += 5;
      doc.text(
        `Póliza: ${r.nombre_de_la_poliza} | Estado: ${EstadoPoliza[r.estado_de_poliza]}`,
        15,
        y
      );
      y += 5;
      doc.text(
        `Total aplicaciones: ${r.total_aplicaciones} | Pendientes: ${
          r.aplicaciones_pendientes
        } | Aprobadas: ${
          r.aprobadas ?? "-"
        } | Rechazadas: ${r.aplicaciones_rechazadas}`,
        15,
        y
      );
      y += 8;
    });

    doc.text(
      `Fecha de generación: ${new Date().toLocaleString()}`,
      15,
      y + 5
    );

    doc.save("reporte_estadisticas_polizas.pdf");
  };

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-white/25 backdrop-blur-[12px]"></div>

      <header className="relative flex justify-between items-center px-8 py-4 text-green-700 font-semibold z-10">
        <div className="text-xl">MiSeguroDigital</div>
        <button
          className="text-red-600 hover:text-red-700 transition flex items-center gap-2"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          title="Cerrar sesión"
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
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          Cerrar sesión
        </button>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
        <div className="max-w-5xl w-full bg-white/85 rounded-2xl shadow-xl p-8 sm:p-10 backdrop-blur-md mx-4 border border-green-100">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-4">
            Reportes del Broker
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-6">
            Consulta la información de solicitudes y estadísticas directamente desde los reportes del sistema.
          </p>

          {loading && (
            <p className="text-gray-600 text-base mb-4">
              Cargando información de reportes...
            </p>
          )}

          {error && !loading && (
            <p className="text-red-600 text-base mb-4">{error}</p>
          )}

          {!loading && !error && (
            <>
              <section className="mb-10 text-left">
                <div className="flex items-center justify-between mb-4 gap-4">
                  <h2 className="text-2xl font-bold text-green-700">
                    Reporte de solicitudes totales por aseguradora
                  </h2>
                  <button
                    onClick={generarPDFSolicitudes}
                    className="!bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md text-sm"
                  >
                    Descargar PDF solicitudes
                  </button>
                </div>

                {solicitudes.length === 0 ? (
                  <p className="text-gray-600 text-sm">
                    No se encontraron solicitudes para esta aseguradora.
                  </p>
                ) : (
                  <div className="overflow-x-auto max-h-[280px] border rounded-xl bg-white/90">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            ID
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Fecha
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Usuario
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Póliza
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Estado
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Docs
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {solicitudes.map((s) => (
                          <tr
                            key={s.id_aplicacion_poliza}
                            className="border-t hover:bg-green-50/60"
                          >
                            <td className="px-3 py-2">
                              {s.id_aplicacion_poliza}
                            </td>
                            <td className="px-3 py-2">
                              {new Date(
                                s.fecha_de_aplicacion
                              ).toLocaleString()}
                            </td>
                            <td className="px-3 py-2">
                              {s.full_nombre_usuario}
                              <div className="text-[11px] text-gray-500">
                                {s.correo_registro}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="font-medium">
                                {s.nombre_de_la_poliza}
                              </div>
                              <div className="text-[11px] text-gray-500">
                                {s.nombre_aseguradora}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              {Estado[s.estado_actual_aplicacion]}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {s.cantidad_documentos ?? 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section className="text-left">
                <div className="flex items-center justify-between mb-4 gap-4">
                  <h2 className="text-2xl font-bold text-green-700">
                    Estadísticas de solicitudes por póliza
                  </h2>
                  <button
                    onClick={generarPDFEstadisticas}
                    className="!bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md text-sm"
                  >
                    Descargar PDF estadísticas
                  </button>
                </div>

                {estadisticas.length === 0 ? (
                  <p className="text-gray-600 text-sm">
                    No se encontraron estadísticas disponibles.
                  </p>
                ) : (
                  <div className="overflow-x-auto max-h-[280px] border rounded-xl bg-white/90">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Aseguradora
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Póliza
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Estado
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Total
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Pendientes
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Aprobadas 
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            Rechazadas
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {estadisticas.map((r, idx) => (
                          <tr
                            key={idx}
                            className="border-t hover:bg-green-50/60"
                          >
                            <td className="px-3 py-2">
                              <div className="font-medium">
                                {r.nombre_aseguradora}
                              </div>
                              <div className="text-[11px] text-gray-500">
                                ID: {r.id_aseguradora}
                              </div>
                            </td>
                            <td className="px-3 py-2">{r.nombre_de_la_poliza}</td>
                            <td className="px-3 py-2">{EstadoPoliza[r.estado_de_poliza]}</td>
                            <td className="px-3 py-2">
                              {r.total_aplicaciones}
                            </td>
                            <td className="px-3 py-2">
                              {r.aplicaciones_pendientes}
                            </td>
                            <td className="px-3 py-2">
                              {r.aprobadas}
                            </td>
                            <td className="px-3 py-2">
                              {r.aplicaciones_rechazadas}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        <footer className="mt-10 text-gray-600 text-sm">
          © 2025 MiSeguroDigital — Panel del Broker.
        </footer>
      </main>
    </div>
  );
}
