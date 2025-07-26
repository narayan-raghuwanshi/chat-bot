import React, { useState, useEffect, useRef } from 'react';

// Main App Component
function App() {
  // State for current chat messages
  const [messages, setMessages] = useState([]);
  // State for user input in the chat box
  const [userInput, setUserInput] = useState('');
  // State to indicate if the AI is currently processing a response
  const [isLoading, setIsLoading] = useState(false);
  // Ref to scroll to the bottom of the chat window
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the messages whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handles sending a message to the AI
  const sendMessage = async () => {
    if (userInput.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      // Calling your Node.js backend
      const backendApiUrl = 'http://localhost:5000/api/chat'; // Ensure this matches your backend's port and route

      // The backend expects 'messages' array
      const payload = {
        messages: newMessages,
      };

      const response = await fetch(backendApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown backend error' }));
        throw new Error(`Backend Error! Status: ${response.status}, Details: ${errorData.details || errorData.error || response.statusText}`);
      }

      const result = await response.json();

      let aiResponseText = "Sorry, I couldn't get a response from the AI.";
      if (result.response) {
        aiResponseText = result.response;
      } else {
        console.warn("Unexpected backend response structure:", result);
      }

      const aiMessage = { sender: 'ai', text: aiResponseText };
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);

    } catch (error) {
      console.error("Error sending message to AI:", error);
      setMessages((prev) => [...prev, { sender: 'ai', text: `Error: ${error.message || 'Could not connect to AI.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-inter antialiased p-4 sm:p-6 md:p-8">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-center p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-t-3xl shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">AI Chat Assistant</h1>
        </div>

        {/* Message List */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center px-4">
              <svg className="w-16 h-16 mb-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              <p className="text-xl font-semibold mb-2">Start a conversation!</p>
              <p className="text-md">Type your message below to chat with the AI.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <Message key={index} sender={msg.sender} text={msg.text} />
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 p-3 rounded-xl bg-gray-200 self-start max-w-xs animate-pulse shadow-md">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
              )}
              <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>
          )}
        </div>

        {/* User Input */}
        <div className="p-6 border-t border-gray-100 bg-white rounded-b-3xl">
          <UserInput
            userInput={userInput}
            setUserInput={setUserInput}
            sendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

// Message Component
function Message({ sender, text }) {
  const isUser = sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-prose p-4 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01]
          ${isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
      >
        <p className="text-base leading-relaxed break-words">{text}</p>
      </div>
    </div>
  );
}

// UserInput Component
function UserInput({ userInput, setUserInput, sendMessage, isLoading }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here..."
        className="flex-1 p-4 border border-gray-200 rounded-full focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 text-lg shadow-sm"
        disabled={isLoading}
      />
      <button
        onClick={sendMessage}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        )}
      </button>
    </div>
  );
}

export default App;
