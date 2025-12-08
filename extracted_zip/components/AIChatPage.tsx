

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, Message, Page } from '../types';
import { marked } from 'marked';

interface AIChatPageProps {
  chatHistory: Message[];
  isStreaming: boolean;
  onSendMessage: (message: string) => void;
  setPage: (page: Page) => void;
}

const AIChatPage: React.FC<AIChatPageProps> = ({ chatHistory, isStreaming, onSendMessage, setPage }) => {
  const { t, dir } = useLanguage();
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isStreaming]);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);
  
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor && anchor.hasAttribute('href')) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('page:')) {
            e.preventDefault();
            const page = href.substring(5) as Page;
            setPage(page);
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
    <section id="ai-chat" className="py-16 sm:py-24 animate-fade-in bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{t('aiChat.title')}</h1>
          <p className="mt-4 text-lg text-slate-600">{t('aiChat.subtitle')}</p>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col h-[70vh] max-h-[700px]">
          <div className="flex-1 p-6 space-y-6 overflow-y-auto" ref={messageContainerRef} onClick={handleContainerClick}>
            {chatHistory.map(renderMessage)}
            <div ref={chatEndRef}></div>
          </div>
          
          {showSuggestions && (
            <div className="px-6 pb-2 pt-2 border-t border-slate-200">
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

          <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
            <form onSubmit={handleSend} className="flex items-start gap-3">
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                placeholder={t('aiChat.placeholder')}
                className="flex-grow bg-slate-100 border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-corp-blue-dark text-slate-800 resize-none max-h-32"
                rows={1}
                disabled={isStreaming}
                aria-label={t('aiChat.placeholder')}
              />
              <button 
                type="submit" 
                disabled={isStreaming || !userInput.trim()} 
                className="p-3 bg-corp-blue-dark text-white rounded-full hover:bg-corp-blue-dark/90 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChatPage;