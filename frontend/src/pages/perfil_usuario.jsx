import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PerfilUsuario() {
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState(null);

  const RolesMap = {
    global_user: "Usuario",
    global_admin: "Administrador Global",
    global_superadmin: "Superadministrador Global",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const resp = await fetch(
          `http://localhost:33761/api/usuarios/obtener-perfil/${userId}`
        );
        const data = await resp.json();
        if (resp.ok) {
          setUserData(data.data[0]);
        } else {
          console.error("Error al obtener datos del usuario:", data.message);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

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

        <Link
          to="/usuario"
          className="!text-green-700 hover:text-green-900 transition no-underline font-semibold"
        >
          ← Volver
        </Link>
      </header>

      <main className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
        <div className="max-w-xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-green-100">
          <h1 className="text-4xl font-extrabold text-green-700 mb-4 text-center">
            Mi Perfil
          </h1>

          {!userData ? (
            <div className="text-center text-gray-600 py-6">
              Cargando datos del usuario...
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-1 gap-4 text-gray-800 text-sm">
                <div className="p-3 bg-green-50/60 rounded-lg border border-green-100">
                  <span className="font-semibold">Nombre completo:</span>{" "}
                  {userData.full_nombre_usuario}
                </div>

                <div className="p-3 bg-green-50/60 rounded-lg border border-green-100">
                  <span className="font-semibold">Email:</span> {userData.email}
                </div>

                <div className="p-3 bg-green-50/60 rounded-lg border border-green-100">
                  <span className="font-semibold">Teléfono:</span>{" "}
                  {userData.numero_telefono_usuario}
                </div>

                <div className="p-3 bg-green-50/60 rounded-lg border border-green-100">
                  <span className="font-semibold">Fecha de nacimiento:</span>{" "}
                  {userData.fecha_nacimiento_usuario}
                </div>

                <div className="p-3 bg-green-50/60 rounded-lg border border-green-100">
                  <span className="font-semibold">Fecha de creación:</span>{" "}
                  {userData.fecha_creacion_usuario}
                </div>

                <div className="p-3 bg-green-50/60 rounded-lg border border-green-100">
                  <span className="font-semibold">Rol:</span>{" "}
                  {RolesMap[userData.rol]}
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Link
                  to="/usuario/editar_perfil"
                  className="!bg-green-700 hover:bg-green-800 !text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
                >
                  Editar Información
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="relative py-6 text-gray-600 text-sm text-center z-10">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
