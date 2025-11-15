import React from "react";
import { Link } from "react-router-dom";

const aseguradoras = [
  { id_aseguradora: 1, nombre: "Aseguradora Andina" },
  { id_aseguradora: 2, nombre: "Seguros Pacífico" },
];

const usuarios = [
  {
    id_usuario: 1,
    nombres: "Carlos",
    apellidos: "Vera",
    email: "carlos@aseguradora.com",
    rol: "Administrador",
    id_aseguradora: 1,
  },
  {
    id_usuario: 2,
    nombres: "María",
    apellidos: "Lopez",
    email: "maria@aseguradora.com",
    rol: "Analista",
    id_aseguradora: 1,
  },
  {
    id_usuario: 3,
    nombres: "Pedro",
    apellidos: "Núñez",
    email: "pedro@aseguradora.com",
    rol: "Administrador",
    id_aseguradora: 2,
  },
];

export default function GlobalBrokerEquipo() {
  const idAsegLocal = localStorage.getItem("id_aseguradora");
  const idAseguradora = idAsegLocal ? parseInt(idAsegLocal, 10) : null;

  const aseguradoraActual =
    aseguradoras.find((a) => a.id_aseguradora === idAseguradora) || {
      nombre: "Tu Aseguradora",
    };

  const adminsFiltrados = usuarios.filter(
    (u) =>
      u.rol === "Administrador" &&
      (idAseguradora ? u.id_aseguradora === idAseguradora : true)
  );

  const analistasFiltrados = usuarios.filter(
    (u) =>
      u.rol === "Analista" &&
      (idAseguradora ? u.id_aseguradora === idAseguradora : true)
  );

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

          <Link
            to="/global_broker"
            className="text-green-700 border border-green-600 px-4 py-2 rounded-lg
                       hover:bg-green-600 hover:text-white transition font-semibold"
          >
            ⬅ Volver
          </Link>
        </header>

        <div className="px-6 mt-6 text-center">
          <h1 className="text-4xl font-extrabold text-green-700 drop-shadow-sm">
            Equipo de la Aseguradora
          </h1>
          <p className="text-gray-700 mt-2 text-lg">
            Aseguradora:{" "}
            <span className="font-semibold">{aseguradoraActual.nombre}</span>
          </p>
        </div>

        <main className="flex-1 flex flex-col justify-start items-center px-6 mt-6 mb-6">
          <div className="max-w-5xl w-full bg-white/85 rounded-2xl shadow-xl p-10 space-y-10">

            {/* ADMINISTRADORES */}
            <section>
              <h2 className="text-2xl font-bold text-green-700 mb-3">
                Administradores
              </h2>

              <table className="min-w-full border text-sm rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-green-50 text-green-900">
                  <tr>
                    <th className="border px-3 py-2">ID</th>
                    <th className="border px-3 py-2">Nombre</th>
                    <th className="border px-3 py-2">Email</th>
                    <th className="border px-3 py-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {adminsFiltrados.map((u) => (
                    <tr
                      key={u.id_usuario}
                      className="odd:bg-gray-50 hover:bg-green-50 transition"
                    >
                      <td className="border px-3 py-2 font-medium">
                        {u.id_usuario}
                      </td>
                      <td className="border px-3 py-2">
                        {u.nombres} {u.apellidos}
                      </td>
                      <td className="border px-3 py-2">{u.email}</td>

                      <td className="border px-3 py-2 text-center space-x-3">
                        <button
                          className="px-3 py-1 !bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600 transition"
                          onClick={() =>
                            alert(`Editar administrador ${u.id_usuario}`)
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="px-3 py-1 !bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                          onClick={() =>
                            alert(`Eliminar administrador ${u.id_usuario}`)
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* ANALISTAS */}
            <section>
              <h2 className="text-2xl font-bold text-green-700 mb-3">
                Analistas
              </h2>

              <table className="min-w-full border text-sm rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-green-50 text-green-900">
                  <tr>
                    <th className="border px-3 py-2">ID</th>
                    <th className="border px-3 py-2">Nombre</th>
                    <th className="border px-3 py-2">Email</th>
                    <th className="border px-3 py-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {analistasFiltrados.map((u) => (
                    <tr
                      key={u.id_usuario}
                      className="odd:bg-gray-50 hover:bg-green-50 transition"
                    >
                      <td className="border px-3 py-2 font-medium">
                        {u.id_usuario}
                      </td>
                      <td className="border px-3 py-2">
                        {u.nombres} {u.apellidos}
                      </td>
                      <td className="border px-3 py-2">{u.email}</td>

                      <td className="border px-3 py-2 text-center space-x-3">
                        <button
                          className="px-3 py-1 !bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600 transition"
                          onClick={() =>
                            alert(`Editar analista ${u.id_usuario}`)
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="px-3 py-1 !bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                          onClick={() =>
                            alert(`Eliminar analista ${u.id_usuario}`)
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

          </div>
        </main>

        <footer className="py-4 text-gray-600 text-sm text-center">
          © 2025 MiSeguroDigital — Global Broker.
        </footer>
      </div>
    </div>
  );
}

