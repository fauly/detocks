import React, { useState, useContext} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from './AuthContext';
import { FormContainer, AnimatedInput, AuthErrors} from './AuthComponents';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { transform } from 'typescript';

const Login: React.FC = () => {
  // #region Declares
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const { logIn } = useContext(AuthContext);
  // #endregion

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('/auth/login', { usernameOrEmail, password });
      localStorage.setItem('token', response.data.token);
      const user = { UID: response.data.UID } // Include id in user object
      logIn(user); // update the login state
      navigate('/');
    } catch (error: any) {
      if (error.response && error.response.status) {
        switch(error.response.status) {
          case 400: // Bad Request - usually means duplicate key or other validation errors
          case 409: // Conflict - usually means duplicate key
          case 422: // Unprocessable Entity - another common code for validation errors
            if (error.response.data.errors) {
              setErrors(error.response.data.errors);
            } else if (error.response.data.message) {
              setErrors([error.response.data.message]);
            }
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
    <>
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <AnimatedInput 
          type="text" 
          placeholder="Username or Email"
          name="usernameOrEmail"
          autoComplete="username"
          value={usernameOrEmail} 
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUsernameOrEmail(e.target.value)} 
          required 
          delay={200}
        /> 
        <AnimatedInput 
          type="password" 
          placeholder="Password"
          name="password"
          autoComplete="password"
          value={password} 
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)} 
          required 
          delay={400}
        />
        <div 
        style={{
          position: "relative", 
          width: '100%',
          display: 'flex',
          justifyContent: "center",
          }}> 
        <AnimatedInput 
          id="submitButton" 
          type="submit" 
          value="Login" 
          delay={600}
        />
        <AuthErrors errors={errors} isActive={errors.length > 0}/>
        </div>
        <span id="linkToOtherAuth"> 
          No account? <Link to="/register">Sign Up</Link> 
        </span>
      </form>
    </FormContainer>
    <ToastContainer />
    </>
  );
};

export default Login;
