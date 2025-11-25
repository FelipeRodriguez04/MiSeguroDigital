import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function GlobalUserUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  const Estado = {
    activo: "Activo",
    inactivo: "Inactivo",
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await fetch(
          "http://localhost:33761/api/usuarios/admin/usuarios-registrados",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await resp.json();
        setUsuarios(data.data || []);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=1650&q=80')",
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">
        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl">MiSeguroDigital</div>
        </header>

        <div className="px-6 mt-6 text-center">
          <h1 className="text-5xl font-extrabold text-green-700 drop-shadow-sm">
            Clientes Registrados
          </h1>

          <p className="text-gray-700 mt-2 text-lg">
            Lista de todos los <strong>usuarios normales</strong> (clientes).
          </p>
        </div>

        <main className="flex-1 flex flex-col justify-start items-center px-6 mt-6">
          <div className="max-w-6xl w-full bg-white/85 rounded-2xl shadow-xl p-10 border border-green-100">

            <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
              <table className="min-w-max w-full text-sm">
                <thead className="bg-green-50 text-green-900">
                  <tr>
                    <th className="border px-3 py-2">ID</th>
                    <th className="border px-3 py-2">Nombre Primario</th>
                    <th className="border px-3 py-2">Apellido Primario</th>
                    <th className="border px-3 py-2">Nombre completo</th>
                    <th className="border px-3 py-2">Email</th>
                    <th className="border px-3 py-2">Telefono</th>
                    <th className="border px-3 py-2">Estado</th>
                    <th className="border px-3 py-2">Fecha Registro</th>
                    <th className="border px-3 py-2 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {usuarios.map((u) => (
                    <tr
                      key={u.id_usuario}
                      className="odd:bg-gray-50 hover:bg-green-50 transition"
                    >
                      <td className="border px-3 py-2 font-medium">
                        {u.id_usuario}
                      </td>
                      <td className="border px-3 py-2">{u.nombre_primario}</td>
                      <td className="border px-3 py-2">{u.apellido_primario}</td>
                      <td className="border px-3 py-2">{u.nombre_completo}</td>
                      <td className="border px-3 py-2">{u.correo_registro}</td>
                      <td className="border px-3 py-2">{u.telefono}</td>
                      <td className="border px-3 py-2">
                        {Estado[u.estado_registro]}
                      </td>
                      <td className="border px-3 py-2">{u.fecha_registro}</td>

                      <td className="border px-3 py-2 text-center space-x-3">
                        <button
                          className="px-3 py-1 !bg-yellow-500 !text-white text-xs rounded-lg hover:!bg-yellow-700 transition"
                            onClick={() =>
                              navigate(`/global/edit-user/${u.id_usuario}`, {
                                state: { usuario: u },   
                              })
                            }
                        >
                          Editar
                        </button>

                        <button
                          className="px-3 py-1 !bg-red-600 !text-white text-xs rounded-lg hover:!bg-red-700 transition"
                          onClick={() =>
                            alert(`Eliminar usuario ${u.id_usuario}`)
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}

                  {usuarios.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </main>

        <footer className="py-4 text-gray-600 text-sm text-center">
          © 2025 MiSeguroDigital — Global User.
        </footer>
      </div>
    </div>
  );
}
