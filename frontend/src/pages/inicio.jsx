import { useNavigate } from "react-router-dom";

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[12px]"></div>

      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-4 text-green-700 font-semibold z-20">
        <div className="text-xl">MiSeguroDigital</div>
      </header>

      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 z-10 border border-green-100 text-center">
        <h1 className="text-3xl font-extrabold text-green-700 mb-4">Bienvenido a MiSeguroDigital</h1>
        <p className="text-gray-600 mb-6">¿Deseas iniciar sesión o registrarte?</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="!bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            Iniciar sesión
          </button>

          <button
            onClick={() => navigate("/register")}
            className="!bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            Registrarse
          </button>
        </div>

        <p className="text-gray-600 text-xs mt-6">© 2025 MiSeguroDigital — Todos los derechos reservados.</p>
      </div>
    </div>
  );
}
