import { useState } from "react";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [filter, setFilter] = useState("TODAS");

  const policies = [
    {
      id_poliza: 101,
      nombre_de_la_poliza: "Seguro de Vida Familiar",
      tipo_de_poliza: "VIDA",
      pago_mensual: 30,
      duracion_contrato_meses: 12,
      cobertura_base: 100000,
      aseguradora: "Andes Seguros S.A.",
      estado_de_poliza: "ACTIVA",
      requisitos_count: 3,
      image: "https://cdn-icons-png.flaticon.com/512/1048/1048945.png",
    },
    {
      id_poliza: 102,
      nombre_de_la_poliza: "Seguro Vehicular",
      tipo_de_poliza: "AUTO",
      pago_mensual: 45,
      duracion_contrato_meses: 12,
      cobertura_base: 20000,
      aseguradora: "Quito Insurance",
      estado_de_poliza: "ACTIVA",
      requisitos_count: 4,
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    {
      id_poliza: 103,
      nombre_de_la_poliza: "Seguro Médico Integral",
      tipo_de_poliza: "SALUD",
      pago_mensual: 60,
      duracion_contrato_meses: 12,
      cobertura_base: 50000,
      aseguradora: "SaludTotal",
      estado_de_poliza: "ACTIVA",
      requisitos_count: 2,
      image: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
    },
  ];

  // Obtener lista única de aseguradoras
  const aseguradoras = ["TODAS", ...new Set(policies.map((p) => p.aseguradora))];

  // Filtrar
  const filteredPolicies =
    filter === "TODAS"
      ? policies
      : policies.filter((p) => p.aseguradora === filter);

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

      <main className="flex-1 flex flex-col items-center px-6 z-10">
        <h1 className="text-4xl font-extrabold text-green-700 mb-2 mt-8 text-center">
          Catálogo de Pólizas
        </h1>
        <p className="text-gray-600 text-lg mb-6 max-w-2xl text-center">
          Explora y elige la póliza que mejor se adapte a tus necesidades.
        </p>

        {/* 🔍 FILTRO POR ASEGURADORA */}
        <div className="bg-white/70 rounded-xl shadow-md p-4 mb-10 backdrop-blur-sm">
          <label className="block text-green-700 font-semibold mb-2">
            Filtrar por aseguradora
          </label>
          <select
            className="border border-green-400 text-green-700 font-medium rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {aseguradoras.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* GRID DE PÓLIZAS FILTRADAS */}
        <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6">
          {filteredPolicies.map((p) => (
            <article
              key={p.id_poliza}
              className="bg-white/70 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 backdrop-blur-sm w-full max-w-sm"
            >
              <div className="flex flex-col items-center">
                <img
                  src={p.image}
                  alt={p.nombre_de_la_poliza}
                  className="w-24 h-24 mb-4"
                />
                <h2 className="text-2xl font-bold text-green-700 mb-1 text-center">
                  {p.nombre_de_la_poliza}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {p.tipo_de_poliza} • {p.estado_de_poliza}
                </p>
              </div>

              <ul className="text-gray-700 space-y-1 mb-4 text-center">
                <li>
                  <span className="font-semibold">Aseguradora:</span>{" "}
                  {p.aseguradora}
                </li>
                <li>
                  <span className="font-semibold">Cobertura base:</span> $
                  {p.cobertura_base.toLocaleString()}
                </li>
                <li>
                  <span className="font-semibold">Pago mensual:</span> $
                  {p.pago_mensual}/mes
                </li>
                <li>
                  <span className="font-semibold">Duración:</span>{" "}
                  {p.duracion_contrato_meses} meses
                </li>
                <li>
                  <span className="font-semibold">Requisitos:</span>{" "}
                  {p.requisitos_count} documentos
                </li>
              </ul>

              <div className="flex items-center justify-between">
                <Link
                  to={`/catalog/details/${p.id_poliza}`}
                  className="underline !text-green-700 hover:!text-green-800"
                >
                  Ver detalles
                </Link>

                <Link
                  to={`/me/apply/${p.id_poliza}`}
                  className="inline-block no-underline border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-6 py-2 rounded-lg text-base font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Solicitar
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="mt-12 text-gray-500 text-sm text-center z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}