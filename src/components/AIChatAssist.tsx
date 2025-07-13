import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, Settings, Compass, Sun, Moon, Cloud, Map, BarChart3 } from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const initialWelcome = `Hello! I'm your Meteora AI Assistant. I can help with weather questions, recommendations, and guide you through the app. How can I assist you today?`;

const placeholderAIResponse = (input: string): string => {
  // Simple placeholder logic for demo
  const lower = input.toLowerCase();
  if (lower.includes('weather')) return "Today's weather is sunny with a high of 22°C.";
  if (lower.includes('forecast')) return "The 5-day forecast shows mild temperatures and clear skies.";
  if (lower.includes('3d')) return "Switching to the 3D view. (In real app, this would change the tab!)";
  if (lower.includes('dark mode')) return "Switching to dark mode. (In real app, this would update settings!)";
  if (lower.includes('settings')) return "You can access settings via the gear icon in the top right.";
  if (lower.includes('help')) return "Ask me about the weather, forecasts, or how to use the app!";
  return "I'm here to help! Try asking about the weather, forecasts, or app features.";
};

const AIChatAssist: React.FC<{
  onNavigate?: (tab: string) => void;
  onUpdateSettings?: (setting: string, value: any) => void;
}> = ({ onNavigate, onUpdateSettings }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, sender: 'ai', text: initialWelcome, timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      // Placeholder AI logic
      const aiText = placeholderAIResponse(userMsg.text);
      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((msgs) => [...msgs, aiMsg]);
      setLoading(false);
      // Navigation/settings triggers (simulate)
      if (onNavigate && userMsg.text.toLowerCase().includes('3d')) onNavigate('3d');
      if (onUpdateSettings && userMsg.text.toLowerCase().includes('dark mode')) onUpdateSettings('theme', 'dark');
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-24 right-6 z-[10000] bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all flex items-center justify-center"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        aria-label="Open AI Assist"
        style={{ display: open ? 'none' : 'flex' }}
      >
        <Sparkles className="w-7 h-7" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-[10001] w-[350px] max-w-[95vw] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-blue-400/30 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <span className="font-bold text-lg">AI Assist</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Close chat">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-gradient-to-br from-blue-50/60 to-purple-50/40 dark:from-gray-900 dark:to-gray-800">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md text-sm ${
                    msg.sender === 'ai'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-blue-400/20'
                      : 'bg-blue-500 text-white dark:bg-blue-600 border border-blue-400/40'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {msg.sender === 'ai' ? <Bot className="w-4 h-4 text-purple-400" /> : <User className="w-4 h-4 text-blue-200" />}
                      <span className="text-xs text-gray-400 dark:text-gray-300">{msg.timestamp}</span>
                    </div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start mb-3">
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl shadow-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-blue-400/20 animate-pulse">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-gray-400 dark:text-gray-300">...</span>
                    </div>
                    <div>Thinking...</div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-blue-400/10 bg-white dark:bg-gray-900">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 rounded-xl px-3 py-2 bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-blue-400/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-label="Type your message"
              />
              <button
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssist; 