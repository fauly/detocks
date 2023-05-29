import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../components/auth/AuthContext';
import SendBox from '../components/chat/SendBox';
import ChatWorld from '../components/chat/ChatWorld';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/register');
    }
  }, [isLoggedIn, navigate]);


  return (
    <>
    <div className="home">
      Welcome to Detocks!
    </div>
    <button onClick={() => navigate('/logout')}>Logout</button>
    <SendBox />
    <ChatWorld data={[]}/>
    </>
  );
};

export default Home;
