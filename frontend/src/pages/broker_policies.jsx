import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function BrokerPolicies() {
 const navigate = useNavigate();
 const [policies, setPolicies] = useState([]);
 const [loading, setLoading] = useState(true);
 const [message, setMessage] = useState("");


 useEffect(() => {
   const fetchPolicies = async () => {
     try {
       console.log("📡 Fetching policies...");


       const res = await fetch(
         "http://localhost:33761/api/polizas/catalogo-completo"
       );


       const raw = await res.text();
       console.log("📌 RAW RESPONSE:", raw);


       let data = {};
       try {
         data = JSON.parse(raw);
       } catch (err) {
         console.error("❌ Error parseando JSON:", err);
         setMessage("Error leyendo datos del servidor.");
         return;
       }


       if (!res.ok || !data.success) {
         console.error("❌ ERROR DESDE API:", data);
         setMessage(data.message || "No se pudieron cargar las pólizas");
         return;
       }


       setPolicies(data.polizas || []);
     } catch (err) {
       console.error("❌ ERROR DE CONEXIÓN:", err);
       setMessage("No se pudo conectar con la API.");
     } finally {
       setLoading(false);
     }
   };


   fetchPolicies();
 }, []);


 // =======================================================
 // 🔥 ELIMINAR PÓLIZA
 // =======================================================
 const handleDelete = async (policyId) => {
   const brokerId = Number(localStorage.getItem("userId"));


   if (!brokerId || brokerId <= 0) {
     alert("❌ No se encontró brokerId en sesión. No puedes eliminar.");
     return;
   }


   // Confirmación visual
   const confirmDelete = window.confirm(
     "¿Seguro que deseas eliminar esta póliza? Esta acción no se puede deshacer."
   );


   if (!confirmDelete) return;


   try {
     console.log("🗑 Eliminando póliza:", policyId);


     const res = await fetch(
       `http://localhost:33761/api/polizas/admin/eliminar-poliza/${policyId}`,
       {
         method: "DELETE",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ brokerId }),
       }
     );


     const raw = await res.text();
     console.log("📌 RAW DELETE RESPONSE:", raw);


     let data = {};
     try {
       data = JSON.parse(raw);
     } catch (err) {
       console.error("❌ Error parseando JSON al eliminar", err);
       alert("Error procesando respuesta del servidor.");
       return;
     }


     if (!res.ok || !data.success) {
       console.error("❌ ERROR DESDE API:", data);
       alert(`Error: ${data.message}`);
       return;
     }


     alert("✅ Póliza eliminada correctamente");


     // Remover del estado sin recargar la página
     setPolicies((prev) => prev.filter((p) => p.id_poliza !== policyId));


   } catch (err) {
     console.error("❌ ERROR DE CONEXIÓN:", err);
     alert("No se pudo conectar con la API.");
   }
 };


 // =======================================================


 if (loading) {
   return (
     <div className="min-h-screen flex items-center justify-center text-green-700 text-xl">
       Cargando pólizas...
     </div>
   );
 }


 if (!loading && message) {
   return (
     <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
       {message}
     </div>
   );
 }


 return (
   <div
     className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
     style={{
       backgroundImage:
         "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80')",
     }}
   >
     <div className="bg-white/70 flex flex-col min-h-screen backdrop-blur-sm">
      
       {/* HEADER */}
       <header className="flex justify-between items-center px-8 py-4 text-green-700 font-semibold">
         <div className="text-xl">MiSeguroDigital</div>
       </header>


       {/* CONTENIDO */}
       <div className="max-w-5xl w-full bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-sm justify-center mx-auto my-10 flex-1">
        
         <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
           Gestión de Pólizas
         </h1>


         <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto text-center">
           Aquí puedes revisar, editar o eliminar las pólizas que ofrece el broker.
         </p>


         {/* TABLA */}
         <div className="overflow-auto max-h-[500px]">
           <table className="w-full text-left border-collapse">
             <thead className="sticky top-0 bg-white">
               <tr className="border-b-2 border-green-200">
                 <th className="py-3 px-4 text-green-800 text-lg">Nombre</th>
                 <th className="py-3 px-4 text-green-800 text-lg">Cobertura</th>
                 <th className="py-3 px-4 text-green-800 text-lg">Precio</th>
                 <th className="py-3 px-4 text-green-800 text-lg">Estado</th>
                 <th className="py-3 px-4 text-green-800 text-lg text-center">
                   Acciones
                 </th>
               </tr>
             </thead>


             <tbody>
               {policies.map((policy) => (
                 <tr
                   key={policy.id_poliza}
                   className="border-b border-gray-200 hover:bg-green-50 transition"
                 >
                   <td className="py-3 px-4 font-semibold">
                     {policy.nombre_poliza}
                   </td>


                   <td className="py-3 px-4">
                     {policy.descripcion.slice(0, 60)}...
                   </td>


                   <td className="py-3 px-4">${policy.pago_mensual}</td>


                   <td className="py-3 px-4 capitalize">
                     {policy.estado_de_la_poliza}
                   </td>


                   <td className="py-3 px-4 flex justify-center gap-3">
                    
                     {/* EDITAR */}
                     <button
                       onClick={() =>
                         navigate(`/broker_edit_policy/${policy.id_poliza}`)
                       }
                       className="!bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                     >
                       Editar
                     </button>


                     {/* ELIMINAR */}
                     <button
                       onClick={() => handleDelete(policy.id_poliza)}
                       className="!bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                     >
                       Eliminar
                     </button>


                   </td>
                 </tr>
               ))}
             </tbody>


           </table>
         </div>
       </div>


       {/* FOOTER */}
       <footer className="py-6 text-gray-500 text-sm text-center">
         © 2025 MiSeguroDigital — Panel del Administrador.
       </footer>


     </div>
   </div>
 );
}
