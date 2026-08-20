/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, X } from 'lucide-react';

interface AIChatBotProps {
  courseName?: string;
  lessonName?: string;
  lessonDescription?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function AIChatBot({ courseName, lessonName, lessonDescription }: AIChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_msg',
      sender: 'bot',
      text: `Hello! I am your interactive Gemini Study Assistant. I am fully synchronized with **"${lessonName || 'Introduction'}"**. Ask me anything about this topic, or request a quick summary!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageText = input;
    setInput('');
    const userMsg: Message = {
      id: `msg_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token') || ''}`
        },
        body: JSON.stringify({
          prompt: userMessageText,
          courseName,
          lessonName,
          lessonDescription
        })
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        setMessages(prev => [...prev, {
          id: `msg_${Math.random().toString(36).substr(2, 9)}`,
          sender: 'bot',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error || 'Failed to generate tutor reply.');
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `msg_err_${Math.random().toString(36).substr(2, 9)}`,
        sender: 'bot',
        text: 'I apologize, but I encountered a network bottleneck. Let\'s try asking that again in a brief moment!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleQuestion = (q: string) => {
    setInput(q);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#79C99A] px-4 py-3 text-[#17221B] shadow-lg hover:opacity-95 transition-all duration-300 font-sans border border-[#79C99A]/30"
        id="open_ai_chat_btn"
      >
        <Sparkles className="h-5 w-5 text-[#17221B]" />
        <span className="text-xs font-black uppercase tracking-wider">Ask AI Tutor</span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex h-[500px] w-[380px] flex-col rounded-2xl border border-[#E5ECE7] bg-white shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 font-sans"
      id="ai_tutor_widget"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-[#FAFCFA] border-b border-[#E5ECE7] p-4 text-[#17221B]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F8F3] border border-[#79C99A]/30 text-[#17221B]">
            <Sparkles className="h-4 w-4 text-[#79C99A]" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#17221B]">Gemini AI Assistant</h4>
            <p className="text-[10px] text-[#66736B] line-clamp-1 font-light">{lessonName || 'LMS Classroom Help'}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[#66736B] hover:text-[#17221B] transition"
          id="close_ai_chat_btn"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Message Screen */}
      <div className="flex-1 overflow-y-auto bg-[#FAFCFA] p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs shrink-0 ${
              m.sender === 'user' ? 'bg-[#E5ECE7] text-[#17221B]' : 'bg-[#79C99A] text-[#17221B]'
            }`}>
              {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`flex flex-col max-w-[80%] ${m.sender === 'user' ? 'items-end' : ''}`}>
              <div className={`rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-[#79C99A] text-[#17221B] rounded-tr-none font-medium'
                  : 'bg-white text-[#17221B] border border-[#E5ECE7] shadow-sm rounded-tl-none'
              }`}>
                {m.text}
              </div>
              <span className="text-[9px] text-[#66736B] mt-1 px-1 font-mono">{m.timestamp}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#79C99A] text-[#17221B] text-xs shrink-0">
              <Bot className="h-4 w-4 animate-bounce text-[#17221B]" />
            </div>
            <div className="rounded-2xl bg-white border border-[#E5ECE7] p-3 shadow-sm rounded-tl-none text-xs text-[#66736B] italic">
              Formulating neural response...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="bg-[#FAFCFA] px-4 pb-2">
          <p className="text-[9px] text-[#66736B] font-black uppercase tracking-wider mb-1">Suggested Prompts:</p>
          <div className="flex flex-col gap-1">
            {[
              'Can you summarize this lesson in 3 key takeaways?',
              'What are some practical application examples of this topic?',
              'Explain this lesson to me like I am a 10-year old.'
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => loadSampleQuestion(q)}
                className="text-left text-[11px] text-[#17221B] bg-white hover:bg-[#F1F8F3] rounded py-1.5 px-2.5 border border-[#E5ECE7] truncate transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form Input */}
      <form onSubmit={handleSend} className="border-t border-[#E5ECE7] bg-white p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a classroom question..."
          className="flex-1 rounded-lg border border-[#E5ECE7] px-3 py-1.5 text-xs focus:border-[#79C99A] focus:outline-none bg-[#FAFCFA] text-[#17221B] placeholder-[#66736B]/55"
          disabled={loading}
          id="ai_tutor_input"
        />
        <button
          type="submit"
          className="flex items-center justify-center rounded-lg bg-[#79C99A] text-[#17221B] px-3 hover:opacity-90 disabled:opacity-50 transition"
          disabled={loading || !input.trim()}
          id="ai_tutor_send_btn"
        >
          <Send className="h-4 w-4 text-[#17221B]" />
        </button>
      </form>
    </div>
  );
}
