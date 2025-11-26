import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


export default function BrokerEditPolicy() {
 const { id } = useParams();
 const navigate = useNavigate();


 const [loading, setLoading] = useState(true);
 const [policyData, setPolicyData] = useState({
   nombrePoliza: "",
   descripcion: "",
   tipoPoliza: "",
   pagoMensual: "",
   montoCobertura: "",
   duracionContrato: "",
   porcentajeAprobacion: "",
   importeCancelacion: "",
   estadoPoliza: ""
 });


 const policyTypeEnum = [
   "seguro_automotriz",
   "seguro_inmobiliario",
   "seguro_de_vida",
   "seguro_de_salud"
 ];


 const policyStatusEnum = ["activa", "pausada", "despublicada"];


 const Tipo={
   seguro_automotriz: "Seguro Automotriz",
   seguro_inmobiliario: "Seguro Inmobiliario",
   seguro_de_vida: "Seguro de Vida",
   seguro_de_salud: "Seguro de Salud"
 }


 // ============================================================
 // 🔍 Cargar póliza existente
 // ============================================================
 useEffect(() => {
   const fetchPolicy = async () => {
     try {
       const res = await fetch(
         "http://localhost:33761/api/polizas/catalogo-completo"
       );


       const raw = await res.text();
       let data = JSON.parse(raw);


       if (!res.ok || !data.success) {
         alert("Error al cargar la póliza");
         return;
       }


       const found = data.polizas.find(
         (p) => Number(p.id_poliza) === Number(id)
       );


       if (!found) {
         alert("Póliza no encontrada");
         navigate("/broker_policies");
         return;
       }


       // Mapear nombres del backend al formulario
       setPolicyData({
         nombrePoliza: found.nombre_poliza || "",
         descripcion: found.descripcion || "",
         tipoPoliza: found.tipo_poliza || "",
         pagoMensual: found.pago_mensual || "",
         montoCobertura: found.monto_cobertura || "",
         duracionContrato: found.duracion_contrato || "",
         porcentajeAprobacion: found.porcentaje_aprobacion || "",
         importeCancelacion: found.importe_cancelacion || "",
         estadoPoliza: found.estado_de_la_poliza || ""
       });
     } catch (err) {
       console.error("❌ ERROR FETCHING POLICY:", err);
       alert("No se pudo cargar la póliza.");
     } finally {
       setLoading(false);
     }
   };


   fetchPolicy();
 }, [id, navigate]);


 // ============================================================
 // 📝 Manejar cambios en el formulario
 // ============================================================
 const handleChange = (e) => {
   const { name, value } = e.target;
   setPolicyData((prev) => ({ ...prev, [name]: value }));
 };


 // ============================================================
 // 💾 Guardar cambios
 // ============================================================
 const handleSave = async () => {
   const brokerId = Number(localStorage.getItem("userId"));


   if (!brokerId || brokerId <= 0) {
     alert("No se encontró brokerId en sesión.");
     return;
   }


   try {
     const res = await fetch(
       `http://localhost:33761/api/polizas/admin/actualizar-poliza/${id}`,
       {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           ...policyData,
           brokerId
         })
       }
     );


     const raw = await res.text();
     let data = JSON.parse(raw);


     if (!res.ok || !data.success) {
       alert(`Error: ${data.message}`);
       return;
     }


     alert("Póliza actualizada correctamente.");
     navigate("/broker_policies");


   } catch (err) {
     console.error("❌ ERROR SAVING:", err);
     alert("Error al guardar la póliza.");
   }
 };


 // ============================================================
 // CARGANDO...
 // ============================================================
 if (loading) {
   return (
     <div className="min-h-screen flex items-center justify-center text-xl text-green-700">
       Cargando póliza...
     </div>
   );
 }


 // ============================================================
 // FORMULARIO
 // ============================================================
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


         <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">


           {/* Nombre */}
           <div>
             <label className="font-semibold text-green-800">Nombre</label>
             <input
               type="text"
               name="nombrePoliza"
               value={policyData.nombrePoliza}
               onChange={handleChange}
               className="w-full mt-2 p-3 border rounded-xl bg-white"
             />
           </div>


           {/* Tipo */}
           <div>
             <label className="font-semibold text-green-800">Tipo de Póliza</label>
             <select
               name="tipoPoliza"
               value={policyData.tipoPoliza}
               onChange={handleChange}
               className="w-full mt-2 p-3 border rounded-xl bg-white"
             >
               <option value="">Seleccione</option>
               {policyTypeEnum.map((type) => (
                 <option key={type} value={type}>
                   {Tipo[type]}
                 </option>
               ))}
             </select>
           </div>


           {/* Pago mensual */}
           <div>
             <label className="font-semibold text-green-800">Pago Mensual (USD)</label>
             <input
               type="number"
               name="pagoMensual"
               value={policyData.pagoMensual}
               onChange={handleChange}
               className="w-full mt-2 p-3 border rounded-xl bg-white"
             />
           </div>


           {/* Monto cobertura */}
           <div>
             <label className="font-semibold text-green-800">Monto de Cobertura</label>
             <input
               type="number"
               name="montoCobertura"
               value={policyData.montoCobertura}
               onChange={handleChange}
               className="w-full mt-2 p-3 border rounded-xl bg-white"
             />
           </div>


           {/* Duración */}
           <div>
             <label className="font-semibold text-green-800">Duración del Contrato</label>
             <input
               type="number"
               name="duracionContrato"
               value={policyData.duracionContrato}
               onChange={handleChange}
               className="w-full mt-2 p-3 border rounded-xl bg-white"
             />
           </div>


           {/* % Aprobación */}
           <div>
             <label className="font-semibold text-green-800">% Aprobación</label>
             <input
               type="number"
               name="porcentajeAprobacion"
               value={policyData.porcentajeAprobacion}
               onChange={handleChange}
               className="w-full mt-2 p-3 border rounded-xl bg-white"
             />
           </div>


           {/* Importe Cancelación */}
           <div>
             <label className="font-semibold text-green-800">Importe Cancelación</label>
             <input
               type="number"
               name="importeCancelacion"
               value={policyData.importeCancelacion}
               onChange={handleChange}
               className="w-full mt-2 p-3 border rounded-xl bg-white"
             />
           </div>


           {/* Estado */}
           <div>
             <label className="font-semibold text-green-800">Estado</label>
             <select
               name="estadoPoliza"
               value={policyData.estadoPoliza}
               onChange={handleChange}
               className="w-full mt-2 p-3 border rounded-xl bg-white"
             >
               <option value="">Seleccione</option>
               {policyStatusEnum.map((state) => (
                 <option key={state} value={state}>
                   {state}
                 </option>
               ))}
             </select>
           </div>


           {/* Descripción */}
           <div className="md:col-span-2">
             <label className="font-semibold text-green-800">Descripción</label>
             <textarea
               name="descripcion"
               value={policyData.descripcion}
               onChange={handleChange}
               rows="4"
               className="w-full mt-2 p-3 border rounded-xl bg-white"
             />
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
