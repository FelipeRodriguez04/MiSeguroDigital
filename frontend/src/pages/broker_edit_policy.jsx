import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BrokerEditPolicy() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODOS LOS CAMPOS VACÍOS POR DEFECTO
  const [policyData, setPolicyData] = useState({
    name: "",
    description: "",
    type: "",
    price: "",
    monthlyPayment: "",
    contractDuration: "",
    coverage: "",
    status: "",
  });

  const policyStatusEnum = ["ACTIVA", "INACTIVA", "PENDIENTE", "VENCIDA"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPolicyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Datos guardados:", policyData);
    navigate("/broker_policies");
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
          <div className="text-xl cursor-pointer" onClick={() => navigate("/")}>
            MiSeguroDigital
          </div>
        </header>

        <div className="max-w-4xl w-full bg-white/80 rounded-2xl shadow-lg p-8 mx-auto my-10 flex-1">
          
          <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
            Editar Póliza #{id}
          </h1>

          <p className="text-gray-700 text-lg mb-10 text-center">
            Llena los campos para actualizar la información de esta póliza.
          </p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            
            {/* Nombre */}
            <div>
              <label className="font-semibold text-green-800">Nombre</label>
              <input
                type="text"
                name="name"
                value={policyData.name}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                placeholder="Ingrese el nombre"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="font-semibold text-green-800">Tipo de Póliza</label>
              <input
                type="text"
                name="type"
                value={policyData.type}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                placeholder="Ej: Vehicular, Vida, Hogar"
              />
            </div>

            {/* Precio */}
            <div>
              <label className="font-semibold text-green-800">Precio (USD)</label>
              <input
                type="number"
                name="price"
                value={policyData.price}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                placeholder="Ej: 20"
              />
            </div>

            {/* Pago mensual */}
            <div>
              <label className="font-semibold text-green-800">Pago Mensual (USD)</label>
              <input
                type="number"
                name="monthlyPayment"
                value={policyData.monthlyPayment}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                placeholder="Ej: 20"
              />
            </div>

            {/* Duración */}
            <div>
              <label className="font-semibold text-green-800">
                Duración del Contrato (meses)
              </label>
              <input
                type="number"
                name="contractDuration"
                value={policyData.contractDuration}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                placeholder="Ej: 12"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="font-semibold text-green-800">Estado de Póliza</label>
              <select
                name="status"
                value={policyData.status}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-xl bg-white"
              >
                <option value="">Seleccione un estado</option>
                {policyStatusEnum.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="font-semibold text-green-800">
                Descripción / Cobertura
              </label>
              <textarea
                name="description"
                value={policyData.description}
                onChange={handleChange}
                rows="4"
                className="w-full mt-2 p-3 border rounded-xl bg-white"
                placeholder="Describa la póliza, coberturas, condiciones..."
              ></textarea>
            </div>

          </form>

          {/* Botones */}
          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={() => navigate("/broker_policies")}
              className="!bg-gray-400 text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="!bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
            >
              Guardar Cambios
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
