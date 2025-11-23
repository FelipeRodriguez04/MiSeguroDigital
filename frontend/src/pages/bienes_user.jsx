import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MisBienes() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [bienesRegistrados, setBienesRegistrados] = useState([]);
  const [bienesAsegurados, setBienesAsegurados] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tab, setTab] = useState("registrados"); 

  const TipoBien = {
    bien_inmueble: "Bien Inmueble",
    bien_automotriz: "Bien Automotriz",
    otro: "Otro",
  };

  const TiposPolizas = {
    seguro_automotriz: "Seguro Automotriz",
    seguro_inmobiliario: "Seguro Inmobiliario",
    seguro_de_vida: "Seguro de Vida",
    seguro_de_salud: "Seguro de Salud",
  };

  useEffect(() => {
    const fetchBienes = async () => {
      if (!userId) {
        setError("No se encontró el usuario en la sesión.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const respRegistrados = await fetch(
          `http://localhost:33761/api/bienes/usuario/bienes-registrados/${userId}`
        );
        const dataRegistrados = await respRegistrados.json();

        if (!respRegistrados.ok) {
          console.error("Error bienes registrados:", dataRegistrados);
          if (respRegistrados.status !== 404) {
            setError(
              dataRegistrados.message ||
                "Error al obtener bienes registrados."
            );
          }
        } else {
          setBienesRegistrados(dataRegistrados.data || []);
        }

        const respAsegurados = await fetch(
          `http://localhost:33761/api/bienes/usuario/bienes-asegurados/${userId}`
        );
        const dataAsegurados = await respAsegurados.json();

        if (!respAsegurados.ok) {
          console.error("Error bienes asegurados:", dataAsegurados);
          if (respAsegurados.status !== 404) {
            setError(
              dataAsegurados.message ||
                "Error al obtener bienes asegurados."
            );
          }
        } else {
          setBienesAsegurados(dataAsegurados.data || []);
        }
      } catch (err) {
        console.error("Error de red al obtener bienes:", err);
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchBienes();
  }, [userId]);

const handleEliminarBien = async (idBien) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("No se encontró el usuario en la sesión.");
    return;
  }

  try {
    const resp = await fetch(
      "http://localhost:33761/api/bienes/usuario/eliminar-bien",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idBien: Number(idBien),   
          userId: Number(userId),   
        }),
      }
    );

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      if (resp.status === 404) {
        alert("No se encontró el bien o no pertenece al usuario.");
      } else if (resp.status === 403) {
        alert("No se puede eliminar un bien que está asegurado.");
      } else {
        alert("No se puede eliminar el bien.");
      }
      return;
    }

    setBienesRegistrados((prev) =>
      prev.filter((b) => String(b.id_bien) !== String(idBien))
    );

    alert("Bien eliminado correctamente.");
  } catch (err) {
    console.error("Error al eliminar bien:", err);
    alert("Error de conexión con el servidor al eliminar el bien.");
  }
};


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
          className="!text-green-700 hover:text-green-900 transition flex items-center gap-1 no-underline"
          title="Volver"
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
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Volver
        </Link>
      </header>

      <main className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
        <div className="max-w-5xl w-full bg-white/80 rounded-2xl shadow-lg p-10 backdrop-blur-md border border-green-100">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2 text-center md:text-left">
            Mis Bienes
          </h1>
          <p className="text-gray-700 text-sm md:text-base mb-6 text-center md:text-left">
            Revisa los bienes que has registrado y los que se encuentran
            actualmente asegurados en tus pólizas.
          </p>

          <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
            <button
              type="button"
              onClick={() => setTab("registrados")}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition ${
                tab === "registrados"
                  ? "!bg-green-700 !text-white border-green-700 shadow-sm"
                  : "!bg-white !text-green-700 border-green-600 hover:bg-green-50"
              }`}
            >
              Bienes registrados
            </button>
            <button
              type="button"
              onClick={() => setTab("asegurados")}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition ${
                tab === "asegurados"
                  ? "!bg-green-700 !text-white border-green-700 shadow-sm"
                  : "!bg-white !text-green-700 border-green-600 hover:bg-green-50"
              }`}
            >
              Bienes asegurados
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 py-10">
              Cargando información de tus bienes...
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
              )}

              {tab === "registrados" && (
                <>
                  {bienesRegistrados.length === 0 ? (
                    <div className="text-center text-gray-600 py-8">
                      No tienes bienes registrados todavía.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b border-green-100 bg-green-50/60">
                              <th className="px-4 py-3 text-left font-semibold text-green-800">
                                ID Bien
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-green-800">
                                Tipo de bien
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-green-800">
                                Valoración
                              </th>
                              <th className="px-4 py-3 text-center font-semibold text-green-800">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white/60">
                            {bienesRegistrados.map((b) => (
                              <tr
                                key={b.id_bien}
                                className="border-b border-green-100 hover:bg-green-50/60 transition"
                              >
                                <td className="px-4 py-3 text-gray-800">
                                  {b.id_bien}
                                </td>
                                <td className="px-4 py-3 text-gray-800">
                                  {TipoBien[b.tipo_de_bien] ||
                                    b.tipo_de_bien}
                                </td>
                                <td className="px-4 py-3 text-gray-800 font-semibold">
                                  ${b.valoracion_bien}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        navigate(
                                          `/me/bienes/editar/${b.id_bien}`
                                            , { state: { bien: b } }
                                        )
                                      }
                                      className="px-3 py-1 rounded-lg !border-green-600 !text-green-700 text-xs font-semibold hover:!bg-green-50 transition"
                                    >
                                      Editar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEliminarBien(b.id_bien)
                                      }
                                      className="px-3 py-1 rounded-lg border !border-red-500 !text-red-600 text-xs font-semibold hover:!bg-red-50 transition"
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={() => navigate("/me/bienes/nuevo")}
                          className="inline-block px-5 py-2 rounded-lg border-2 !border-green-600 !text-green-700 font-semibold text-sm hover:!bg-green-600 hover:!text-white transition-all shadow-sm hover:shadow-md"
                        >
                          Registrar nuevo bien
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}

              {tab === "asegurados" && (
                <>
                  {bienesAsegurados.length === 0 ? (
                    <div className="text-center text-gray-600 py-8">
                      No se encontraron bienes asegurados para tu usuario.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-green-100 bg-green-50/60">
                            <th className="px-4 py-3 text-left font-semibold text-green-800">
                              ID Bien Usuario
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-green-800">
                              ID Registro en póliza
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-green-800">
                              Tipo de bien
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-green-800">
                              Valoración
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-green-800">
                              Tipo de póliza
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-green-800">
                              Monto cobertura total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white/60">
                          {bienesAsegurados.map((b) => (
                            <tr
                              key={b.id_registro_en_poliza}
                              className="border-b border-green-100 hover:bg-green-50/60 transition"
                            >
                              <td className="px-4 py-3 text-gray-800">
                                {b.id_bien_del_usuario}
                              </td>
                              <td className="px-4 py-3 text-gray-800">
                                {b.id_registro_en_poliza}
                              </td>
                              <td className="px-4 py-3 text-gray-800">
                                {TipoBien[b.tipo_de_bien] ||
                                  b.tipo_de_bien}
                              </td>
                              <td className="px-4 py-3 text-gray-800 font-semibold">
                                ${b.valoracion_bien}
                              </td>
                              <td className="px-4 py-3 text-gray-800">
                                {TiposPolizas[b.tipo_de_poliza] ||
                                  b.tipo_de_poliza}
                              </td>
                              <td className="px-4 py-3 text-gray-800 font-semibold">
                                ${b.monto_cobertura_total}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
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
