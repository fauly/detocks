import styled from  'styled-components';
import React from 'react';

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
    from { opacity: 0.3;}
    to { opacity: 1; }
  }

  @keyframes blur {
    from { opacity: 1;}
    to { opacity: 0.3;}
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
    from { opacity: 0.3;}
    to { opacity: 1;}
  }

  @keyframes blur {
    from { opacity: 1;}
    to { opacity: 0.3;}
  }
  `
const PasswordRequirements = styled.ul<{isTypingPassword: boolean}>`
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
  opacity: ${props => props.isTypingPassword ? '1' : '0'};
  transition: 'opacity 0.3s ease-in-out';
  pointer-events: ${props => props.isTypingPassword ? 'all' : 'none'};
  `
  
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

export { FormContainer, UsernameAvaliable, PasswordsMatch, PasswordRequirements, AnimatedInput };