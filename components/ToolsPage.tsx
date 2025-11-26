
import React, { useState } from 'react';
import { useLanguage, WeightResult, ShippingEstimate } from '../types';
import { calculateSteelWeight, estimateShippingCost } from '../services/geminiService';
import { useToast } from './Toast';

const ToolsPage: React.FC = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();

    const [weightQuery, setWeightQuery] = useState('');
    const [weightResult, setWeightResult] = useState<WeightResult | null>(null);
    const [isWeightLoading, setIsWeightLoading] = useState(false);

    const [shippingQuery, setShippingQuery] = useState('');
    const [shippingResult, setShippingResult] = useState<ShippingEstimate | null>(null);
    const [isShippingLoading, setIsShippingLoading] = useState(false);

    const handleWeightCalc = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!weightQuery.trim()) return;
        setIsWeightLoading(true);
        setWeightResult(null);
        try {
            const res = await calculateSteelWeight(weightQuery, language);
            setWeightResult(res);
        } catch (error) {
            console.error(error);
            addToast('Error calculating weight.', 'error');
        } finally {
            setIsWeightLoading(false);
        }
    };

    const handleShippingCalc = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shippingQuery.trim()) return;
        setIsShippingLoading(true);
        setShippingResult(null);
        try {
            const res = await estimateShippingCost(shippingQuery, language);
            setShippingResult(res);
        } catch (error) {
            console.error(error);
            addToast('Error estimating cost.', 'error');
        } finally {
            setIsShippingLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900">{t('toolsPage.title')}</h1>
                <p className="mt-4 text-lg text-slate-600">{t('toolsPage.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Weight Calculator */}
                <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-corp-red/10 rounded-full text-corp-red">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{t('toolsPage.weightCalc.title')}</h2>
                    </div>
                    <form onSubmit={handleWeightCalc} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('toolsPage.weightCalc.label')}</label>
                            <input 
                                type="text" 
                                value={weightQuery} 
                                onChange={(e) => setWeightQuery(e.target.value)}
                                className="w-full bg-slate-50 border-slate-300 rounded-md p-3 focus:ring-corp-red focus:border-corp-red"
                                placeholder="e.g. IPE 180"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isWeightLoading} 
                            className="w-full py-2 bg-corp-red text-white font-semibold rounded-md hover:bg-corp-red-dark transition-colors disabled:bg-slate-400"
                        >
                            {isWeightLoading ? '...' : t('toolsPage.weightCalc.button')}
                        </button>
                    </form>
                    {weightResult && (
                        <div className="mt-6 bg-slate-50 p-4 rounded-md border border-slate-200 animate-fade-in">
                            <p className="text-sm text-slate-500 font-bold uppercase">{weightResult.product}</p>
                            <p className="text-2xl font-extrabold text-slate-900 mt-1">{weightResult.weight}</p>
                            <p className="text-xs text-slate-500 mt-2">{weightResult.details}</p>
                        </div>
                    )}
                </div>

                {/* Shipping Estimator */}
                <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                         <div className="p-3 bg-corp-teal/10 rounded-full text-corp-teal">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                         </div>
                        <h2 className="text-xl font-bold text-slate-800">{t('toolsPage.shippingCalc.title')}</h2>
                    </div>
                    <form onSubmit={handleShippingCalc} className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('toolsPage.shippingCalc.label')}</label>
                            <input 
                                type="text" 
                                value={shippingQuery} 
                                onChange={(e) => setShippingQuery(e.target.value)}
                                className="w-full bg-slate-50 border-slate-300 rounded-md p-3 focus:ring-corp-teal focus:border-corp-teal"
                                placeholder="e.g. Isfahan to Tehran"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isShippingLoading} 
                            className="w-full py-2 bg-corp-teal text-white font-semibold rounded-md hover:bg-corp-teal-dark transition-colors disabled:bg-slate-400"
                        >
                            {isShippingLoading ? '...' : t('toolsPage.shippingCalc.button')}
                        </button>
                    </form>
                    {shippingResult && (
                        <div className="mt-6 bg-slate-50 p-4 rounded-md border border-slate-200 animate-fade-in">
                            <p className="text-sm text-slate-500 font-bold uppercase">{shippingResult.route}</p>
                            <p className="text-2xl font-extrabold text-slate-900 mt-1">{shippingResult.estimatedCost}</p>
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" /></svg>
                                {shippingResult.vehicleType}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Credit Info Block */}
            <div className="mt-12 bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 rounded-xl shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{t('toolsPage.creditInfo.title')}</h2>
                        <p className="text-slate-300 max-w-xl">{t('toolsPage.creditInfo.desc')}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm min-w-[100px]">
                            <span className="block text-2xl font-bold">LC</span>
                            <span className="text-xs opacity-75">Letter of Credit</span>
                        </div>
                         <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm min-w-[100px]">
                            <span className="block text-2xl font-bold">Check</span>
                            <span className="text-xs opacity-75">Sayadi Checks</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolsPage;
