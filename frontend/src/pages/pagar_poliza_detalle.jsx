import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";

const MOCK_POLIZAS_ACEPTADAS = [
  {
    id_solicitud: 1,
    numero_poliza: "VID-2025-001",
    nombre_poliza: "Seguro de Vida Familiar",
    aseguradora: "Andes Seguros S.A.",
    pago_mensual: 30,
    monto_pendiente: 120,
    moneda: "USD",
  },
  {
    id_solicitud: 2,
    numero_poliza: "AUT-2025-045",
    nombre_poliza: "Seguro Vehicular Todo Riesgo",
    aseguradora: "Quito Insurance",
    pago_mensual: 45,
    monto_pendiente: 45,
    moneda: "USD",
  },
];

const METODOS_PAGO = [
  "Tarjeta crédito",
  "Tarjeta débito",
  "Efectivo",
  "Cheque",
  "Otro",
];

const MOTIVOS_PAGO = ["Pago mensualidad", "Pago importe cancelación"];
export default function PagarPolizaDetalle() {
  const { id_solicitud } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const polizaFromState = location.state?.poliza;

  const poliza = useMemo(() => {
    if (polizaFromState) return polizaFromState;
    const idNum = Number(id_solicitud);
    return MOCK_POLIZAS_ACEPTADAS.find((p) => p.id_solicitud === idNum);
  }, [polizaFromState, id_solicitud]);

  const [monto] = useState(poliza?.monto_pendiente ?? 0);
  const [metodoPago, setMetodoPago] = useState(METODOS_PAGO[0]);
  const [motivoPago, setMotivoPago] = useState(MOTIVOS_PAGO[0]);
  const [nota, setNota] = useState("");

  if (!poliza) {
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
        </header>

        <main className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
          <div className="max-w-md w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md text-center border border-red-100">
            <h1 className="text-2xl font-extrabold text-red-600 mb-3">
              Póliza no encontrada
            </h1>
            <p className="text-gray-700 text-sm mb-6">
              No hemos podido encontrar la póliza que deseas pagar.
            </p>
            <Link
              to="/me/pagar_polizas"
              className="inline-block no-underline border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Volver al listado de pólizas
            </Link>
          </div>
        </main>

        <footer className="relative py-6 text-gray-600 text-sm text-center z-10">
          © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
        </footer>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id_solicitud: poliza.id_solicitud,
      numero_poliza: poliza.numero_poliza,
      monto: Number(monto),
      metodoPago,
      motivoPago,
      nota,
    };

    console.log("Pagando póliza:", payload);

    alert(
      `Pago registrado:\nPóliza ${poliza.numero_poliza}\nMonto: ${monto} ${poliza.moneda}\nMétodo: ${metodoPago}\nMotivo: ${motivoPago}`
    );

    navigate("/me/pagar_polizas");
  };

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
        <div className="flex items-center gap-4">
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
        <div className="max-w-3xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-green-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h1 className="text-3xl font-extrabold text-green-700">
              Pago de póliza
            </h1>
          </div>

          <div className="mb-6 bg-green-50/70 rounded-xl p-4 border border-green-100">
            <h2 className="text-sm font-semibold text-green-800 mb-2">
              Detalle de la póliza
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-800">
              <div>
                <span className="font-semibold">N° de póliza:</span>{" "}
                {poliza.numero_poliza}
              </div>
              <div>
                <span className="font-semibold">Aseguradora:</span>{" "}
                {poliza.aseguradora}
              </div>
              <div>
                <span className="font-semibold">Nombre:</span>{" "}
                {poliza.nombre_poliza}
              </div>
              <div>
                <span className="font-semibold">Pago mensual:</span>{" "}
                {poliza.pago_mensual.toFixed(2)} {poliza.moneda}
              </div>
              <div>
                <span className="font-semibold">Monto pendiente:</span>{" "}
                <span className="font-bold text-green-800">
                  {poliza.monto_pendiente.toFixed(2)} {poliza.moneda}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Monto a pagar
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={monto}
                    readOnly
                    className="flex-1 border border-green-200 rounded-lg px-3 py-2 text-sm bg-gray-200 text-gray-700 cursor-not-allowed"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    {poliza.moneda}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Método de pago
                </label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80"
                  required
                >
                  {METODOS_PAGO.map((met) => (
                    <option key={met} value={met}>
                      {met}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Motivo de pago
              </label>
              <select
                value={motivoPago}
                onChange={(e) => setMotivoPago(e.target.value)}
                className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80"
                required
              >
                {MOTIVOS_PAGO.map((mot) => (
                  <option key={mot} value={mot}>
                    {mot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Nota / referencia (opcional)
              </label>
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={3}
                className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80"
                placeholder="Ej. Pago correspondiente al mes de enero..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/me/pagar_polizas")}
                className="px-4 py-2 rounded-lg text-sm font-semibold border-2 !border-gray-300 !text-gray-700 hover:!bg-gray-100/80 transition-all bg-white/70"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-sm !font-semibold border-2 border-green-600 text-white !bg-green-600 hover:!bg-green-700 hover:border-green-700 shadow-sm hover:shadow-md transition-all"
              >
                Confirmar pago
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="relative py-6 text-gray-600 text-sm text-center z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
