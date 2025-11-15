import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = [
      { email: "admin@example.com", password: "123456", role: "admin", name: "Administrador General" },

      { email: "analista@example.com", password: "654321", role: "analista", name: "Analista de Seguros", id_aseguradora: 1 },

      { email: "user@example.com", password: "111111", role: "usuario", name: "Mauricio Rodríguez" },
      { email: "ana@example.com", password: "222222", role: "usuario", name: "Ana Gómez" },

      { email: "globaluser@example.com", password: "333333", role: "global_user", name: "Global User" },

      { email: "broker@example.com", password: "999999", role: "broker", name: "Broker Comercial", id_aseguradora: 1 },

      { email: "globalbroker@example.com", password: "444444", role: "global_broker", name: "Global Broker", id_aseguradora: 2 },
    ];

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.email);
      localStorage.setItem("userName", user.name);

      if (user.id_aseguradora) {
        localStorage.setItem("id_aseguradora", user.id_aseguradora);
      } else {
        localStorage.removeItem("id_aseguradora"); 
      }
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "analista":
          navigate("/analista");
          break;
        case "usuario":
          navigate("/usuario");
          break;
        case "broker":
          navigate("/broker");
          break;
        case "global_user":
          navigate("/global_user");
          break;
        case "global_broker":
          navigate("/global_broker");
          break;
        default:
          navigate("/");
      }
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

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
        <div className="text-xl text-green-700">MiSeguroDigital</div>
      </header>

      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-4 z-10 border border-green-100">
        <h2 className="text-3xl font-extrabold text-green-700 mb-4 text-center">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg px-4 py-2 outline-none transition"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg px-4 py-2 outline-none transition"
          />

          {error && (
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="!bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            Ingresar
          </button>
        </form>

        <p className="text-gray-600 text-xs text-center mt-6">
          © 2025 MiSeguroDigital — Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
