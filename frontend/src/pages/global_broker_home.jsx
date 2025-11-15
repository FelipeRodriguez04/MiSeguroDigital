import { Link } from "react-router-dom";

const aseguradoras = [
  { id_aseguradora: 1, nombre: "Aseguradora Andina" },
  { id_aseguradora: 2, nombre: "Seguros Pacífico" },
];

export default function GlobalBrokerPage() {
  const aseguradoraActual =
    aseguradoras.find((a) => a.id_aseguradora === parseInt(localStorage.getItem("id_aseguradora"))) || {
      nombre: "Tu Aseguradora",
    };

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
              Panel Global Broker
            </h1>

            <p className="text-gray-700 text-lg mb-2">
              Aseguradora:{" "}
              <span className="font-semibold">{aseguradoraActual.nombre}</span>
            </p>

            <p className="text-gray-700 text-lg mb-8">
              Administra el <strong>equipo</strong> y todas las <strong>pólizas</strong> asociadas a tu
              aseguradora.
            </p>

            <div className="flex justify-center mb-8">
                <img
                src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
                alt="Global Broker"
                className="w-28 h-28"
                />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/global_broker/equipo"
                className="inline-block no-underline border-2 border-green-600 !text-green-700 
                  visited:!text-green-700 focus:!text-green-700 hover:!text-white hover:!bg-green-600 
                  active:!text-green-800 px-6 py-2 rounded-lg text-base font-semibold transition-all 
                  duration-200 shadow-sm hover:shadow-md"
              >
                Ver Equipo
              </Link>

              <Link
                to="/global_broker/polizas"
                className="inline-block no-underline border-2 border-green-600 !text-green-700 
                  visited:!text-green-700 focus:!text-green-700 hover:!text-white hover:!bg-green-600 
                  active:!text-green-800 px-6 py-2 rounded-lg text-base font-semibold transition-all 
                  duration-200 shadow-sm hover:shadow-md"
              >
                Ver Pólizas
              </Link>

            <Link
                to="/global_broker/solicitudes"
                className="inline-block no-underline border-2 border-green-600 !text-green-700 
                  visited:!text-green-700 focus:!text-green-700 hover:!text-white hover:!bg-green-600 
                  active:!text-green-800 px-6 py-2 rounded-lg text-base font-semibold transition-all 
                  duration-200 shadow-sm hover:shadow-md"
              >
                Ver Solicitudes
              </Link>
            </div>
          </div>
        </main>
        <footer className="py-4 text-gray-600 text-sm text-center">
          © 2025 MiSeguroDigital — Global Broker.
        </footer>
      </div>
    </div>
  );
}
