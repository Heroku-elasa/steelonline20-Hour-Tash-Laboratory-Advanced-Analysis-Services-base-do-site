

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, Message, Page } from '../types';
import { marked } from 'marked';

interface FloatingChatbotProps {
  chatHistory: Message[];
  isStreaming: boolean;
  onSendMessage: (message: string) => void;
  setPage: (page: Page) => void;
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ chatHistory, isStreaming, onSendMessage, setPage }) => {
  const { t, language, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const isRtl = dir === 'rtl';

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isStreaming, isOpen]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput, isOpen]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor && anchor.hasAttribute('href')) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('page:')) {
            e.preventDefault();
            const page = href.substring(5) as Page;
            setPage(page);
            setIsOpen(false); // Close chat after navigation
        }
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isStreaming) {
      onSendMessage(userInput);
      setUserInput('');
    }
  };

  const renderMessage = (msg: Message, index: number) => {
    const isUser = msg.role === 'user';
    const isLastMessage = index === chatHistory.length - 1;
    const showTypingIndicator = isStreaming && isLastMessage && msg.role === 'model' && msg.parts[0].text === '';
    const messageHtml = marked.parse(msg.parts[0].text, { breaks: true }) as string;
    
    const alignmentClass = isUser
      ? (dir === 'rtl' ? 'justify-start' : 'justify-end')
      : (dir === 'rtl' ? 'justify-end' : 'justify-start');

    const bubbleClass = isUser
      ? `bg-corp-blue-dark text-white ${dir === 'rtl' ? 'rounded-bl-lg' : 'rounded-br-lg'}`
      : `bg-slate-200 text-slate-800 ${dir === 'rtl' ? 'rounded-br-lg' : 'rounded-bl-lg'}`;
    
    return (
      <div key={index} className={`flex items-end gap-3 ${alignmentClass}`}>
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-corp-blue text-white rounded-full flex items-center justify-center border-2 border-corp-blue-dark">
             <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L6 5.464V12v6.536L12 22l6-3.464V12V5.464L12 2z" />
                <path d="M6 12h12" />
             </svg>
          </div>
        )}
        <div className={`max-w-xl p-4 rounded-2xl shadow-md ${bubbleClass}`}>
          {showTypingIndicator ? (
             <div className="flex items-center space-x-1 p-2">
                <span className="w-2 h-2 bg-corp-blue-dark rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-corp-blue-dark rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-corp-blue-dark rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
             </div>
           ) : (
            <div
                className={`prose prose-sm max-w-none prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                dangerouslySetInnerHTML={{ __html: messageHtml }}
            />
           )}
           {isStreaming && isLastMessage && !isUser && msg.parts[0].text !== '' && <span className="inline-block w-2 h-4 bg-slate-700 ml-1 animate-pulse"></span>}
        </div>
      </div>
    );
  };

  const showSuggestions = !isStreaming && chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'model';

  return (
    <>
      <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50`}>
        {/* Chat Window */}
        {isOpen && (
          <div className={`absolute bottom-20 ${isRtl ? 'left-0' : 'right-0'} w-80 sm:w-96 bg-white/80 backdrop-blur-md rounded-lg shadow-2xl border border-slate-200 flex flex-col h-[60vh] max-h-[500px] transition-all duration-300 origin-bottom-${isRtl ? 'left' : 'right'} animate-fade-in`}>
            {/* Header */}
            <div className="flex-shrink-0 p-3 bg-slate-100 rounded-t-lg flex justify-between items-center border-b border-slate-200">
              <h3 className="text-md font-bold text-slate-800">{t('aiChat.title')}</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            </div>
            {/* Chat Body */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto" ref={messageContainerRef} onClick={handleContainerClick}>
                {chatHistory.map(renderMessage)}
                <div ref={chatEndRef}></div>
            </div>
            {/* Suggestions */}
            {showSuggestions && (
                <div className="px-3 pb-2 border-t border-slate-200 pt-2">
                    <div className="flex flex-wrap gap-2">
                        {t('aiChat.suggestions').map((suggestion: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => onSendMessage(suggestion)}
                                className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-300 hover:text-slate-900 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {/* Input */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-lg">
                <form onSubmit={handleSend} className="flex items-start gap-2">
                  <textarea
                    ref={textareaRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    placeholder={t('aiChat.placeholder')}
                    className="flex-grow bg-slate-100 border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-corp-blue-dark text-slate-800 text-sm resize-none max-h-24"
                    rows={1}
                    disabled={isStreaming}
                    aria-label={t('aiChat.placeholder')}
                  />
                  <button type="submit" disabled={isStreaming || !userInput.trim()} className="p-2 bg-corp-blue-dark text-white rounded-full hover:bg-corp-blue-dark/90 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex-shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  </button>
                </form>
            </div>
          </div>
        )}
        
        {/* Chat Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-corp-blue-dark rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110"
          aria-label="Open AI Chat"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          )}
        </button>
      </div>
    </>
  );
};

export default FloatingChatbot;