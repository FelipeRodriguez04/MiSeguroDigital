import { Link } from "react-router-dom";

export default function GlobalUserHome() {
  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=1650&q=80')", // 🔵 NUEVA IMAGEN
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">

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

        <main className="flex-1 flex flex-col justify-center items-center px-6">
          <div className="max-w-2xl w-full bg-white/85 rounded-2xl shadow-xl p-10 text-center">

            <h1 className="text-5xl font-extrabold text-green-700 mb-4">
              Bienvenido,<br /> Usuario Global
            </h1>

            <p className="text-gray-700 text-lg mb-8">
              Accede a todo el sistema: usuarios, brokers y pólizas en un solo lugar.
            </p>

            <div className="flex justify-center mb-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Global User"
                className="w-28 h-28"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4">

              <Link
                to="/global_user/usuarios"
                className="inline-block no-underline border-2 border-green-600 !text-green-700 
                visited:!text-green-700 focus:!text-green-700 hover:!text-white hover:!bg-green-600 
                active:!text-green-800 px-6 py-2 rounded-lg text-base font-semibold transition-all 
                duration-200 shadow-sm hover:shadow-md"
              >
                Ver Usuarios
              </Link>

              <Link
                to="/global_user/brokers"
                className="inline-block no-underline border-2 border-green-600 !text-green-700 
                visited:!text-green-700 focus:!text-green-700 hover:!text-white hover:!bg-green-600 
                active:!text-green-800 px-6 py-2 rounded-lg text-base font-semibold transition-all 
                duration-200 shadow-sm hover:shadow-md"
              >
                Ver Brokers
              </Link>

              <Link
                to="/global_user/polizas"
                className="inline-block no-underline border-2 border-green-600 !text-green-700 
                visited:!text-green-700 focus:!text-green-700 hover:!text-white hover:!bg-green-600 
                active:!text-green-800 px-6 py-2 rounded-lg text-base font-semibold transition-all 
                duration-200 shadow-sm hover:shadow-md"
              >
                Ver Pólizas
              </Link>

            </div>
          </div>
        </main>

        <footer className="py-4 text-gray-600 text-sm text-center">
          © 2025 MiSeguroDigital — Panel Global User.
        </footer>
      </div>
    </div>
  );
}
