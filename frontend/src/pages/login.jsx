import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      redirectByRole(role);
    }
  }, []);

  const redirectByRole = (role) => {
    let normalizedRole = role;

    if (
      role === "broker_superadmin" ||
      role === "broker_admin" ||
      role === "broker_analyst"
    ) {
      normalizedRole = "broker";
    }

    if (role === "global_superadmin" || role === "global_admin") {
      normalizedRole = "user_admin";
    }

    switch (normalizedRole) {
      case "admin":
        navigate("/admin");
        break;
      case "analista":
        navigate("/analista");
        break;
      case "global_user":
        navigate("/usuario");
        break;
      case "broker":
        navigate("/broker");
        break;
      case "user_admin":
        navigate("/global_user");
        break;
      case "global_broker":
        navigate("/global_broker");
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:33761/api/autenticacion/iniciar-sesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      const user = data.user || {};

      const role =
        user.role ||
        user.rol ||
        user.rol_usuario ||
        user.tipo_rol ||
        "usuario";

      const userId =
        user.id_usuario || user.id || user.email || user.correo_registro || "";
      const userName =
        user.full_nombre_usuario ||
        user.full_nombre_broker ||
        user.nombre ||
        user.name ||
        "";

      localStorage.setItem("role", role);
      localStorage.setItem("userId", String(userId));
      localStorage.setItem("userName", userName);

      if (user.id_aseguradora) {
        localStorage.setItem("id_aseguradora", String(user.id_aseguradora));
      } else {
        localStorage.removeItem("id_aseguradora");
      }

      setLoading(false);
      redirectByRole(role);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
      setLoading(false);
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

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="!bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg shadow-md transition"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="mt-1 text-sm text-center text-blue-600 underline"
            >
              ¿Aún no tienes cuenta? Regístrate
            </button>
          </div>
        </form>

        <p className="text-gray-600 text-xs text-center mt-6">
          © 2025 MiSeguroDigital — Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}

