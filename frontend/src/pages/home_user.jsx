import { Link } from "react-router-dom";

export default function HomeUser() {
  const userName = localStorage.getItem("userName") || "Usuario";

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

      <main className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
        <div className="max-w-2xl w-full bg-white/80 rounded-2xl shadow-lg p-10 backdrop-blur-md text-center border border-green-100">
          <h1 className="text-5xl font-extrabold text-green-700 mb-4">
            Bienvenido, {userName}
          </h1>
          <p className="text-gray-700 text-lg max-w-xl mx-auto mb-8">
            Descubre, compara y gestiona pólizas de forma simple y segura.
          </p>

          <div className="flex justify-center mb-8">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9428/9428853.png"
              alt="Seguros"
              className="w-32 h-32"
            />
          </div>

          <div className="flex flex-row flex-wrap justify-center items-center gap-4 mt-6">
            <Link
              to="/catalog"
              className="inline-block no-underline border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Ver Catálogo de Pólizas
            </Link>

            <Link
              to="/me/applications"
              className="inline-block no-underline border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Mis Solicitudes
            </Link>

            <Link
              to="/me/pagar_polizas"
              className="inline-block no-underline border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Pagar
            </Link>

            <Link
              to="/me/perfil"
              className="inline-block no-underline border-2 border-green-600 !text-green-700 hover:!text-white hover:!bg-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Mi Perfil
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative py-6 text-gray-600 text-sm text-center z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
