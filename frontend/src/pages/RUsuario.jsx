import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    fechaNacimiento: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresa el nombre.";
    if (!form.apellido.trim()) e.apellido = "Ingresa el apellido.";
    if (!form.email.trim()) e.email = "Ingresa el correo.";
    if (!form.password.trim()) e.password = "Ingresa la contraseña.";
    if (!form.telefono.trim()) e.telefono = "Ingresa el teléfono.";
    if (!form.fechaNacimiento.trim())
      e.fechaNacimiento = "Selecciona la fecha de nacimiento.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    // Armar payload tal como lo espera el backend
    const payload = {
      email: form.email,
      password: form.password,
      nombrePrim: form.nombre,          // usamos nombre completo como nombrePrim
      apellidoPrim: form.apellido,                 // si luego quieres, lo puedes separar
      fullNombre: form.nombre + " " + form.apellido,
      telefono: form.telefono,
      fechaNacimiento: form.fechaNacimiento,
    };

    try {
      const resp = await fetch("http://localhost:33761/api/autenticacion/registrar-usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        // mostrar error que viene del backend (409, 400, etc.)
        setErrors((prev) => ({
          ...prev,
          api: data.message || "Error al crear usuario",
        }));
        console.error("Error al registrar usuario:", data);
        return;
      }

      console.log("Usuario registrado correctamente:", data);

      // limpiar formulario
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: "",
        fechaNacimiento: "",
      });
      setErrors({});

      // volver a inicio
      navigate("/");
    } catch (err) {
      console.error("Error de red o servidor:", err);
      setErrors((prev) => ({
        ...prev,
        api: "No se pudo conectar con el servidor",
      }));
    }
  };

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[12px]"></div>

      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-4 text-green-700 font-semibold z-20">
        <div className="text-xl">MiSeguroDigital</div>
      </header>

      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 z-10 border border-green-100">
        <h2 className="text-2xl font-extrabold text-green-700 mb-4 text-center">
          Registrar Usuario
        </h2>

        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre "
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="border-2 border-green-300 focus:border-green-500 rounded-lg px-4 py-2 outline-none"
          />
          {errors.nombre && (
            <p className="text-red-600 text-sm">{errors.nombre}</p>
          )}

          <input
            type="text"
            placeholder="Apellido"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            className="border-2 border-green-300 focus:border-green-500 rounded-lg px-4 py-2 outline-none"
          />
          {errors.apellido && (
            <p className="text-red-600 text-sm">{errors.apellido}</p>
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border-2 border-green-300 focus:border-green-500 rounded-lg px-4 py-2 outline-none"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border-2 border-green-300 focus:border-green-500 rounded-lg px-4 py-2 outline-none"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password}</p>
          )}

          <input
            type="text"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="border-2 border-green-300 focus:border-green-500 rounded-lg px-4 py-2 outline-none"
          />
          {errors.telefono && (
            <p className="text-red-600 text-sm">{errors.telefono}</p>
          )}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              value={form.fechaNacimiento}
              onChange={(e) =>
                setForm({ ...form, fechaNacimiento: e.target.value })
              }
              className="border-2 border-green-300 focus:border-green-500 rounded-lg px-2 py-2 outline-none"
            />
            {errors.fechaNacimiento && (
              <p className="text-red-600 text-sm">
                {errors.fechaNacimiento}
              </p>
            )}
          </div>

          {errors.api && (
            <p className="text-red-600 text-sm text-center mt-1">
              {errors.api}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 !bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
            >
              Guardar Usuario
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="flex-1 !bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
        </form>

        <p className="text-gray-600 text-xs mt-6 text-center">
          © 2025 MiSeguroDigital — Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
