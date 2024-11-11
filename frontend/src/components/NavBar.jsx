import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Restaurante
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/reserva" className="text-gray-600 hover:text-gray-900">
              Fazer Reserva
            </Link>
            <Link
              to="/buscar-reservas"
              className="text-gray-600 hover:text-gray-900"
            >
              Buscar Reservas
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
