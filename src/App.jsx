import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import TravelPlan from "./pages/TravelPlan";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import MyTrips from "./pages/MyTrips";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/destinations" element={<ProtectedRoute><Destinations /></ProtectedRoute>} />
          <Route path="/my-trips" element={<ProtectedRoute> <MyTrips /></ProtectedRoute> }/>
          <Route path="/travel-plan" element={<ProtectedRoute><TravelPlan /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
