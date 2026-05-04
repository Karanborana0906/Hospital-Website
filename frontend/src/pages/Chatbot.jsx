import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, Bot, Activity, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hello! I am CureSync's AI Health Assistant. How can I help you today? Please remember, I provide general advice and am not a substitute for professional medical care. If this is a medical emergency, please call your local emergency number.",
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Send to Backend API (which proxies or saves it)
      // We will send directly to our backend /api/chat if user was authenticated.
      // Since we haven't built the full auth flow UI yet, we'll temporarily simulate the backend flow 
      // by calling the skilledu API directly from frontend for testing, ensuring it works as requested.
      
      const response = await axios.post('https://api.skilledu.in/api/ai_gateway.php', {
        message: `Act as a hospital health assistant. Understand symptoms, suggest basic medicines if safe. Recommend consulting a doctor if serious. Avoid dangerous advice. Here is the user query: ${userMessage}`,
        model: 'llama-3.1-8b-instant'
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const aiText = response.data?.response || response.data?.message || 'Sorry, I cannot process this right now.';
      
      setMessages(prev => [...prev, { role: 'bot', content: aiText }]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages(prev => [...prev, { role: 'bot', content: 'There was an error connecting to the health assistant service. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-lg">CureSync AI Assistant</h2>
            <p className="text-blue-100 text-sm">Powered by advanced LLM</p>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This AI assistant provides informational responses only. It is not diagnosing an illness or prescribing medication. <strong className="text-amber-900">Always consult a qualified healthcare provider for serious symptoms.</strong>
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            
            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-blue-100'}`}>
              {msg.role === 'user' ? <UserIcon className="h-6 w-6 text-indigo-700" /> : <Bot className="h-6 w-6 text-blue-700" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
              }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="h-6 w-6 text-blue-700" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex space-x-2 items-center">
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex relative items-center max-w-3xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your symptoms or health question..."
            className="w-full pl-5 pr-14 py-4 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-shadow disabled:opacity-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
