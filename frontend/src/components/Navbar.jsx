import { useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center border-b border-gray-200">
      <h1 className="text-xl font-bold text-blue-700">Inventory Management System</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-800 font-medium hidden sm:inline">User</span>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 text-lg"
          title="Logout"
        >
          <FiLogOut />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;