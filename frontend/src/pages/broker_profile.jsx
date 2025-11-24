import { act, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProfileAnalyst() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const brokerId = localStorage.getItem("userId"); 


  const EstadoBroker={
    pendiente:"Pendiente",
    rechazado:"Rechazado",
    activo:"Activo",
  }

  const RolBroker={
    broker_superadmin:"Superadmin",
    broker_admin:"Administrador",
    broker_analyst:"Analista",
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:33761/api/brokers/obtener-datos/${brokerId}`, {
            method: "GET",
        });

        const json = await res.json();

        if (!json.success) throw new Error(json.message);

        setData(json.data);
        console.log(data);
      } catch (err) {
        setError(err.message || "Error al cargar datos del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brokerId]);

  return (
    <div
      className="relative min-h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-white/25 backdrop-blur-[12px]"></div>

      <header className="relative flex justify-between items-center px-8 py-4 text-green-700 font-semibold z-10">
        <div className="text-xl">MiSeguroDigital</div>
          <Link
            to="/analista"
            className="flex items-center gap-2 no-underline !text-green-700 hover:text-green-900 !transition font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Home Analista
          </Link>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
        <div className="max-w-2xl w-full bg-white/85 rounded-2xl shadow-xl p-10 backdrop-blur-md mx-4 border border-green-100">

          <h1 className="text-5xl font-extrabold text-green-700 mb-6">
            Mi Perfil
          </h1>

          {loading && (
            <p className="text-lg text-gray-700">Cargando datos...</p>
          )}

          {!loading && error && (
            <p className="text-red-600 font-semibold bg-red-50 border border-red-200 p-4 rounded-lg">
              {error}
            </p>
          )}

          {!loading && !error && data && (
            <>
              <div className="flex justify-center mb-8">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Perfil"
                  className="w-32 h-32 rounded-full border-4 border-green-200 shadow-md"
                />
              </div>

              <div className="text-left mx-auto max-w-md space-y-3 text-gray-700 text-lg">

                <p><span className="font-bold text-green-700">Nombre:</span> {data.nombre_prim_broker}</p>
                <p><span className="font-bold text-green-700">Apellido:</span> {data.apellido_prim_broker}</p>
                <p><span className="font-bold text-green-700">Nombre completo:</span> {data.full_nombre_broker}</p>

                <p><span className="font-bold text-green-700">Correo:</span> {data.email}</p>
                <p><span className="font-bold text-green-700">Teléfono:</span> {data.numero_telefono_broker}</p>

                <p><span className="font-bold text-green-700">Fecha nacimiento:</span> {data.fecha_nacimiento_broker}</p>

                <p><span className="font-bold text-green-700">Estado:</span> {EstadoBroker[data.estado_broker]}</p>
                <p><span className="font-bold text-green-700">Activo:</span> {data.is_active ? "Sí" : "No"}</p>

                <p><span className="font-bold text-green-700">Rol:</span> {RolBroker[data.broker_role]}</p>

                <p>
                  <span className="font-bold text-green-700">Aseguradora:</span>{" "}
                  {data.aseguradora.nombre_aseguradora}
                </p>

                <p><span className="font-bold text-green-700">Dominio permitido:</span> {data.aseguradora.dominio_correo_aseguradora}</p>

                <p><span className="font-bold text-green-700">Cuenta creada:</span> {data.created_at}</p>
              </div>
            </>
          )}
        </div>

        <footer className="mt-10 text-gray-600 text-sm">
          © 2025 MiSeguroDigital — Perfil del Analista.
        </footer>
      </main>
    </div>
  );
}
