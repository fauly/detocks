import React, { useState, useContext, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from './AuthContext';
import styled from 'styled-components';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Tone from 'tone';

const FormContainer = styled.div`
    height : 100vh;
    width : 100vw;
    display : flex;
    flex-direction : column;
    justify-content : center;
    gap : 1rem;
    align-items : center;
    background: linear-gradient(90deg, rgba(182,215,255,1) 0%, rgba(236,200,255,1) 25%, rgba(255,208,238,1) 50%, rgba(236,200,255,1) 75%, rgba(182,215,255,1) 100%);
    background-size: 300% 300%;
    animation: Gradient 60s linear infinite;

    @keyframes Gradient {
      0% {
        background-position: 300% 0%
      }
      100% {
        background-position: -300% 0%
      }
    }

    h2 {
      text-align: center;
      text-transform: uppercase;
      font-weight: 700;
      font-size: 2.2rem;
      color: #70A0AF;
      letter-spacing: 0.5rem;
      text-shadow: 0px 0px 8px #33006659;
    }

    form {
      display:flex;
      flex-direction : column;
      gap: 2rem;
      background-color: #331E3899;
      border-radius: 1rem;
      padding: 2.5rem 3rem;
      align-items: center;
      backdrop-filter: blur(10px);
      box-shadow: 0px 0px 40px #b356f5;
      animation: fade-in 1.5s ease-in-out forwards;
      opacity: 0;

      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(30%);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      } 
        }
      
    input {
      background-color: #00000033;
      padding: 1rem;
      border:0.1rem solid #70A0AF;
      border-radius:  0.5rem;
      width: 100%;
      font-size: 1rem;
      color: #70A0AF;
      transition: all 0.3s ease-in-out;

      &:focus {
        border : 0.1rem solid #A0C1B9;
        border-radius: 1rem;
        outline:none;
      }
    }

    ::placeholder
    {
      color: #a3b9c099;
      font-style: italic;
      font-weight: lighter;
      letter-spacing: .05rem;
      font-size: .8rem;
    }

    #submitButton {
      background-color: #70A0AF77;
      width: 80%;
      color:white;
      padding: 1rem 2rem;
      border:0;
      font-weight: bold;
      border-radius: 0.4rem;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      text-transform: uppercase;
      letter-spacing: 0.2rem;
      &:hover {
        background-color: #997af044;
        border-radius: 0.8rem;
        letter-spacing: 0.3rem;
        width: 100%;
      }
    }

    #needToLogin {
      color:white;
      text-transform: uppercase;

      animation: fade-in 0.8s ease-in-out forwards;
      animation-delay: 1500ms;
      
      opacity: 0;

      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(100%);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      a {
        color:  #4e0eff;
        text-decoration: none;
      }
  `;

const UsernameAvaliable = styled.span<{ isTypingUsername: boolean }>` 
  position: absolute;
  top:50%;
  right: 5%;
  z-index: 999;
  transform: translateY(-50%);
  font-weight: 900;
  font-size: 1.5rem;
  background: #0003;
  border-radius: 0.7rem;
  width: 2.2rem;
  height: 2.2rem;
  text-align: center;
  padding-top:  0.1rem;
  vertical-align: top;
  display: inline;
  opacity: 0.3;
  animation: ${props => props.isTypingUsername ? 'fadein 0.5s forwards' : 'blur 0.6s forwards'};

  @keyframes fadein {
    from { opacity: 0.3; transform: translateY(-50%) scaleX(1); }
    to { opacity: 1; transform: translateY(-50%) scaleX(1); }
  }

  @keyframes blur {
    from { opacity: 1; transform: translateY(-50%) scaleX(1) }
    to { opacity: 0.3; transform: translateY(-50%) scaleX(1) }
  }
  `
  const PasswordsMatch= styled.span<{ isTypingConfirmPassword: boolean }>` 
  position: absolute;
  top:50%;
  right: 5%;
  z-index: 999;
  transform: translateY(-50%);
  font-weight: 900;
  font-size: 1.5rem;
  background: #0003;
  border-radius: 0.7rem;
  width: 2.2rem;
  height: 2.2rem;
  text-align: center;
  padding-top:  0.1rem;
  vertical-align: top;
  display: inline;
  opacity: 0.3;
  animation: ${props => props.isTypingConfirmPassword ? 'fadein 0.5s forwards' : 'blur 0.6s forwards'};

  @keyframes fadein {
    from { opacity: 0.3; transform: translateY(-50%) scaleX(1); }
    to { opacity: 1; transform: translateY(-50%) scaleX(1); }
  }

  @keyframes blur {
    from { opacity: 1; transform: translateY(-50%) scaleX(1) }
    to { opacity: 0.3; transform: translateY(-50%) scaleX(1) }
  }
  `

  
const AnimatedInput = styled.input<{ delay: number }>`
  /* ...other CSS styles... */

  animation: fade-in 0.8s ease-in-out forwards;
  animation-delay: ${props => props.delay}ms;
  
  opacity: 0;

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Register: React.FC = () => {

  const navigate = useNavigate();    

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isAvailable, setIsAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTypingUsername, setIsTypingUsername] = useState(false);

  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [isTypingConfirmPassword, setIsTypingConfirmPassword] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);

  const inputAnimationDelays = [400,  600, 800, 1000, 1200];
  
  const { logIn } = useContext(AuthContext);

  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setPasswordErrors({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*#?&]/.test(password),
    });
  }, [password]);

  // const chords = [
  //   // 8 characters
  //   ['C4', 'E4', 'G4', 'B4', 'C5', 'E5', 'G5', 'B5'],
  //   // 9 characters
  //   ['D4', 'F4', 'A4', 'C5', 'D5', 'F5', 'A5', 'C6', 'D6'],
  //   // 10 characters
  //   ['E4', 'G4', 'B4', 'D5', 'E5', 'G5', 'B5', 'D6', 'E6', 'G6'],
  //   // 11 characters
  //   ['F4', 'A4', 'C5', 'E5', 'F5', 'A5', 'C6', 'E6', 'F6', 'A6', 'C7'],
  //   // 12 characters
  //   ['G4', 'B4', 'D5', 'F5', 'G5', 'B5', 'D6', 'F6', 'G6', 'B6', 'D7', 'F7'],
  //   // 13 characters
  //   ['A4', 'C5', 'E5', 'G5', 'A5', 'C6', 'E6', 'G6', 'A6', 'C7', 'E7', 'G7', 'A7'],
  //   // 14 characters
  //   ['B4', 'D5', 'F5', 'A5', 'B5', 'D6', 'F6', 'A6', 'B6', 'D7', 'F7', 'A7', 'B7', 'D8'],
  //   // 15 characters
  //   ['C5', 'E5', 'G5', 'B5', 'D6', 'F6', 'A6', 'C7', 'E7', 'G7', 'B7', 'D8', 'F8', 'A8', 'C9'],
  //   // 16 characters
  //   ['D3', 'F3', 'A3', 'C4', 'E4', 'G4', 'B4', 'D5', 'F5', 'A5', 'C6', 'E6', 'G6', 'B7', 'D7', 'F7']
  // ];

  // const wrongChord = ['D4', 'F4', 'A4'];

  // const synth = new Tone.AMSynth().toDestination();
  // Tone.start(); // This line is needed to start the audio context

  // synth.harmonicity.value = 5;

  // let noteQueue : any[] = [];

  // const playNote = (password: string, confirmPassword: string) => {
  //   // Empty the queue
  //   noteQueue = [];

  //   if (confirmPassword.length === password.length && confirmPassword === password) {
  //     chords[password.length - 8].forEach((note, i) => {
  //       // Add to queue instead of triggering immediately
  //       noteQueue.push({note: note, time: Tone.now() + i * 0.05});
  //     });
  //   } else {
  //     for (let i = 0; i < confirmPassword.length; i++) {
  //       if (confirmPassword[i] === password[i]) {
  //         noteQueue.push({note: chords[password.length - 8][confirmPassword.length - 1], time: Tone.now() + i * 0.05});
  //       } else {
  //         noteQueue.push({note: wrongChord[i % wrongChord.length], time: Tone.now() + i * 0.05});
  //       }
  //     };
  //   };

  //   // Process the queue
  //   processQueue();
  // };

  // // Process the note queue
  // const processQueue = () => {
  //   while(noteQueue.length > 0) {
  //     const {note, time} = noteQueue.shift();
  //     if(time <= Tone.now()) {
  //       synth.triggerAttackRelease(note, '8n');
  //     } else {
  //       // If the note is scheduled for the future, put it back in the queue and break the loop
  //       noteQueue.unshift({note, time});
  //       break;
  //     }
  //   }

  //   // If there are still notes left in the queue, schedule the next check
  //   if(noteQueue.length > 0) {
  //     Tone.Transport.scheduleOnce(() => {
  //       processQueue();
  //     }, noteQueue[0].time);
  //   }
  // };
  
  const handlePasswordChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredPassword = event.target.value;
    setPassword(enteredPassword);
  };

  const handleConfirmPasswordChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredConfirmPassword = event.target.value;
    setConfirmPassword(enteredConfirmPassword);
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
        toast.error("Passwords don't match", {
          position: "top-center",
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }); 
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

  return (
    <>
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div style={{
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
          style={{position: "relative", display: "inline-block", width: "100%"}}
        /> 
        <UsernameAvaliable isTypingUsername={isTypingUsername}>
          {isLoading && <span style={{color: "#773"}}>...</span>}
          {isAvailable === true && !isLoading && <span style={{color: "#4f9c4f"}}>✓</span>}
          {isAvailable === false && !isLoading && <span style={{color: "#b86b6b"}}>✕</span>}
        </UsernameAvaliable>
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
          width: '100%'
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
        <ul style={{
          listStyle: "none", 
          padding: '5px',
          borderRadius: '5px',
          boxShadow: '0px 0px 5px 0px #ccc',
          backdropFilter: 'blur(50px)',
          position: 'absolute',
          left: '0',
          top: '110%',
          backgroundColor: '#18121d63',
          color: "#fff",
          width: '100%',
          zIndex: 999,
          fontSize: '0.8rem',
          fontWeight: '500',
          opacity: isTypingPassword ? '1' : '0',
          transition: 'opacity 0.3s ease-in-out',
        }} 
        >
        <li>
          {passwordErrors.length ? '✅' : '❌'} At least 8 characters long
        </li>
        <li>
          {passwordErrors.uppercase ? '✅' : '❌'} Contains an uppercase letter
        </li>
        <li>
          {passwordErrors.lowercase ? '✅' : '❌'} Contains a lowercase letter
        </li>
        <li>
          {passwordErrors.number ? '✅' : '❌'} Contains a number
        </li>
        <li>
          {passwordErrors.special ? '✅' : '❌'} Contains a special character '@$!%*#?&'
        </li>
        </ul>
        </div>
        <div style={{
          position: "relative", 
          width: '100%'}}>
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
          style={{position: "relative", display: "inline-block", width: "100%"}}
        />
        <PasswordsMatch isTypingConfirmPassword={isTypingConfirmPassword}>
          {doPasswordsMatch === true && <span style={{color: "#4f9c4f"}}>✓</span>}
          {doPasswordsMatch === false && <span style={{color: "#b86b6b"}}>✕</span>}
        </PasswordsMatch>
        </div>
        <AnimatedInput id="submitButton" type="submit" value="Register" delay={inputAnimationDelays[4]}/>
        <span id="needToLogin"> 
          Already have an account? <Link to="/login">Login</Link> 
        </span>

      </ form>
    </ FormContainer>
    <ToastContainer />
    </>
  );
};

export default Register;