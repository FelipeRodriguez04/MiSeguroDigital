export default function HomeAdmin() {
  return (
    <div className="relative min-h-screen w-screen bg-gradient-to-r from-green-100 via-white to-green-50 flex flex-col items-center justify-center text-center">
      <button
        className="absolute top-6 left-6 text-red-600 hover:text-red-700 transition"
        onClick={() => {
          localStorage.removeItem("role");
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
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>
      </button>

      <div className="max-w-2xl w-full bg-white/60 rounded-2xl shadow-lg p-10 backdrop-blur-sm mx-4">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">
          Bienvenido, Administrador del Broker
        </h1>

        <p className="text-gray-700 text-lg max-w-xl mx-auto mb-8">
          Administra las pólizas disponibles, crea nuevas ofertas y supervisa las
          solicitudes recibidas por tus analistas.
        </p>

        <div className="flex justify-center mb-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9428/9428855.png"
            alt="Administrador"
            className="w-32 h-32"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
        <a
        href="/broker/policies"
        className="inline-block no-underline border-2 border-green-600 !text-green-700 visited:!text-green-700 focus:!text-green-700 hover:!text-white hover:!bg-green-600 active:!text-green-800 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
        >
        Gestionar Pólizas
        </a>
          <a
            href="/broker/applications"
        className="inline-block no-underline border-2 border-green-600 !text-green-700 visited:!text-green-700 focus:!text-green-700 hover:!text-white hover:!bg-green-600 active:!text-green-800 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Ver Solicitudes
          </a>
          <a
            href="/broker/policies/new"
        className="inline-block no-underline border-2 border-green-600 !text-green-700 visited:!text-green-700 focus:!text-green-700 hover:!text-white hover:!bg-green-600 active:!text-green-800 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Crear Nueva Póliza
          </a>
        </div>
      </div>

      <footer className="mt-10 text-gray-500 text-sm">
        © 2025 MiSeguroDigital — Panel del Administrador del Broker.
      </footer>
    </div>
  );
}

