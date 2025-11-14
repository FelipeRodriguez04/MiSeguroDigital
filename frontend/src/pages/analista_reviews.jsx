import { useState, useMemo } from "react";

const INITIAL_REVIEWS = [
  {
    id_review: 1,
    id_poliza: 101,
    id_usuario: "user@example.com",
    rating: 5,
    contexto: "Excelente atención y respuesta rápida del seguro.",
    fecha_creacion: "2025-10-22T10:15:00Z",
    tiene_hidden_fees: false,
    detalle_hidden_fees: "",
  },
  {
    id_review: 2,
    id_poliza: 102,
    id_usuario: "ana@example.com",
    rating: 3,
    contexto: "Buena cobertura, pero el proceso de aprobación fue lento.",
    fecha_creacion: "2025-10-25T14:00:00Z",
    tiene_hidden_fees: true,
    detalle_hidden_fees: "Se cobraron cargos adicionales por mantenimiento anual.",
  },
  {
    id_review: 3,
    id_poliza: 103,
    id_usuario: "pedro@example.com",
    rating: 4,
    contexto: "Satisfecho en general, pero la app podría ser más intuitiva.",
    fecha_creacion: "2025-11-01T09:30:00Z",
    tiene_hidden_fees: false,
    detalle_hidden_fees: "",
  },
  {
    id_review: 4,
    id_poliza: 104,
    id_usuario: "sofia@example.com",
    rating: 2,
    contexto: "No informaron bien sobre las exclusiones del contrato.",
    fecha_creacion: "2025-11-10T12:45:00Z",
    tiene_hidden_fees: true,
    detalle_hidden_fees: "Costo oculto por renovación automática.",
  },
];

export default function BrokerReviews() {
  const [q, setQ] = useState("");
  const [reviews] = useState(INITIAL_REVIEWS);

  const filtradas = useMemo(() => {
    return reviews.filter((r) => {
      const text = `${r.id_poliza} ${r.id_usuario} ${r.contexto}`.toLowerCase();
      return text.includes(q.toLowerCase());
    });
  }, [q, reviews]);

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
        <div>
            <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center mt-10">
              Reviews de Pólizas por Usuarios
            </h1>
        </div>
      <main className="px-8 pb-10">
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Buscar por usuario, póliza o contexto..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full md:w-1/2 border-2 border-green-700 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-green-300"
          />
        </div>

        <div className="overflow-x-auto bg-white/90 rounded-2xl shadow border border-green-100">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 text-green-700">
              <tr>
                <th className="text-left px-4 py-3">ID Review</th>
                <th className="text-left px-4 py-3">ID Póliza</th>
                <th className="text-left px-4 py-3">Usuario</th>
                <th className="text-left px-4 py-3">Rating</th>
                <th className="text-left px-4 py-3">Contexto</th>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="text-left px-4 py-3">Hidden Fees</th>
                <th className="text-left px-4 py-3">Detalle</th>
              </tr>
            </thead>

            <tbody>
              {filtradas.map((r) => (
                <tr key={r.id_review} className="border-t hover:bg-green-50/40 transition">
                  <td className="px-4 py-3 font-mono text-gray-600">{r.id_review}</td>
                  <td className="px-4 py-3 font-mono text-gray-600">{r.id_poliza}</td>
                  <td className="px-4 py-3 text-gray-700">{r.id_usuario}</td>

                  <td className="px-4 py-3 font-bold">
                    <span
                      className={
                        r.rating >= 4
                          ? "text-green-600"
                          : r.rating === 3
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {r.rating} / 5
                    </span>
                  </td>

                  <td className="px-4 py-3 max-w-[300px] text-gray-700">
                    {r.contexto}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(r.fecha_creacion).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    {r.tiene_hidden_fees ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Sí
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        No
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {r.detalle_hidden_fees || "-"}
                  </td>
                </tr>
              ))}

              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No se encontraron reviews.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="py-6 text-gray-500 text-sm text-center">
        © 2025 MiSeguroDigital — Panel del Analista.
      </footer>
        </div>
    </div>
  );
}
