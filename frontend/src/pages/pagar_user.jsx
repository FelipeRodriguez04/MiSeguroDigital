import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


export default function PagarPolizas() {
  const [polizasAceptadas, setPolizasAceptadas] = useState([]);

  const TiposPolizas = {
    seguro_automotriz: "Seguro Automotriz",
    seguro_inmobiliario: "Seguro Inmobiliario",
    seguro_de_vida: "Seguro de Vida",
    seguro_de_salud: "Seguro de Salud",
  };

useEffect(() => {
  const fetchPolizas = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const resp = await fetch(
        `http://localhost:33761/api/aplicaciones/usuarios/aplicaciones-aceptadas-usuario/${userId}`
      );
      const data = await resp.json();
      const lista = data.data;

      if (!resp.ok) {
        console.error("Error al obtener pólizas aceptadas:", lista.message);
        return;
      }

      const detallesPromises = lista.map((poliza) => {
        return fetch(
          `http://localhost:33761/api/aplicaciones/usuarios/obtener-detalles-aplicacion/${poliza.id_poliza}/${userId}`
        ).then((res) => res.json());
      });

      const detallesPlano = await Promise.all(detallesPromises);

      const combinado = lista.map((poliza, index) => {
        const detalle = Array.isArray(detallesPlano[index])
          ? detallesPlano[index][0]
          : detallesPlano[index];

        return {
          ...poliza,
          detalle,
        };
      });

      setPolizasAceptadas(combinado);
    } catch (error) {
      console.error("Error de red al obtener pólizas aceptadas:", error);
    }
  };

  fetchPolizas();
}, []);

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

        <div className="flex items-center gap-6">

          <Link
            to="/usuario"
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
            Volver
          </Link>
          <button
            className="text-red-600 hover:text-red-700 transition flex items-center gap-2"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            title="Cerrar sesión"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
        <div className="max-w-4xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-green-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-2 text-center md:text-left">
            Pagar pólizas aceptadas y hacer reviews de ellas
          </h1>
          <p className="text-gray-700 text-sm md:text-base mb-6 text-center md:text-left">
            Aquí puedes ver todas tus pólizas{" "}
            <span className="font-semibold">aceptadas</span>, hacer reviews de ellas y realizar el pago con un clic.
          </p>

          {polizasAceptadas.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              No tienes pólizas aceptadas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-green-100 bg-green-50/60">
                    <th className="px-4 py-3 text-left font-semibold text-green-800">N° Registro</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800">N° Póliza</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800">Nombre</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800">Aseguradora</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800">Tipo de póliza</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800">Pago mensual</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800">Fecha de aplicación</th>
                    <th className="px-4 py-3 text-center font-semibold text-green-800">Acción</th>
                  </tr>
                </thead>

                <tbody className="bg-white/60">
                  {polizasAceptadas.map((poliza) => (
                    <tr
                      key={poliza.id_solicitud}
                      className="border-b border-green-100 hover:bg-green-50/60 transition"
                    >
                      <td className="px-4 py-3 text-gray-800">{poliza.id_registro_en_poliza}</td>
                      <td className="px-4 py-3 text-gray-800">{poliza.id_poliza}</td>
                      <td className="px-4 py-3 text-gray-800">{poliza.nombre_de_la_poliza}</td>
                      <td className="px-4 py-3 text-gray-700">{poliza.nombre_aseguradora}</td>
                      <td className="px-4 py-3 text-gray-700">{TiposPolizas[poliza.tipo_de_poliza]}</td>
                      <td className="px-4 py-3 text-gray-800 font-semibold">
                        ${poliza.detalle.pago_mensual_de_la_poliza} 
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                         {poliza.fecha_de_aplicacion}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col md:flex-row gap-2 justify-center text-center items-center">
                          <Link
                            to={`/crear_review/${poliza.id_poliza}`}
                            state={poliza}
                            className="border-2 border-green-600 !text-green-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm text-xs md:text-sm"
                          >
                            Crear Review
                          </Link>

                          <Link
                            to={`/me/pagar_polizas/${poliza.id_poliza}`}
                            state={{ poliza }}
                            className="border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                          >
                            Pagar
                          </Link>

                          <Link
                            to={`/me/historial_pagos/${poliza.id_registro_en_poliza}`}
                            state={{ poliza }}
                            className="border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                          >
                            Historial de Pagos
                          </Link>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="relative py-6 text-gray-600 text-sm text-center z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
