/*
 * ===============================
 * Imports!
 * ===============================
 */
import styled from  'styled-components';
import React from 'react';

/*
 * ===============================
 * All Stylings of Components
 * ===============================
 * Here to contain the entire AuthForm - fills screen with repeating gradient.
 */

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
      text-shadow: 1px 1px #000, 1.5px 1px #000, 1px 1.5px #000, 1.5px 1.5px #000, 0px 0px 3px #33006659;
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
      text-shadow: 1px 1px #000;
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

    #linkToOtherAuth {
      color:white;
      text-transform: uppercase;
      text-shadow: 1px 1px #000;

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

const AnimatedInput = styled.input<{ delay: number }>`
  position: "relative";
  display: "inline-block";
  width: "100%";
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

/*
 * ===============================
 * FieldValid Component
 * ===============================
 */

const FieldValidStyle = styled.span<{ isActive: boolean }>` 
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
  animation: ${props => props.isActive ? 'fadein 0.5s forwards' : 'blur 0.6s forwards'};
  
  @keyframes fadein {
      from { opacity: 0.3;}
      to { opacity: 1; }
    }
    
  @keyframes blur {
    from { opacity: 1;}
    to { opacity: 0.3;}
  }
  `
  interface FieldValidProps {
      isActive: boolean;
      isLoading?: boolean | undefined;
      isValid?: boolean | null;
  }

const FieldValid: React.FC<FieldValidProps> = ({ isActive, isLoading=undefined, isValid=null }) => {
    return (
      <FieldValidStyle isActive={isActive}>
        {isLoading !== undefined && isLoading && <span style={{ color: "#773" }}>...</span>}
        {isValid === true && (!isLoading || isLoading === undefined) && <span style={{ color: "#4f9c4f" }}>✓</span>}
        {isValid === false && (!isLoading || isLoading === undefined) && <span style={{ color: "#b86b6b" }}>✕</span>}
      </FieldValidStyle>
    );
};

/*
 * ===============================
 * Password Requirement Component
 * ===============================
 */

const PasswordRequirementsStyled = styled.ul<{isActive: boolean}>`
  list-style: none;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px #ccc;
  backdrop-filter: blur(50px);
  position: absolute;
  left: 0;
  top: 110%;
  background-color: #18121d63;
  color: #fff;
  width: 100%;
  z-index: 999;
  font-size: 0.8rem;
  font-weight: 500;
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => props.isActive ? '1' : '0'};
  transition: 'opacity 0.3s ease-in-out';
  pointer-events: ${props => props.isActive ? 'all' : 'none'};
  `

  interface PasswordReqProps {
    isActive: boolean, 
    passwordErrors: {
      uppercase: boolean,
      lowercase: boolean,
      number: boolean,
      special: boolean,
      length: boolean
    }
  }

  const PasswordRequirements: React.FC<PasswordReqProps> = ({passwordErrors, isActive = false}) => {
    return (
        <PasswordRequirementsStyled isActive={isActive}>
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
        </PasswordRequirementsStyled>
    )
  };

  const AuthErrorsStyled = styled.ul<{isActive: boolean}>`
  list-style: none;
  padding: 5px;
  border-radius: 10px;
  text-shadow:  1px 1px #000, 1.5px 1px #000, 1px 1.5px #000, 1.5px 1.5px #000;
  position: absolute;
  left: 0;
  top: -55%;
  color: #fff;
  width: 100%;
  z-index: 999;
  font-size: 0.8rem;
  font-weight: 500;
  font-style: italic;
  text-align: center;
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => props.isActive ? '1' : '0'};
  pointer-events: ${props => props.isActive ? 'all' : 'none'};
  `

  interface AuthErrorProps {
    isActive: boolean;
    errors: string[];
  }

  const AuthErrors: React.FC<AuthErrorProps> = ({errors, isActive = false}) => {
    return (
        <AuthErrorsStyled isActive={isActive}>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </AuthErrorsStyled>

    )
  };

/*
 * ===============================
 * Exports!
 * ===============================
 * 
 * and out the door with you...!
 */

export { FormContainer, FieldValid, PasswordRequirements, AnimatedInput, AuthErrors};