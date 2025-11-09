import { Link } from "react-router-dom";

export default function HomeAnalyst() {
  return (
    <div className="relative min-h-screen w-screen bg-gradient-to-r from-green-100 via-white to-green-50 flex flex-col">
<header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
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

      <main className="flex-1 flex flex-col items-center px-6 text-center">
      <div className="max-w-2xl w-full bg-white/60 rounded-2xl shadow-lg p-10 backdrop-blur-sm mx-4">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">Bienvenido, Analista</h1>
        <p className="text-gray-700 text-lg max-w-xl mx-auto mb-8">
          Supervisa y analiza las solicitudes de pólizas. Revisa documentos y registra tus decisiones.
        </p>

        <div className="flex justify-center mb-8">
          <img src="https://cdn-icons-png.flaticon.com/512/9428/9428885.png" alt="Analista" className="w-32 h-32" />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/broker/applications" className="inline-block no-underline border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-sm hover:shadow-md">
            Ver Solicitudes Pendientes
          </Link>
          <Link to="/broker/reviews" className="inline-block no-underline border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-sm hover:shadow-md">
            Reviews de Pólizas
          </Link>
          <Link to="/broker/reports" className="inline-block no-underline border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-sm hover:shadow-md">
            Generar Reportes
          </Link>
        </div>
      </div>
      <footer className="mt-10 text-gray-500 text-sm">© 2025 MiSeguroDigital — Panel del Analista.</footer>
      </main>
    </div>
  );
}
