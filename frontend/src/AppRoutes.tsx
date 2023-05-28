import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/auth/Login';
import  Register from './components/auth/Register';
import Logout from './components/auth/Logout';
import { AuthProvider } from './components/auth/AuthContext';

const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
          </Routes>
        </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
