// #region Imports
import React, { useState, useContext, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from './AuthContext';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormContainer, PasswordRequirements, AnimatedInput, FieldValid } from './AuthComponents';
// #endregion

const Register: React.FC = () => {

  // #region Declerations
  const navigate = useNavigate();    

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTypingUsername, setIsTypingUsername] = useState(false);

  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [isTypingConfirmPassword, setIsTypingConfirmPassword] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);

  const inputAnimationDelays = [400, 600, 800, 1000, 1200];
  
  const { logIn } = useContext(AuthContext);

  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  // #endregion

  useEffect(() => {
    setPasswordErrors({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*#?&]/.test(password),
    });
  }, [password]);

  // #region Handles
  const handlePasswordChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredPassword = event.target.value;
    setPassword(enteredPassword);
  };

  const handleConfirmPasswordChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredConfirmPassword = event.target.value;
    setConfirmPassword(enteredConfirmPassword);
    if(enteredConfirmPassword === password) {
      setDoPasswordsMatch(true);
    } else {setDoPasswordsMatch(false);};
  };

  const handleUsernameChange = async (event : React.ChangeEvent<HTMLInputElement>) => {
    const enteredUsername = event.target.value;

    setUsername(enteredUsername);
    setIsLoading(true);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    setDebounceTimer(setTimeout(async () => {
      try {
        const response = await axios.get(`/api/check-username?username=${enteredUsername}`);
        setIsAvailable(response.data.isAvailable);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 200)); // 200ms delay
  };

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if(password!==confirmPassword) { 
        return;
      }

      try {
        const response = await axios.post('/auth/register', {
          username,
          email,
          password,
        });

        localStorage.setItem('token', response.data.token);
        const user = { username, email };
        logIn(user); // update the login state
        navigate('/'); // navigate to home after successful registration

      } 
      
      catch (error: any) 
      
      {
        if (error.response && error.response.status) {
          switch(error.response.status) {
            case 400: // Bad Request - usually means duplicate key or other validation errors
            case 409: // Conflict - usually means duplicate key
            case 422: // Unprocessable Entity - another common code for validation errors
              if (error.response.data.errors) {
                toast.error(error.response.data.errors[0], {
                  position: "top-center",
                  autoClose: 5000,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "light",
                });
              } else if (error.response.data.message) {
                toast.error(error.response.data.message, {
                  position: "top-center",
                  autoClose: 5000,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "light",
                });
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
  // #endregion

  return (
    <>
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div 
        style={{
          position: "relative", 
          width: '100%'
          }}> 
        <AnimatedInput 
          type="text" 
          placeholder="Username"
          name="username"
          autoComplete='Username'
          value={username} 
          onFocus={() => setIsTypingUsername(true)}
          onBlur={() => setIsTypingUsername(false)}
          onChange={handleUsernameChange} 
          required 
          delay={inputAnimationDelays[0]}
         /> 
        <FieldValid isActive={isTypingUsername} isValid={isAvailable} isLoading={isLoading} />
        </div>
        <AnimatedInput 
          type="email" 
          placeholder="Email"
          name="email"
          autoComplete='Email'
          value={email} 
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)} 
          required 
          delay={inputAnimationDelays[1]}
        />
        <div style={{
          position: "relative", 
          width: '100%',
        }
        }>
        <AnimatedInput 
          type="password" 
          placeholder="Password"
          name="password"
          value={password}
          onFocus={() => setIsTypingPassword(true)}
          onBlur={() => setIsTypingPassword(false)}
          onChange={handlePasswordChange} 
          required 
          delay={inputAnimationDelays[2]}
        />
        <PasswordRequirements isActive={isTypingPassword} passwordErrors={passwordErrors} />
        </div>
        <div 
        style={{
          position: "relative", 
          width: '100%',
          animation:'someFadeIn 0.5s forwards',
          animationDelay: '1.5s',
          opacity: 0,
        }}
          >
        <AnimatedInput
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onFocus={() => setIsTypingConfirmPassword(true)}
          onBlur={() => setIsTypingConfirmPassword(false)}
          onChange={handleConfirmPasswordChange}
          required
          delay={inputAnimationDelays[3]}
        />
        <FieldValid isActive={isTypingConfirmPassword} isValid={doPasswordsMatch} />
        </div>
        <AnimatedInput 
          id="submitButton" 
          type="submit" 
          value="Register" 
          delay={inputAnimationDelays[4]}
        />
        <span id="linkToOtherAuth"> 
          Already have an account? <Link to="/login">Login</Link> 
        </span>

      </ form>
    </ FormContainer>
    <ToastContainer />
    </>
  );
};

export default Register;