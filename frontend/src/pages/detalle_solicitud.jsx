import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DetalleSolicitud() {
  const { id, id_user } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const handleAction = async (idAplicacion, action) => {
  const brokerAnalistaId = localStorage.getItem("userId");
  const razonRechazo =
    action === "rechazada" ? prompt("Escribe la razón del rechazo:") : null;

  if (
    action === "rechazada" &&
    (!razonRechazo || razonRechazo.trim() === "")
  ) {
    alert("La razón es obligatoria para rechazar.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:33761/api/aplicaciones/brokers/procesar-aplicacion/${idAplicacion}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brokerAnalistaId,
          decision: action,
          razonRechazo,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      alert(data.message || "Error al procesar la aplicación");
      return;
    }

    if (action === "aprobada") {
      const response2 = await fetch(
        `http://localhost:33761/api/aplicaciones/brokers/registrar-aprobacion-aplicacion/${idAplicacion}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brokerId: brokerAnalistaId,
          }),
        }
      );

      const data2 = await response2.json().catch(() => ({}));

      if (!response2.ok) {
        alert(data2.message || "La solicitud se aprobó, pero NO se pudo formalizar el registro.");
        return;
      }

      alert("Aplicación aprobada y registro formalizado correctamente.");
    } else {
      alert("Aplicación rechazada correctamente.");
    }

    navigate("/broker/solicitudes-pendientes");
  
  } catch (err) {
    alert("Error al procesar: " + err.message);
  }
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:33761/api/aplicaciones/brokers/obtener-detalles-aplicacion/${id}/${id_user}`
        );

        if (!res.ok) {
          const dataErr = await res.json().catch(() => ({}));
          throw new Error(dataErr.message || "Error al obtener detalles");
        }

        const data = await res.json();
        // Asumiendo que el backend devuelve un array y el objeto está en [0]
        setSolicitud(data[0]);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, id_user]);

  if (loading) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-600">
        Error al cargar la solicitud: {error}
      </p>
    );
  }

  if (!solicitud) {
    return (
      <p className="text-center mt-10">
        No se encontraron datos de la solicitud.
      </p>
    );
  }

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
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
        <div className="max-w-3xl w-full bg-white/85 rounded-2xl shadow-xl p-10 backdrop-blur-md mx-4 border border-green-100">
          <h1 className="text-4xl font-bold text-green-700 mb-6">
            Detalles de la Solicitud #{id}
          </h1>

          <p className="text-lg mb-3">
            <b>Usuario:</b> {solicitud.full_nombre_usuario}
          </p>
          <p className="text-lg mb-3">
            <b>Email:</b> {solicitud.correo_registro}
          </p>
        <p className="text-lg mb-3">
            <b>Teléfono:</b> {solicitud.numero_telefono_usuario}
          </p>
          <p className="text-lg mb-3">
            <b>Póliza:</b> {solicitud.nombre_de_la_poliza}
          </p>
          <p className="text-lg mb-3">
            <b>Aseguradora:</b> {solicitud.nombre_aseguradora}
          </p>
          <p className="text-lg mb-3">
            <b>Fecha de aplicación:</b>{" "}
            {new Date(solicitud.fecha_de_aplicacion).toLocaleString()}
          </p>

        <p className="text-lg mb-3">
            <b>Cantidad de documentos:</b> {solicitud.cantidad_documentos}
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => handleAction(id, "aprobada")}
              className="px-6 py-2 !bg-green-600 !text-white rounded-lg hover:bg-green-700"
            >
              Aprobar
            </button>

            <button
              onClick={() => handleAction(id, "rechazada")}
              className="px-6 py-2 !bg-red-600 !text-white rounded-lg hover:bg-red-700"
            >
              Rechazar
            </button>
          </div>

          <div className="mt-6">
            <Link
              to="/broker/solicitudes-pendientes"
              className="!text-green-700 underline"
            >
              Volver
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
