import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import ReservaForm from "./pages/ReservaForm";
import Admin from "./pages/Admin";
import BuscarReservas from "./pages/BuscarReservas";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import backgroundImage from "../public/restaurant-background.jpg";

function App() {
  return (
    <Router>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Toaster position="top-right" />
        <NavBar />
        <main className="container mx-auto px-4 py-8 bg-transparent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reserva" element={<ReservaForm />} />
            <Route path="/buscar-reservas" element={<BuscarReservas />} />
            <Route path="/admin" element={<Admin />} />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
