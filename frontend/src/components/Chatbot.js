import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import logo from '../logo.svg'; // Import your logo

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newMessages = [...messages, { text: inputValue, sender: 'user' }];
    setMessages(newMessages);
    setInputValue('');

    try {
      const response = await fetch('http://localhost:5000/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();
      const botMessage = { text: data.response, sender: 'bot' };
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: 'Error connecting to the server.', sender: 'bot' };
      setMessages([...newMessages, errorMessage]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className={`chatbot-bubble ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        {isOpen ? 'X' : <img src={logo} alt="Chatbot Logo" />}
      </div>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <img src={logo} alt="Chatbot Logo" className="chatbot-logo" />
            <h3>Chatbot</h3>
          </div>
          <div className="chatbot-body" ref={chatBodyRef}>
            <div className="message bot">
              <p>Hello! How can I help you today?</p>
            </div>
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;