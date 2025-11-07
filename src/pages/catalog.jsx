export default function Catalog() {
  const policies = [
    {
      id: 1,
      name: "Seguro de Vida Familiar",
      description: "Protege a tu familia ante cualquier eventualidad con cobertura completa.",
      price: "$30/mes",
      image: "https://cdn-icons-png.flaticon.com/512/1048/1048945.png",
    },
    {
      id: 2,
      name: "Seguro Vehicular",
      description: "Cobertura contra accidentes, robos y daños a terceros.",
      price: "$45/mes",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    {
      id: 3,
      name: "Seguro Médico Integral",
      description: "Acceso a hospitales y clínicas con atención prioritaria.",
      price: "$60/mes",
      image: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-white to-green-100 flex flex-col items-center p-10">
      <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
        Catálogo de Pólizas
      </h1>
      <p className="text-gray-600 text-lg mb-10 max-w-2xl text-center">
        Explora las opciones disponibles y elige la póliza que mejor se adapte a tus necesidades.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="bg-white/70 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
          >
            <img
              src={policy.image}
              alt={policy.name}
              className="w-24 h-24 mb-4"
            />
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              {policy.name}
            </h2>
            <p className="text-gray-600 text-center mb-4">{policy.description}</p>
            <p className="text-green-800 font-semibold text-lg mb-4">
              {policy.price}
            </p>
            <button className="!bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md">
              Solicitar
            </button>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-gray-500 text-sm">
        © 2025 MiSeguroDigital — Tu confianza, nuestra prioridad.
      </footer>
    </div>
  );
}
