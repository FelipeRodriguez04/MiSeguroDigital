import { useState } from "react";

export default function BrokerNewPolicy() {
  const [name, setName] = useState("");
  const [coverage, setCoverage] = useState("");
  const [price, setPrice] = useState("");

  // Contenedor de requerimientos creados (simulación)
  const [requirements, setRequirements] = useState([]);

  // Estado para mostrar/ocultar el formulario de requerimiento
  const [showRequirementForm, setShowRequirementForm] = useState(false);

  // Campos del requerimiento actual
  const [requirementType, setRequirementType] = useState("");
  const [requirementDescription, setRequirementDescription] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [reqErrors, setReqErrors] = useState({});

  const validateMain = () => {
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

  const validateReq = () => {
    const e = {};

    if (!requirementType) e.requirementType = "Selecciona un tipo de requerimiento.";
    if (!requirementDescription.trim())
      e.requirementDescription = "Ingresa la descripción del requerimiento.";

    setReqErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveRequirement = () => {
    if (!validateReq()) return;

    const newReq = {
      type: requirementType,
      description: requirementDescription,
      mandatory: isMandatory,
    };

    setRequirements([...requirements, newReq]);

    // Limpiar campos del requerimiento
    setRequirementType("");
    setRequirementDescription("");
    setIsMandatory(false);

    // Ocultar formulario
    setShowRequirementForm(false);
    setReqErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateMain()) return;

    setMessage("✅ Póliza creada exitosamente (simulación).");

    setName("");
    setCoverage("");
    setPrice("");
    setRequirements([]); // reset
  };

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
        </header>

        <main className="flex-1 flex flex-col justify-center items-center px-4">
          <div className="max-w-lg w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-sm mx-4">
            <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
              Crear Nueva Póliza
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Nombre */}
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

              {/* Cobertura */}
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
                {errors.coverage && (
                  <p className="text-red-600 text-sm mt-1">{errors.coverage}</p>
                )}
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Precio mensual (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej: 29.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`w-full border-2 rounded-lg px-4 py-2 outline-none transition ${
                    errors.price
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              {/* -------------------------------------------- */}
              {/* BOTÓN PARA ABRIR EL FORM DE REQUERIMIENTO */}
              {/* -------------------------------------------- */}
              {!showRequirementForm && (
                <button
                  type="button"
                  onClick={() => setShowRequirementForm(true)}
                  className="!bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
                >
                  + Agregar requerimiento
                </button>
              )}

              {/* -------------------------------------------- */}
              {/* FORMULARIO DE AGREGAR REQUERIMIENTO */}
              {/* -------------------------------------------- */}
              {showRequirementForm && (
  <div className="border border-green-300 p-5 rounded-xl bg-white/60 mt-4 space-y-4">
    <h2 className="text-xl font-bold text-green-700">Nuevo Requerimiento</h2>

    {/* Tipo */}
    <div className="space-y-2">
      <label className="block text-sm text-gray-600">
        Tipo de Requerimiento
      </label>
      <select
        value={requirementType}
        onChange={(e) => setRequirementType(e.target.value)}
        className={`w-full border-2 rounded-lg px-4 py-2 outline-none transition ${
          reqErrors.requirementType
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
        }`}
      >
        <option value="">Selecciona una opción</option>
        <option value="registros_medicos">Registros médicos</option>
        <option value="estados_de_cuenta">Estados de cuenta</option>
        <option value="historial_crediticio">Historial crediticio</option>
        <option value="prueba_de_residencia">Prueba de residencia</option>
        <option value="otro">Otro</option>
      </select>
      {reqErrors.requirementType && (
        <p className="text-red-600 text-sm">{reqErrors.requirementType}</p>
      )}
    </div>

    {/* Descripción */}
    <div className="space-y-2">
      <label className="block text-sm text-gray-600">
        Descripción del requerimiento
      </label>
      <textarea
        placeholder="Descripción del requerimiento"
        value={requirementDescription}
        onChange={(e) => setRequirementDescription(e.target.value)}
        className={`w-full min-h-[90px] border-2 rounded-lg px-4 py-2 outline-none transition ${
          reqErrors.requirementDescription
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
        }`}
      />
      {reqErrors.requirementDescription && (
        <p className="text-red-600 text-sm">{reqErrors.requirementDescription}</p>
      )}
    </div>

    {/* Obligatorio */}
    <div className="flex items-center gap-3 pt-2">
      <input
        type="checkbox"
        checked={isMandatory}
        onChange={() => setIsMandatory(!isMandatory)}
        className="h-5 w-5 text-green-600"
      />
      <label className="text-gray-700">¿Requerimiento obligatorio?</label>
    </div>

    {/* Botón Guardar */}
    <button
      type="button"
      onClick={handleSaveRequirement}
      className="!bg-green-600 hover:bg-green-700 text-white font-semibold mt-2 py-2 rounded-lg shadow-md transition w-full"
    >
      Guardar requerimiento
    </button>
  </div>
)}


              {/* LISTA DE REQUERIMIENTOS AGREGADOS */}
              {requirements.length > 0 && (
                <div className="mt-4 bg-white/50 p-3 rounded-xl border border-green-300">
                  <h3 className="font-bold text-green-700 mb-2">Requerimientos agregados:</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {requirements.map((r, i) => (
                      <li key={i}>
                        <strong>{r.type}</strong> — {r.description}{" "}
                        {r.mandatory && <span className="text-red-600">(Obligatorio)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {message && (
                <p className="text-center text-green-700 font-medium mt-2">{message}</p>
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
    </div>
  );
}
