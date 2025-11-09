import { useState } from "react";

export default function BrokerNewPolicy() {
  const [name, setName] = useState("");
  const [coverage, setCoverage] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Ingresa el nombre de la póliza.";
    if (!coverage.trim()) e.coverage = "Describe la cobertura.";
    if (price === "") e.price = "Ingresa el precio mensual.";
    const n = parseFloat(price);
    if (price !== "" && (Number.isNaN(n) || n < 0)) {
      e.price = "Ingresa un precio válido (>= 0).";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    setMessage("✅ Póliza creada exitosamente (simulación).");
    setName("");
    setCoverage("");
    setPrice("");
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-green-50 via-white to-green-100 flex flex-col">
      <main className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="max-w-lg w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-sm mx-4">
          <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
            Crear Nueva Póliza
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                placeholder="Nombre de la póliza"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border-2 rounded-lg px-4 py-2 outline-none transition ${
                  errors.name
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                }`}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <textarea
                placeholder="Cobertura / Descripción"
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
                className={`w-full min-h-[120px] border-2 rounded-lg px-4 py-2 outline-none transition ${
                  errors.coverage
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                }`}
              />
              {errors.coverage && <p className="text-red-600 text-sm mt-1">{errors.coverage}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Precio mensual (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                placeholder="Ej: 29.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full border-2 rounded-lg px-4 py-2 outline-none transition ${
                  errors.price
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                }`}
              />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
              {price !== "" && !Number.isNaN(parseFloat(price)) && (
                <p className="text-gray-500 text-sm mt-1">
                  Vista previa: ${Number.parseFloat(price).toFixed(2)} / mes
                </p>
              )}
            </div>

            {message && (
              <p className="text-center text-green-700 font-medium">{message}</p>
            )}

            <button
              type="submit"
              className="!bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
            >
              Guardar Póliza
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 text-gray-500 text-sm text-center">
        © 2025 MiSeguroDigital — Panel del Administrador del Broker.
      </footer>
    </div>
  );
}
