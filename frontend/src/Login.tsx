import React, { useState, useContext} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const { logIn } = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('/login', { usernameOrEmail, password });
      localStorage.setItem('token', response.data.token);
      const user = { id: response.data.id, usernameOrEmail: usernameOrEmail } // Include id in user object
      logIn(user); // update the login state
      navigate('/');
    } catch (error: any) {
      if (error.response && error.response.status === 400 && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {errors && errors.length > 0 && (
        <div>
          <p>Errors:</p>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Username or Email:
          <input type="string" value={usernameOrEmail} onChange={e => setUsernameOrEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <button onClick={() => navigate('/register')}>No account? Sign Up</button>
    </div>
  );
};

export default Login;
