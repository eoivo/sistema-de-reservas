import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow mt-6 md:mt-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
        Bem-vindo ao Nosso Restaurante
      </h1>
      <p className="text-gray-700 text-base md:text-lg mb-6 md:mb-8 text-center">
        Venha desfrutar de uma experiência gastronômica inesquecível! Reserve
        sua mesa com antecedência e garanta uma noite especial com nossos pratos
        únicos.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/reserva"
          className="bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors w-full sm:w-auto text-center"
        >
          Fazer Reserva
        </Link>
        <Link
          to="/admin"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
        >
          Entrar como Administrador
        </Link>
      </div>
    </div>
  );
}

export default Home;
