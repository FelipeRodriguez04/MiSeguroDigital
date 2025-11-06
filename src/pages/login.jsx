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
      { email: "admin@example.com", password: "123456", role: "admin" },
      { email: "analista@example.com", password: "654321", role: "analista" },
      { email: "user@example.com", password: "111111", role: "usuario" },
    ];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("role", user.role);

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
        default:
          navigate("/");
      }
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="relative min-h-screen w-screen bg-gradient-to-r from-green-100 via-white to-green-50 flex flex-col items-center justify-center text-center">
      <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-sm mx-4">
        <h2 className="text-3xl font-extrabold text-green-700 mb-4">
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

        <p className="text-gray-500 text-xs text-center mt-6">
          © 2025 MiSeguroDigital — Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
