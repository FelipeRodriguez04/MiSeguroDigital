import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [companyFilter, setCompanyFilter] = useState("TODAS");
  const [typeFilter, setTypeFilter] = useState("TODOS");
  const [nameFilter, setNameFilter] = useState("TODOS");
  const [policies, setPolicies] = useState([]);

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

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch(
          "http://localhost:33761/api/polizas/catalogo-completo",
          { method: "GET" }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error("Error al obtener pólizas:", data);
          return;
        }

        setPolicies(data.polizas || []);
      } catch (err) {
        console.error("Error de red:", err);
      }
    };

    fetchPolicies();
  }, []);

  const aseguradoras = [
    "TODAS",
    ...new Set(policies.map((p) => p.nombre_aseguradora)),
  ];

  const tipos = ["TODOS", ...Object.keys(TiposPolizas)];

  const nombres = [
    "TODOS",
    ...new Set(policies.map((p) => p.nombre_poliza)),
  ];

  const filteredPolicies = policies.filter((p) => {
    const matchCompany =
      companyFilter === "TODAS" || p.nombre_aseguradora === companyFilter;

    const matchType =
      typeFilter === "TODOS" || p.tipo_poliza === typeFilter;

    const matchName =
      nameFilter === "TODOS" || p.nombre_poliza === nameFilter;

    return matchCompany && matchType && matchName;
  });

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

        <div className="bg-white/70 rounded-xl shadow-md p-4 mb-10 backdrop-blur-sm w-full max-w-5xl grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-green-700 font-semibold mb-2">
              Aseguradora
            </label>
            <select
              className="w-full border border-green-400 text-green-700 font-medium rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              {aseguradoras.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-green-700 font-semibold mb-2">
              Tipo de póliza
            </label>
            <select
              className="w-full border border-green-400 text-green-700 font-medium rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {t === "TODOS" ? "TODOS" : TiposPolizas[t]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-green-700 font-semibold mb-2">
              Nombre de póliza
            </label>
            <select
              className="w-full border border-green-400 text-green-700 font-medium rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            >
              {nombres.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6">
          {filteredPolicies.map((p) => (
            <article
              key={p.id_poliza}
              className="bg-white/70 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 backdrop-blur-sm w-full max-w-sm"
            >
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-green-700 mb-1 text-center">
                  {p.nombre_poliza}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {TiposPolizas[p.tipo_poliza]} •{" "}
                  {EstadoPoliza[p.estado_de_la_poliza]}
                </p>
              </div>

              <ul className="text-gray-700 space-y-1 mb-4 text-center">
                <li>
                  <span className="font-semibold">Aseguradora:</span>{" "}
                  {p.nombre_aseguradora}
                </li>
                <li>
                  <span className="font-semibold">Cobertura base:</span> $
                  {p.monto_cobertura?.toLocaleString()}
                </li>
                <li>
                  <span className="font-semibold">Pago mensual:</span> $
                  {p.pago_mensual?.toLocaleString()}/mes
                </li>
                <li>
                  <span className="font-semibold">Duración:</span>{" "}
                  {p.duracion_contrato} meses
                </li>
              </ul>

              <div className="flex items-center justify-between">
                <Link
                  to={`/catalog/details/${p.id_poliza}`}
                  state={{ policy: p }}
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
