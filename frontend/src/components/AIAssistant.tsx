import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { askWorkerScout } from '../lib/ai';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: "Hi! I'm WorkerScout. Need help finding a plumber, or wondering how much a tutor costs around here? Ask me anything!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const aiResponse = await askWorkerScout(userMessage);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "Sorry, I couldn't process that." }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 overflow-hidden group border-2 border-indigo-400"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles className="relative z-10" size={24} />
      </motion.button>

      {/* Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-[60] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold">WorkerScout AI</h3>
                  <p className="text-xs text-indigo-100 italic">Hyperlocal Helper</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Content */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white shadow-sm border border-gray-100 text-emerald-600'
                    }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 className="animate-spin text-indigo-400" size={20} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for a plumber near you..."
                  className="w-full bg-gray-50 border border-transparent focus:border-indigo-300 focus:bg-white px-4 py-3 pr-12 rounded-xl outline-none transition-all text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-30"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                AI can make mistakes. Verify worker ratings manually.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
