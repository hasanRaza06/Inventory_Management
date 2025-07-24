import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transactions from "./pages/Transactions";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkAuth); // listens to storage changes
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isAuth ? "/dashboard" : "/login"} />}
          />
          <Route
            path="/login"
            element={<Login onAuth={() => setIsAuth(true)} />}
          />
          <Route
            path="/register"
            element={<Register onAuth={() => setIsAuth(true)} />}
          />
          <Route
            path="/dashboard"
            element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/transactions"
            element={isAuth ? <Transactions /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
