import React, {useState} from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

const reactServer = process.env.REACT_SERVER || 'https://localhost:5000';

const socket = io(reactServer);

const SendBoxContainer = styled.div`
    display: flex;
    width: 100%;
    height: 50px;
    bottom: 0;
    position: absolute;
    background-color: #fff;
    border-top: 1px solid #e0e0e0;
    padding: 0 10px;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    input {
        width: 80%;
        height: 100%;
    }        
`

const SendBox = () => {
    const [message, setMessage] = useState('');
  
    const sendMessage = (event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
  
      if (message) {
        socket.emit('sendMessage', message, () => setMessage(''));
      }
    };
  
    return (
      <SendBoxContainer>
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => (event.key === 'Enter' ? sendMessage(event) : null)}
        />
        <button onClick={(event) => sendMessage(event)}>Send</button>
      </SendBoxContainer>
    );
  };
  
export default SendBox;