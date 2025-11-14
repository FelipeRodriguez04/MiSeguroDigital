import { useState, useMemo } from "react";

const INITIAL = [
  {
    id_version_poliza: 1,
    id_poliza: 101,
    numero_version: 1,
    nombre_poliza: "Auto Básico",
    descripcion_poliza: "Cobertura contra accidentes y daños a terceros.",
    pago_mensual: 20.5,
    monto_cobertura_total: 10000.0,
    duracion_contrato: 12,
    cambios_por_broker_id: 501,
    fecha_modificacion: "2025-11-02T15:30:00Z",
  },
  {
    id_version_poliza: 2,
    id_poliza: 101,
    numero_version: 2,
    nombre_poliza: "Auto Básico",
    descripcion_poliza: "Se ajusta deducible y cobertura de llantas.",
    pago_mensual: 22.0,
    monto_cobertura_total: 12000.0,
    duracion_contrato: 12,
    cambios_por_broker_id: 501,
    fecha_modificacion: "2025-11-10T09:10:00Z",
  },
  {
    id_version_poliza: 3,
    id_poliza: 202,
    numero_version: 1,
    nombre_poliza: "Salud Plus",
    descripcion_poliza: "Plan de salud integral con maternidad.",
    pago_mensual: 35.0,
    monto_cobertura_total: 25000.0,
    duracion_contrato: 12,
    cambios_por_broker_id: 502,
    fecha_modificacion: "2025-11-11T08:40:00Z",
  },
];


export default function BrokerVersioning() {
  const [versiones, setVersiones] = useState(INITIAL);
  const [q, setQ] = useState("");

  const filtradas = useMemo(() => {
    return versiones.filter((v) => {
      const text = `${v.nombre_poliza} ${v.descripcion_poliza} ${v.numero_version} ${v.cambios_por_broker_id}`.toLowerCase();
      return text.includes(q.toLowerCase());
    });
  }, [q, versiones]);

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
        <div>
          <h1 className="text-3xl font-extrabold text-green-700 text-center">Versionamiento de Pólizas</h1>
        </div>
        <section className="flex justify-center items-center px-8 mt-8">
        <input
            type="text"
            placeholder="Buscar por nombre, descripción, versión o broker…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full md:w-1/2 border-2 border-green-700 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-green-300"
        />
        </section>

      <section className="px-8 mt-6">
        <div className="overflow-x-auto bg-white rounded-2xl shadow border">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 text-green-700">
              <tr>
                <th className="text-left px-4 py-3">ID Versión</th>
                <th className="text-left px-4 py-3">ID Póliza</th>
                <th className="text-left px-4 py-3">N° Versión</th>
                <th className="text-left px-4 py-3">Nombre de Póliza</th>
                <th className="text-left px-4 py-3">Descripción</th>
                <th className="text-left px-4 py-3">Pago Mensual</th>
                <th className="text-left px-4 py-3">Cobertura Total</th>
                <th className="text-left px-4 py-3">Duración (meses)</th>
                <th className="text-left px-4 py-3">Broker ID</th>
                <th className="text-left px-4 py-3">Fecha Modificación</th>
              </tr>
            </thead>

            <tbody>
              {filtradas.map((v) => (
                <tr key={v.id_version_poliza} className="border-t hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono">{v.id_version_poliza}</td>
                  <td className="px-4 py-3 font-mono">{v.id_poliza}</td>
                  <td className="px-4 py-3 font-mono">{v.numero_version}</td>
                  <td className="px-4 py-3">{v.nombre_poliza}</td>
                  <td className="px-4 py-3 max-w-[300px] text-slate-700 line-clamp-2">
                    {v.descripcion_poliza}
                  </td>
                  <td className="px-4 py-3">${v.pago_mensual.toFixed(2)}</td>
                  <td className="px-4 py-3">${v.monto_cobertura_total.toFixed(2)}</td>
                  <td className="px-4 py-3">{v.duracion_contrato}</td>
                  <td className="px-4 py-3">#{v.cambios_por_broker_id}</td>
                  <td className="px-4 py-3">{formatDate(v.fecha_modificacion)}</td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-slate-500">
                    No se encontraron versiones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="py-6 text-center text-slate-500 text-sm">
        © 2025 MiSeguroDigital — Versionamiento.
      </footer>
      </div>
    </div>
  );
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
