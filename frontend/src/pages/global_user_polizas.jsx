import { Link } from "react-router-dom";

const aseguradoras = [
  { id_aseguradora: 1, nombre: "Aseguradora Andina" },
  { id_aseguradora: 2, nombre: "Seguros Pacífico" },
];

const polizas = [
  {
    id_poliza: 500,
    id_aseguradora: 1,
    nombre: "Plan Vida Plus",
    descripcion: "Cobertura integral de vida y accidentes",
    tipo: "Vida",
    pago_mensual: 35.50,
    cobertura_total: 50000,
    duracion_contrato: "12 meses",
  },
  {
    id_poliza: 501,
    id_aseguradora: 1,
    nombre: "Auto Full Protección",
    descripcion: "Cobertura completa contra daños y robos",
    tipo: "Auto",
    pago_mensual: 42.99,
    cobertura_total: 20000,
    duracion_contrato: "6 meses",
  },
  {
    id_poliza: 502,
    id_aseguradora: 2,
    nombre: "Hogar Seguro Premium",
    descripcion: "Protección total para bienes del hogar",
    tipo: "Hogar",
    pago_mensual: 29.00,
    cobertura_total: 15000,
    duracion_contrato: "12 meses",
  },
];

export default function GlobalUserPolizas() {
  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=1650&q=80')",
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">

        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl">MiSeguroDigital</div>
        </header>

        <div className="px-6 mt-6 text-center">
          <h1 className="text-5xl font-extrabold text-green-700 drop-shadow-sm">
            Pólizas Registradas
          </h1>

          <p className="text-gray-700 mt-2 text-lg">
            Lista de todas las <strong>pólizas</strong> registradas en el sistema.
          </p>
        </div>

        <main className="flex-1 flex flex-col justify-start items-center px-6 mt-6">
          <div className="max-w-6xl w-full bg-white/85 rounded-2xl shadow-xl p-10">

            <table className="min-w-full border text-sm rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-green-50 text-green-900">
                <tr>
                  <th className="border px-3 py-2">ID</th>
                  <th className="border px-3 py-2">Nombre</th>
                  <th className="border px-3 py-2">Descripción</th>
                  <th className="border px-3 py-2">Tipo</th>
                  <th className="border px-3 py-2">Pago Mensual</th>
                  <th className="border px-3 py-2">Cobertura Total</th>
                  <th className="border px-3 py-2">Duración</th>
                  <th className="border px-3 py-2">Aseguradora</th>
                  <th className="border px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {polizas.map((p) => {
                  const aseg = aseguradoras.find(a => a.id_aseguradora === p.id_aseguradora);

                  return (
                    <tr key={p.id_poliza} className="odd:bg-gray-50 hover:bg-green-50 transition">
                      <td className="border px-3 py-2 font-medium">{p.id_poliza}</td>
                      <td className="border px-3 py-2">{p.nombre}</td>
                      <td className="border px-3 py-2">{p.descripcion}</td>
                      <td className="border px-3 py-2">{p.tipo}</td>
                      <td className="border px-3 py-2">${p.pago_mensual.toFixed(2)}</td>
                      <td className="border px-3 py-2">${p.cobertura_total.toLocaleString()}</td>
                      <td className="border px-3 py-2">{p.duracion_contrato}</td>
                      <td className="border px-3 py-2">{aseg?.nombre}</td>

                      <td className="border px-3 py-2 text-center space-x-3">

                        <button
                          className="px-3 py-1 !bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-700 transition"
                          onClick={() => alert(`Editar póliza ${p.id_poliza}`)}
                        >
                          Editar
                        </button>

                        <button
                          className="px-3 py-1 !bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                          onClick={() => alert(`Eliminar póliza ${p.id_poliza}`)}
                        >
                          Eliminar
                        </button>

                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

          </div>
        </main>

        <footer className="py-4 text-gray-600 text-sm text-center">
          © 2025 MiSeguroDigital — Global User.
        </footer>

      </div>
    </div>
  );
}
