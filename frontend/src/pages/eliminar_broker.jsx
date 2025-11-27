import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function EliminarBroker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const adminId = Number(localStorage.getItem("userId"));
    if (!adminId) return alert("Error: adminId no encontrado.");

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:33761/api/brokers/admin/eliminar-broker/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminId })
        }
      );

      const raw = await res.text();
      const data = JSON.parse(raw);

      if (!res.ok || !data.success) {
        alert(`Error: ${data.message}`);
        return;
      }

      alert("Broker eliminado correctamente");
      navigate("/admin/brokers");
    } catch (err) {
      alert("Error interno al eliminar broker");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80')"
      }}
    >
      <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">

        <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
          <div className="text-xl cursor-pointer" onClick={() => navigate("/")}>
            MiSeguroDigital
          </div>
          <div>Eliminar Broker</div>
        </header>

        <div className="max-w-lg w-full bg-white/80 rounded-2xl shadow-lg p-10 mx-auto my-20 text-center">
          <h1 className="text-3xl font-extrabold text-red-600 mb-6">
            ¿Eliminar Broker #{id}?
          </h1>

          <p className="text-gray-700 mb-10">
            Esta acción es permanente y no se puede revertir.
          </p>

          <div className="flex justify-center gap-6">
            <button
              onClick={() => navigate("/admin/brokers")}
              className="!bg-gray-400 text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition"
            >
              Cancelar
            </button>

            <button
              disabled={loading}
              onClick={handleDelete}
              className="!bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition"
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>

        <footer className="py-6 text-gray-500 text-sm text-center">
          © 2025 MiSeguroDigital — Panel del Administrador.
        </footer>

      </div>
    </div>
  );
}
