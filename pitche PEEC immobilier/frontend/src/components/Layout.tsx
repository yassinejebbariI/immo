import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, Building2, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'agency':
        return '/agency/dashboard';
      case 'client':
        return '/client/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl">
                <Building2 size={28} />
                <span>PEEC Platform</span>
              </Link>
              <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary">
                <Home size={18} />
                <span>Accueil</span>
              </Link>
              <Link to="/properties" className="text-gray-700 hover:text-primary">
                Annonces
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">Bonjour, {user.full_name}</span>
                  {getDashboardLink() && (
                    <Link to={getDashboardLink()!} className="flex items-center space-x-1 text-gray-700 hover:text-primary">
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center space-x-1 text-gray-700 hover:text-red-600">
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-primary">
                    <LogIn size={18} />
                    <span>Connexion</span>
                  </Link>
                  <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p>&copy; 2024 PEEC Platform. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
