import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleChatbot = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div>
            <button className="chatbot-toggle" onClick={toggleChatbot}>
                {isVisible ? 'Hide Chatbot' : 'Open Chatbot'}
            </button>
            {isVisible && (
                <div className="chatbot-container">
                    <iframe 
                        // src="https://eqai-dev.equitable.com" 
                        src="http://localhost:5001"
                        title="Chatbot" 
                        className="chatbot-iframe"
                        allow="microphone;"
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
