


import React, { useState } from 'react';
import { useLanguage, ProviderSearchResult } from '../types';

interface DistributorFinderPageProps {
    onSearch: (searchMethod: 'geo' | 'text', query: string, searchType: 'distributor' | 'veterinarian') => void;
    isLoading: boolean;
    results: ProviderSearchResult[] | null;
    isQuotaExhausted: boolean;
}

const DistributorFinderPage: React.FC<DistributorFinderPageProps> = ({ onSearch, isLoading, results, isQuotaExhausted }) => {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState<'distributor' | 'veterinarian'>('distributor');

    const handleTextSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch('text', query, searchType);
        }
    };

    const handleGeoSearch = () => {
        onSearch('geo', 'user location', searchType);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        onSearch('text', suggestion, searchType);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{t('distributorFinder.title')}</h1>
                <p className="mt-4 text-lg text-slate-600">{t('distributorFinder.subtitle')}</p>
            </div>
            
            <div className="mt-8 max-w-2xl mx-auto text-center">
                <h3 className="text-sm font-semibold text-slate-500 mb-3">{t('distributorFinder.suggestionsTitle')}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                    {t('distributorFinder.suggestionQueries').map((suggestion: string, index: number) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-50 hover:border-corp-red transition-all transform hover:scale-105"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-8 max-w-2xl mx-auto">
                <div className="bg-white rounded-lg p-8 shadow-lg border border-slate-200 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('distributorFinder.searchTypeLabel')}</label>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => setSearchType('distributor')}
                                className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${searchType === 'distributor' ? 'bg-corp-red text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                            >
                                {t('distributorFinder.distributor')}
                            </button>
                            <button
                                onClick={() => setSearchType('veterinarian')}
                                className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${searchType === 'veterinarian' ? 'bg-corp-red text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                            >
                                {t('distributorFinder.veterinarian')}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleTextSearch} className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder={t('distributorFinder.searchPlaceholder')}
                            className="w-full bg-slate-50 border-slate-300 rounded-md p-3 focus:ring-corp-red focus:border-corp-red text-slate-800"
                        />
                        <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-6 py-3 bg-corp-red text-white font-semibold rounded-md hover:bg-corp-red-dark transition-colors disabled:bg-slate-400 flex-shrink-0">
                            {t('distributorFinder.searchButton')}
                        </button>
                    </form>

                    <div className="flex items-center text-xs text-slate-400">
                        <div className="flex-grow border-t border-slate-300"></div>
                        <span className="flex-shrink mx-4">OR</span>
                        <div className="flex-grow border-t border-slate-300"></div>
                    </div>
                    
                    <button onClick={handleGeoSearch} disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-md hover:bg-slate-50 transition-colors disabled:bg-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        {t('distributorFinder.findNearMe')}
                    </button>

                    {isQuotaExhausted && <p className="text-center text-yellow-600 text-sm">{t('quotaErrorModal.title')}</p>}
                </div>
            </div>
            
            <div className="mt-16 max-w-4xl mx-auto">
                {isLoading && (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-corp-red"></div>
                        <span className="ml-4 text-slate-600">{t('distributorFinder.searching')}</span>
                    </div>
                )}

                {results && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800 text-center">{t('distributorFinder.resultsTitle')}</h2>
                        {results.length > 0 ? (
                            results.map((result, index) => (
                                <div key={index} className="bg-white rounded-lg p-6 border border-slate-200 shadow-md hover:border-corp-red/50 transition-colors">
                                    <h3 className="font-bold text-lg text-corp-red">{result.name}</h3>
                                    <p className="text-sm text-slate-600 mt-1">{result.address}</p>
                                    <p className="text-sm text-slate-500 mt-2">{result.phone}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-500 py-10 bg-slate-100 rounded-lg">
                                <p>{t('distributorFinder.noResults')}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default DistributorFinderPage;
