import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import  Register from './Register';
import Logout from './Logout';
import { AuthProvider } from './AuthContext';

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
