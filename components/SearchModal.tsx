

import React, { useState } from 'react';
import { useLanguage, SearchResultItem, Page } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
  results: SearchResultItem[] | null;
  error: string | null;
  onNavigate: (page: Page) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  isLoading,
  results,
  error,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };
  
  const hasResults = results && results.length > 0;
  const noResultsFound = results && results.length === 0;

  return (
    <div
      className="fixed inset-0 bg-slate-800/80 backdrop-blur-sm z-[100] flex flex-col items-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div
        className="w-full max-w-2xl mt-12 sm:mt-20 bg-white rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-200">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={t('searchModal.placeholder')}
                    className="w-full bg-transparent text-slate-800 placeholder-slate-400 py-2 text-lg focus:outline-none"
                    autoFocus
                />
                <button type="button" onClick={onClose} className="p-2 text-slate-500 rounded-full hover:bg-slate-100" aria-label="Close search">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </form>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
            {isLoading && (
                <div className="flex justify-center items-center py-10">
                    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-corp-blue-dark"></div>
                </div>
            )}
            {!isLoading && !results && !error && (
                <div className="animate-fade-in">
                    <h2 className="font-semibold text-sm text-slate-500 mb-3">{t('searchModal.suggestionsTitle')}</h2>
                    <div className="flex flex-wrap gap-2">
                        {t('searchModal.suggestionQueries').map((suggestion: string, index: number) => (
                            <button key={index} onClick={() => handleSuggestionClick(suggestion)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 text-sm transition-colors">
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {error && <div className="text-red-600 p-4 bg-red-50 rounded-md">{error}</div>}
            
            {hasResults && (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="font-semibold text-slate-800">{t('searchModal.resultsTitle')}</h2>
                    {results.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => onNavigate(item.targetPage)}
                            className="w-full text-left bg-slate-50 p-4 rounded-lg border border-transparent hover:border-corp-blue hover:bg-white transition-all group"
                        >
                            <h3 className="font-bold text-corp-blue-dark group-hover:underline">{item.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                        </button>
                    ))}
                </div>
            )}

            {noResultsFound && (
                <div className="text-center p-8 text-slate-500 bg-slate-100 rounded-lg">
                    <p>{t('searchModal.noResults')}</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default SearchModal;