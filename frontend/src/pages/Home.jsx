import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Bem-vindo ao Nosso Restaurante
      </h1>
      <p className="text-gray-700 text-lg mb-8">
        Venha desfrutar de uma experiência gastronômica inesquecível! Reserve
        sua mesa com antecedência e garanta uma noite especial com nossos pratos
        únicos.
      </p>
      <div className="text-center">
        <Link
          to="/reserva"
          className="bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors mr-4"
        >
          Fazer Reserva
        </Link>
        <Link
          to="/admin"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Entrar como Administrador
        </Link>
      </div>
    </div>
  );
}

export default Home;
