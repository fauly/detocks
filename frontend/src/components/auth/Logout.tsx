import React, { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import axios from 'axios';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { logOut } = useContext(AuthContext);

  useEffect(() => {
    async function logout() {
      await axios.get('/auth/logout').then(() => {
        logOut(); // Call the logOut function from AuthContext
        navigate('/');
      });
    }
    logout();
  });

  return (
    <div>
      Logging out...
    </div>
  );
}

export default Logout;
