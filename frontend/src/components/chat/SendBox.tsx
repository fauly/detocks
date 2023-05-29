import React, {useState} from 'react';
import styled from 'styled-components';
import axios from 'axios';

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
  
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
      event.preventDefault();
    
      try {
        // Send the message to the server
        const response = await axios.post('/chat/messages', {
          username: 'username',
          UserUID: 'uniqueID',
          content:  message,
        });
    
        // Handle the server's response
        if (response.status === 200) {
          console.log('Message sent successfully');
          // Update the UI to show that the message was sent successfully
        } else {
          console.error('Failed to send message:', response.status);
          // Update the UI to show an error message
        }
    
        // Clear the input field
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
        // Update the UI to show an error message
      }
    };
  
    return (
      <SendBoxContainer>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type your message here"
          />
          <button type="submit">Send</button>
        </form>
      </SendBoxContainer>
    );
  };
  
export default SendBox;