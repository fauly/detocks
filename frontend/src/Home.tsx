import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/register');
    }
  }, [isLoggedIn, navigate]);


  return (
    <div className="home">
      Welcome to Detocks!
    </div>
  );
};

export default Home;
