import { useLocation, useNavigate } from "react-router-dom";

export default function AdminApplicationDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error: No se recibieron datos</h1>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Regresar
        </button>
      </div>
    );
  }

  const { user, policy, description, type, monthlyPayment, date } = state;

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80')"
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">

        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl">MiSeguroDigital</div>
        </header>

        <main className="flex-1 flex flex-col justify-center items-center py-10 px-4">

          <div className="max-w-3xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
            <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
              Detalles de la Solicitud
            </h1>

            <div className="space-y-4 text-lg text-gray-800">

              <p><strong>Usuario:</strong> {user}</p>
              <p><strong>Póliza Solicitada:</strong> {policy}</p>
              <p><strong>Descripción:</strong> {description}</p>
              <p><strong>Tipo de Póliza:</strong> {type}</p>
              <p><strong>Pago Mensual:</strong> ${monthlyPayment}</p>
              <p><strong>Fecha de Solicitud:</strong> {date}</p>

            </div>

            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={() => navigate(-1)}
                className="!bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Regresar
              </button>
            </div>

          </div>
        </main>

        <footer className="py-6 text-gray-500 text-sm text-center">
          © 2025 MiSeguroDigital — Panel del Administrador.
        </footer>

      </div>
    </div>
  );
}
