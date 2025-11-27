import { useState, useEffect } from "react";
import  { useNavigate } from "react-router-dom";


export default function BrokerNewPolicy() {
 // Campos obligatorios del backend
 const [nombrePoliza, setNombrePoliza] = useState("");
 const [descripcion, setDescripcion] = useState("");
 const [tipoPoliza, setTipoPoliza] = useState("");
 const [pagoMensual, setPagoMensual] = useState("");
 const [montoCobertura, setMontoCobertura] = useState("");
 const [duracionContrato, setDuracionContrato] = useState("");
 const [porcentajeAprobacion, setPorcentajeAprobacion] = useState("");
 const [importeCancelacion, setImporteCancelacion] = useState("");
 const [estadoInicial, setEstadoInicial] = useState("");
 const navigate = useNavigate();


 // IDs del login
 const [brokerId, setBrokerId] = useState(null);
 const [aseguradoraId, setAseguradoraId] = useState(null);


 useEffect(() => {
   setBrokerId(localStorage.getItem("userId"));
   setAseguradoraId(localStorage.getItem("id_aseguradora"));
 }, []);


 const [errors, setErrors] = useState({});
 const [message, setMessage] = useState("");


 const validateMain = () => {
   const e = {};


   if (!nombrePoliza.trim()) e.nombrePoliza = "Ingresa el nombre de la póliza.";
   if (!descripcion.trim()) e.descripcion = "Ingresa la descripción.";
   if (!tipoPoliza) e.tipoPoliza = "Selecciona el tipo de póliza.";


   if (pagoMensual === "") e.pagoMensual = "Ingresa el pago mensual.";
   if (montoCobertura === "") e.montoCobertura = "Ingresa el monto de cobertura.";
   if (duracionContrato === "") e.duracionContrato = "Ingresa la duración del contrato.";
   if (porcentajeAprobacion === "") e.porcentajeAprobacion = "Ingresa el porcentaje.";
   if (importeCancelacion === "") e.importeCancelacion = "Ingresa el importe de cancelación.";
   if (!estadoInicial) e.estadoInicial = "Selecciona el estado inicial.";


   if (!aseguradoraId) e.aseguradora = "No se encontró aseguradoraId en sesión.";
   if (!brokerId) e.brokerId = "No se encontró brokerId en sesión.";


   setErrors(e);
   return Object.keys(e).length === 0;
 };


 const handleSubmit = async (e) => {
   e.preventDefault();
   if (!validateMain()) return;


   setMessage("Procesando...");


   const brokerId = Number(localStorage.getItem("userId"));
   const aseguradoraId = Number(localStorage.getItem("id_aseguradora"));


   console.log("➡️ Enviando póliza con:");
   console.log("brokerId:", brokerId);
   console.log("aseguradoraId:", aseguradoraId);


   const payload = {
     aseguradoraId,
     nombrePoliza,
     descripcion,
     tipoPoliza,
     pagoMensual,
     montoCobertura,
     duracionContrato,
     porcentajeAprobacion,
     importeCancelacion,
     estadoInicial,
     brokerId,
   };


   console.log("➡️ Payload enviado:", payload);


   try {
     const res = await fetch("http://localhost:33761/api/polizas/admin/crear-poliza", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(payload),
     });


     const rawText = await res.text();
     console.log("📌 RAW RESPONSE BODY:", rawText);


     let data = {};
     try {
       data = JSON.parse(rawText);
     } catch (err) {
       console.error("❌ ERROR PARSEANDO JSON:", err);
     }


     console.log("📌 Parsed JSON:", data);
     console.log("📌 Status HTTP:", res.status);


     if (!res.ok || !data.success) {
       console.error("❌ ERROR DESDE API:", data);
       setMessage(
         `❌ Error: ${data.message || "Fallo desconocido"} (campo: ${
           data.offender || "?"
         })`
       );
       return;
     }


     setMessage("✅ Póliza creada exitosamente.");


     // Reset form
     setNombrePoliza("");
     setDescripcion("");
     setTipoPoliza("");
     setPagoMensual("");
     setMontoCobertura("");
     setDuracionContrato("");
     setPorcentajeAprobacion("");
     setImporteCancelacion("");
     setEstadoInicial("");
     navigate ("/admin")

   } catch (err) {
     console.error("❌ ERROR DE CONEXIÓN:", err);
     setMessage("❌ No se pudo conectar con la API.");
   }
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
         <div className="max-w-lg w-full bg-white/80 rounded-2xl shadow-lg p-8">
           <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
             Crear Nueva Póliza
           </h1>


           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
             {/* CAMPOS DE LA POLIZA */}
             <input
               type="text"
               placeholder="Nombre de la póliza"
               value={nombrePoliza}
               onChange={(e) => setNombrePoliza(e.target.value)}
               className="w-full border-2 rounded-lg px-4 py-2 border-green-300"
             />
             {errors.nombrePoliza && <p className="text-red-600 text-sm">{errors.nombrePoliza}</p>}


             <textarea
               placeholder="Descripción / Cobertura"
               value={descripcion}
               onChange={(e) => setDescripcion(e.target.value)}
               className="w-full min-h-[90px] border-2 rounded-lg px-4 py-2 border-green-300"
             />
             {errors.descripcion && <p className="text-red-600 text-sm">{errors.descripcion}</p>}


             <select
               value={tipoPoliza}
               onChange={(e) => setTipoPoliza(e.target.value)}
               className="w-full border-2 rounded-lg px-4 py-2 border-green-300"
             >
               <option value="">Tipo de póliza</option>
               <option value="seguro_automotriz">Seguro Automotriz</option>
               <option value="seguro_inmobiliario">Seguro Inmobiliario</option>
               <option value="seguro_de_vida">Seguro de Vida</option>
               <option value="seguro_de_salud">Seguro de Salud</option>
             </select>
             {errors.tipoPoliza && <p className="text-red-600 text-sm">{errors.tipoPoliza}</p>}


             <input
               type="number"
               placeholder="Pago mensual"
               value={pagoMensual}
               onChange={(e) => setPagoMensual(e.target.value)}
               className="w-full border-2 rounded-lg px-4 py-2 border-green-300"
             />
             {errors.pagoMensual && <p className="text-red-600 text-sm">{errors.pagoMensual}</p>}


             <input
               type="number"
               placeholder="Monto de cobertura"
               value={montoCobertura}
               onChange={(e) => setMontoCobertura(e.target.value)}
               className="w-full border-2 rounded-lg px-4 py-2 border-green-300"
             />
             {errors.montoCobertura && <p className="text-red-600 text-sm">{errors.montoCobertura}</p>}


             <input
               type="number"
               placeholder="Duración del contrato (meses)"
               value={duracionContrato}
               onChange={(e) => setDuracionContrato(e.target.value)}
               className="w-full border-2 rounded-lg px-4 py-2 border-green-300"
             />
             {errors.duracionContrato && <p className="text-red-600 text-sm">{errors.duracionContrato}</p>}


             <input
               type="number"
               placeholder="Porcentaje de aprobación"
               value={porcentajeAprobacion}
               onChange={(e) => setPorcentajeAprobacion(e.target.value)}
               className="w-full border-2 rounded-lg px-4 py-2 border-green-300"
             />
             {errors.porcentajeAprobacion && <p className="text-red-600 text-sm">{errors.porcentajeAprobacion}</p>}


             <input
               type="number"
               placeholder="Importe de cancelación"
               value={importeCancelacion}
               onChange={(e) => setImporteCancelacion(e.target.value)}
               className="w-full border-2 rounded-lg px-4 py-2 border-green-300"
             />
             {errors.importeCancelacion && <p className="text-red-600 text-sm">{errors.importeCancelacion}</p>}


             <select
               value={estadoInicial}
               onChange={(e) => setEstadoInicial(e.target.value)}
               className="w-full border-2 rounded-lg px-4 py-2 border-green-300"
             >
               <option value="">Estado inicial</option>
               <option value="activa">Activa</option>
               <option value="pausada">Pausada</option>
               <option value="despublicada">Despublicada</option>
             </select>
             {errors.estadoInicial && <p className="text-red-600 text-sm">{errors.estadoInicial}</p>}


             {errors.aseguradora && <p className="text-red-600 text-sm">{errors.aseguradora}</p>}
             {errors.brokerId && <p className="text-red-600 text-sm">{errors.brokerId}</p>}


             {message && <p className="text-center font-medium">{message}</p>}


             <button
               type="submit"
               className="!bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow-md"
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
