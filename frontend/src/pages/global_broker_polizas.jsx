import React from "react";
import { Link } from "react-router-dom";

const aseguradoras = [
  { id_aseguradora: 1, nombre: "Aseguradora Andina" },
  { id_aseguradora: 2, nombre: "Seguros Pacífico" },
];

const polizas = [
  {
    id_poliza: 100,
    id_aseguradora: 1,
    nombre: "Vida Protegida Plus",
    descripcion: "Cobertura de vida completa con beneficios adicionales por invalidez.",
    tipo: "Vida",
    pago_mensual: 45.5,
    cobertura_total: 50000,
    duracion_contrato: "10 años",
  },
  {
    id_poliza: 101,
    id_aseguradora: 1,
    nombre: "Auto Seguro Total",
    descripcion: "Cobertura contra todo riesgo para vehículos particulares.",
    tipo: "Auto",
    pago_mensual: 60.0,
    cobertura_total: 20000,
    duracion_contrato: "1 año",
  },
  {
    id_poliza: 102,
    id_aseguradora: 2,
    nombre: "Hogar Seguro Premium",
    descripcion: "Protección integral para vivienda ante incendios, robos e inundaciones.",
    tipo: "Hogar",
    pago_mensual: 35.75,
    cobertura_total: 80000,
    duracion_contrato: "5 años",
  },
];

export default function GlobalBrokerPolizas() {
  const idAsegLocal = localStorage.getItem("id_aseguradora");
  const idAseguradora = idAsegLocal ? parseInt(idAsegLocal, 10) : null;

  const aseguradoraActual =
    aseguradoras.find((a) => a.id_aseguradora === idAseguradora) || {
      nombre: "Tu Aseguradora",
    };

  const polizasFiltradas = polizas.filter((p) =>
    idAseguradora ? p.id_aseguradora === idAseguradora : true
  );

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">
        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl">MiSeguroDigital</div>
        </header>

        <div className="px-6 mt-6 text-center">
          <h1 className="text-4xl font-extrabold text-green-700 drop-shadow-sm">
            Pólizas de la Aseguradora
          </h1>
          <p className="text-gray-700 mt-2 text-lg">
            Aseguradora:{" "}
            <span className="font-semibold">{aseguradoraActual.nombre}</span>
          </p>
        </div>

        <main className="flex-1 flex flex-col justify-start items-center px-6 mt-6 mb-6">
          <div className="max-w-5xl w-full bg-white/85 rounded-2xl shadow-xl p-10">
            <table className="min-w-full border text-sm rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-green-50 text-green-900">
                <tr>
                  <th className="border px-3 py-2">ID</th>
                  <th className="border px-3 py-2">Nombre</th>
                  <th className="border px-3 py-2">Descripción</th>
                  <th className="border px-3 py-2">Tipo</th>
                  <th className="border px-3 py-2">Pago mensual</th>
                  <th className="border px-3 py-2">Cobertura total</th>
                  <th className="border px-3 py-2">Duración</th>
                  <th className="border px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {polizasFiltradas.map((p) => (
                  <tr
                    key={p.id_poliza}
                    className="odd:bg-gray-50 hover:bg-green-50 transition"
                  >
                    <td className="border px-3 py-2 font-medium">
                      {p.id_poliza}
                    </td>
                    <td className="border px-3 py-2">{p.nombre}</td>
                    <td className="border px-3 py-2">{p.descripcion}</td>
                    <td className="border px-3 py-2">{p.tipo}</td>
                    <td className="border px-3 py-2">
                      ${p.pago_mensual.toFixed(2)}
                    </td>
                    <td className="border px-3 py-2">
                      ${p.cobertura_total.toLocaleString("es-EC")}
                    </td>
                    <td className="border px-3 py-2">{p.duracion_contrato}</td>

                    <td className="border px-3 py-2 text-center space-x-3">
                      <button
                        className="px-3 py-1 !bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600 transition"
                        onClick={() =>
                          alert(`Editar póliza ${p.id_poliza}`)
                        }
                      >
                        Editar
                      </button>

                      <button
                        className="px-3 py-1 !bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                        onClick={() =>
                          alert(`Eliminar póliza ${p.id_poliza}`)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {polizasFiltradas.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="border px-3 py-4 text-center text-gray-600"
                    >
                      No hay pólizas registradas para esta aseguradora.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>

        <footer className="py-4 text-gray-600 text-sm text-center">
          © 2025 MiSeguroDigital — Global Broker.
        </footer>
      </div>
    </div>
  );
}
