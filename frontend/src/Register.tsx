import React, { useState, useContext} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const Register: React.FC = () => {

  const navigate = useNavigate();    

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]); // State to hold the validation errors
  
  const { logIn } = useContext(AuthContext);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      try {
        const response = await axios.post('/register', {
          username,
          email,
          password,
        });
        localStorage.setItem('token', response.data.token);
        const user = { username, email };
        logIn(user); // update the login state
        navigate('/'); // navigate to home after successful registration
      } catch (error: any) {
        if (error.response && error.response.status) {
            switch(error.response.status) {
                case 400: // Bad Request - usually means duplicate key or other validation errors
                case 409: // Conflict - usually means duplicate key
                case 422: // Unprocessable Entity - another common code for validation errors
                    setErrors(error.response.data.errors); // Assuming the error message is in `data.message`
                    break;
                default:
                    console.error(error);
            }
        } else {
            console.error(error);
        }
    }
    };

  return (
    <div>
      <h2>Register</h2>
      {errors.length > 0 && (
        <div>
          <h4>Validation Errors:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>
            Username:
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <input type="submit" value="Register" />
      </form>
      <button onClick={() => navigate('/login')}>Back to Login</button>
    </div>
  );
};

export default Register;