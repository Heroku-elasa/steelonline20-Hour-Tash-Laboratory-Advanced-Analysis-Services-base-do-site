
import React, { useState, useEffect } from 'react';
import { useLanguage, SEOAnalysisResult } from '../types';
import { analyzeSEOStrategy } from '../services/geminiService';
import { saveSEOReport, getSEOReports } from '../services/dashboardService';
import { useToast } from './Toast';

const StatusBadge = ({ status, labels }: { status: string, labels: Record<string, string> }) => {
    const colors: Record<string, string> = {
        pass: 'bg-green-100 text-green-800',
        fail: 'bg-red-100 text-red-800',
        warn: 'bg-yellow-100 text-yellow-800'
    };
    
    // Fallback for unknown status
    const colorClass = colors[status] || 'bg-gray-100 text-gray-800';
    const labelText = labels[status] || status;

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${colorClass}`}>
            {labelText}
        </span>
    );
};

const SEOChecker: React.FC = () => {
    const { t, language, dir } = useLanguage();
    const { addToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<SEOAnalysisResult | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const performAnalysis = async () => {
        setIsAnalyzing(true);
        setResult(null);
        setShowHistory(false);

        // 1. Scrape Current Page Metadata
        const title = document.title;
        const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const h1 = document.querySelector('h1')?.innerText || '';
        const images = Array.from(document.querySelectorAll('img'));
        const imagesWithoutAlt = images.filter(img => !img.alt && img.src);
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        const schema = document.querySelector('script[type="application/ld+json"]');

        // 2. Metrics Logic (Basic checks)
        let score = 100;
        
        // Define initial metrics structure
        const metrics: any = {
            titleLength: { status: 'pass', value: title.length, message: '' },
            descriptionLength: { status: 'pass', value: description.length, message: '' },
            h1Count: { status: 'pass', value: h1 ? 1 : 0, message: '' },
            imageAlt: { status: 'pass', value: imagesWithoutAlt.length, message: '' },
            schema: { status: 'pass', message: '' },
            canonical: { status: 'pass', message: '' }
        };

        // Validate Title
        if (title.length < 30 || title.length > 60) {
            metrics.titleLength.status = 'warn';
            metrics.titleLength.message = 'Title should be between 30-60 chars.';
            score -= 10;
        }

        // Validate Description
        if (description.length < 120 || description.length > 160) {
             metrics.descriptionLength.status = description.length === 0 ? 'fail' : 'warn';
             metrics.descriptionLength.message = description.length === 0 ? 'Missing description.' : 'Description optimal length is 120-160 chars.';
             score -= description.length === 0 ? 20 : 5;
        }

        // Validate H1
        if (!h1) {
            metrics.h1Count.status = 'fail';
            metrics.h1Count.message = 'Missing H1 tag.';
            score -= 20;
        }

        // Validate Alt Tags
        if (imagesWithoutAlt.length > 0) {
            metrics.imageAlt.status = 'warn';
            metrics.imageAlt.message = `${imagesWithoutAlt.length} images missing alt text.`;
            score -= 5;
        }

        // Validate Schema
        if (!schema) {
            metrics.schema.status = 'fail';
            metrics.schema.message = 'No Schema.org markup found.';
            score -= 10;
        } else {
             metrics.schema.message = 'Schema markup detected.';
        }

        // Validate Canonical
        if (!canonical) {
             metrics.canonical.status = 'fail';
             metrics.canonical.message = 'Missing canonical tag.';
             score -= 5;
        } else {
             metrics.canonical.message = 'Canonical tag present.';
        }

        // 3. AI Recommendations (Strategy & Directories)
        try {
            const contentSample = document.body.innerText.replace(/\s+/g, ' ').substring(0, 1000);
            
            // Pass the scraped metadata to the AI service
            const aiData = await analyzeSEOStrategy({
                title, description, h1, contentSample
            }, language);

            const finalResult = {
                score: Math.max(0, score),
                metrics: metrics,
                aiRecommendations: aiData
            };

            setResult(finalResult);

            // Save to Supabase (Database)
            saveSEOReport(window.location.href, finalResult).then(({ error }) => {
                if (!error) {
                    addToast("Report saved to DB.", "success");
                } else {
                    console.error("Save failed:", error);
                    addToast(`Save failed: ${error.message || JSON.stringify(error)}`, "error");
                }
            });

        } catch (error) {
            console.error(error);
            addToast("AI Analysis failed, showing metrics only.", 'error');
             // Fallback result without AI
             setResult({
                score: Math.max(0, score),
                metrics: metrics,
                aiRecommendations: {
                    strategy: ["Ensure keywords are in H1 and Title.", "Register on Google Search Console."],
                    directories: ["Ketab Avval", "Google Maps", "LinkedIn Company Page"],
                    keywords: ["Steel Price Iran", "Buy Rebar Online", "Iron Market"]
                }
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        setShowHistory(true);
        try {
            const data = await getSEOReports();
            setHistory(data);
        } catch (err: any) {
            addToast("Failed to fetch history. Check Diagnostics.", "error");
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const statusLabels = {
        pass: t('seoChecker.pass'),
        fail: t('seoChecker.fail'),
        warn: t('seoChecker.warn')
    };

    return (
        <>
            {/* Floating Button */}
            <div className={`fixed bottom-24 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-40`}>
                <button
                    onClick={() => { setIsOpen(true); if (!result && !showHistory) performAnalysis(); }}
                    className="w-14 h-14 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-lg hover:border-corp-teal hover:text-corp-teal transition-all group"
                    title={t('seoChecker.buttonLabel')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-corp-teal opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-corp-teal"></span>
                    </span>
                </button>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-corp-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {t('seoChecker.title')}
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={() => { setShowHistory(false); if(!result) performAnalysis(); }} className={`px-3 py-1 text-xs font-bold rounded ${!showHistory ? 'bg-corp-teal text-white' : 'text-slate-600 hover:bg-slate-200'}`}>Current</button>
                                <button onClick={fetchHistory} className={`px-3 py-1 text-xs font-bold rounded ${showHistory ? 'bg-corp-teal text-white' : 'text-slate-600 hover:bg-slate-200'}`}>History (DB)</button>
                                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {showHistory ? (
                                <div className="space-y-4">
                                    {isLoadingHistory ? (
                                        <div className="flex justify-center p-4"><div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-corp-teal"></div></div>
                                    ) : history.length > 0 ? (
                                        <div className="space-y-3">
                                            {history.map((item, idx) => (
                                                <div key={idx} className="border p-3 rounded-lg flex justify-between items-center hover:bg-slate-50">
                                                    <div>
                                                        <div className="font-bold text-sm text-slate-800">{item.url}</div>
                                                        <div className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</div>
                                                    </div>
                                                    <div className="text-xl font-bold text-corp-teal">{item.score}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-slate-500 py-4">No history found in database.</p>
                                    )}
                                </div>
                            ) : (
                                <>
                                {isAnalyzing ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-corp-teal mb-4"></div>
                                        <p className="text-slate-600 animate-pulse">{t('seoChecker.analyzing')}</p>
                                    </div>
                                ) : result ? (
                                    <div className="space-y-8">
                                        {/* Score */}
                                        <div className="flex items-center justify-center">
                                            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-slate-100">
                                                <div className="absolute inset-0 rounded-full border-8 border-corp-teal border-t-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-4xl font-bold text-slate-800">{result.score}</span>
                                                    <span className="text-xs text-slate-500 uppercase font-bold">{t('seoChecker.score')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Metrics Grid */}
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">{t('seoChecker.metricsTitle')}</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {Object.entries(result.metrics).map(([key, rawData]) => {
                                                    const data = rawData as any;
                                                    return (
                                                    <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                            {data.message && <p className="text-xs text-slate-500 mt-0.5">{data.message}</p>}
                                                        </div>
                                                        <StatusBadge status={data.status} labels={statusLabels} />
                                                    </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* AI Recommendations */}
                                        <div>
                                            <h3 className="text-sm font-bold text-corp-teal uppercase tracking-wider mb-3 border-b border-slate-100 pb-1 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                                {t('seoChecker.recommendationsTitle')}
                                            </h3>
                                            
                                            <div className="space-y-4">
                                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
                                                    <h4 className="font-bold text-blue-800 text-sm mb-2">{t('seoChecker.registerSites')}</h4>
                                                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                                        {result.aiRecommendations.directories.map((site: string, i: number) => (
                                                            <li key={i}>{site}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-md">
                                                    <h4 className="font-bold text-green-800 text-sm mb-2">{t('seoChecker.strategies')}</h4>
                                                    <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                                                         {result.aiRecommendations.strategy.map((item: string, i: number) => (
                                                            <li key={i}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-md">
                                                    <h4 className="font-bold text-purple-800 text-sm mb-2">{t('seoChecker.keywords')}</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.aiRecommendations.keywords.map((kw: string, i: number) => (
                                                            <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">{kw}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                </>
                            )}
                        </div>
                        
                        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                            <button onClick={performAnalysis} className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-bold shadow-md">
                                {t('distributorFinder.searchButton')} / Refresh
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SEOChecker;
