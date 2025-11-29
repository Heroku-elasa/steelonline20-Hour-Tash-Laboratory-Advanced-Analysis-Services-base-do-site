
import React, { useState } from 'react';
import { useLanguage, MarketplaceRequest, MarketplaceOffer, CreditCheckResult } from '../types';
import { findMarketplaceMatches, checkCreditScore } from '../services/geminiService';
import { useToast } from './Toast';

const IronSnappPage: React.FC = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();

    // Form State
    const [request, setRequest] = useState<MarketplaceRequest>({
        product: '',
        quantity: '',
        location: '',
        paymentType: 'cash',
        checkMonths: 2
    });

    // Results State
    const [offers, setOffers] = useState<MarketplaceOffer[] | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Credit Check State
    const [checkingCredit, setCheckingCredit] = useState(false);
    const [creditResult, setCreditResult] = useState<CreditCheckResult | null>(null);

    const SAMPLE_REQUESTS = [
        { label: 'Rebar - Cash', product: 'Rebar 16 Esfahan', quantity: '25', location: 'Tehran', paymentType: 'cash', checkMonths: 1 },
        { label: 'Beam - Check', product: 'IPE 180 Beam', quantity: '10', location: 'Mashhad', paymentType: 'check', checkMonths: 3 },
        { label: 'Sheet - Credit', product: 'Galvanized Sheet 2mm', quantity: '5', location: 'Tabriz', paymentType: 'credit', checkMonths: 6 },
    ];

    const applySample = (sample: any) => {
        setRequest({
            product: sample.product,
            quantity: sample.quantity,
            location: sample.location,
            paymentType: sample.paymentType as any,
            checkMonths: sample.checkMonths
        });
        addToast("Sample data loaded!", "info");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!request.product || !request.quantity || !request.location) {
            addToast(t('validation.fillRequiredFields'), 'error');
            return;
        }

        setLoading(true);
        setOffers(null);
        setCreditResult(null);

        try {
            // 1. If check payment, simulate credit check first
            if (request.paymentType !== 'cash') {
                setCheckingCredit(true);
                addToast(t('ironSnapp.credit.checking'), 'info');
                
                // Simulate credit check call
                // Using "Estimated Total" as a placeholder since actual price isn't known until matching
                const creditRes = await checkCreditScore("Estimated Total", request.checkMonths || 1, language);
                
                // Add a small artificial delay for better UX (so the user sees the 'checking' state)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                setCreditResult(creditRes);
                setCheckingCredit(false);
                
                if (!creditRes.allowed) {
                    addToast(t('ironSnapp.credit.rejected'), 'error');
                    setLoading(false);
                    return; 
                } else {
                    addToast(t('ironSnapp.credit.approved'), 'success');
                }
            }

            // 2. Find Matches
            const matches = await findMarketplaceMatches(request, language);
            setOffers(matches);
        } catch (error) {
            console.error(error);
            addToast("Failed to find offers.", 'error');
        } finally {
            setLoading(false);
            setCheckingCredit(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in bg-slate-50 min-h-screen">
            <div className="text-center max-w-4xl mx-auto mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                    <span className="text-corp-red">Iron</span>Snapp
                </h1>
                <p className="mt-4 text-lg text-slate-600">{t('ironSnapp.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Request Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-corp-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            {t('ironSnapp.form.title')}
                        </h2>

                        {/* Quick Test Samples */}
                        <div className="mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Quick Test Samples:</p>
                            <div className="flex flex-wrap gap-2">
                                {SAMPLE_REQUESTS.map((sample, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => applySample(sample)}
                                        className="text-xs bg-white border border-slate-200 hover:border-corp-red hover:text-corp-red text-slate-600 px-3 py-1.5 rounded-full transition-all shadow-sm"
                                    >
                                        {sample.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('ironSnapp.form.productLabel')}</label>
                                <input 
                                    type="text" 
                                    value={request.product}
                                    onChange={e => setRequest({...request, product: e.target.value})}
                                    placeholder={t('ironSnapp.form.productPlaceholder')}
                                    className="w-full bg-slate-50 border-slate-300 rounded-md p-3 focus:ring-corp-red focus:border-corp-red text-sm"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('ironSnapp.form.qtyLabel')}</label>
                                    <input 
                                        type="number" 
                                        value={request.quantity}
                                        onChange={e => setRequest({...request, quantity: e.target.value})}
                                        className="w-full bg-slate-50 border-slate-300 rounded-md p-3 focus:ring-corp-red focus:border-corp-red text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('ironSnapp.form.locationLabel')}</label>
                                    <input 
                                        type="text" 
                                        value={request.location}
                                        onChange={e => setRequest({...request, location: e.target.value})}
                                        className="w-full bg-slate-50 border-slate-300 rounded-md p-3 focus:ring-corp-red focus:border-corp-red text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">{t('ironSnapp.form.paymentLabel')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => setRequest({...request, paymentType: 'cash'})}
                                        className={`py-2 px-1 text-xs font-bold rounded border transition-colors ${request.paymentType === 'cash' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {t('ironSnapp.form.paymentCash')}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setRequest({...request, paymentType: 'check'})}
                                        className={`py-2 px-1 text-xs font-bold rounded border transition-colors ${request.paymentType === 'check' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {t('ironSnapp.form.paymentCheck')}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setRequest({...request, paymentType: 'credit'})}
                                        className={`py-2 px-1 text-xs font-bold rounded border transition-colors ${request.paymentType === 'credit' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {t('ironSnapp.form.paymentCredit')}
                                    </button>
                                </div>
                            </div>

                            {request.paymentType !== 'cash' && (
                                <div className="animate-fade-in bg-blue-50 p-3 rounded-md border border-blue-100">
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-100">
                                        <div className="p-1 bg-blue-100 rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold text-blue-800">Credit Check Required</span>
                                    </div>
                                    <label className="block text-xs font-medium text-blue-700 mb-1">{t('ironSnapp.form.monthsLabel')}: {request.checkMonths}</label>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="6" 
                                        step="1"
                                        value={request.checkMonths}
                                        onChange={e => setRequest({...request, checkMonths: parseInt(e.target.value)})}
                                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-blue-600 mt-1">
                                        <span>1 Month</span>
                                        <span>6 Months</span>
                                    </div>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading || checkingCredit} 
                                className={`w-full py-3 font-bold rounded-lg transition-all shadow-md flex justify-center items-center gap-2 ${loading || checkingCredit ? 'bg-slate-400 cursor-not-allowed' : 'bg-corp-red hover:bg-corp-red-dark'} text-white`}
                            >
                                {checkingCredit ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                                        <span>{t('ironSnapp.credit.checking')}</span>
                                    </>
                                ) : loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                                        <span>{t('distributorFinder.searching')}</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                        {t('ironSnapp.form.submit')}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Credit Status Panel (if check) */}
                    {creditResult && (
                        <div className={`mt-6 rounded-xl border p-5 ${creditResult.allowed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} animate-fade-in shadow-sm`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-full ${creditResult.allowed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {creditResult.allowed ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    )}
                                </div>
                                <h3 className={`font-bold text-lg ${creditResult.allowed ? 'text-green-800' : 'text-red-800'}`}>
                                    {creditResult.allowed ? t('ironSnapp.credit.approved') : t('ironSnapp.credit.rejected')}
                                </h3>
                            </div>
                            <div className="space-y-2 text-sm pl-2 border-l-2 border-slate-200">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">{t('ironSnapp.credit.score')}:</span>
                                    <span className="font-mono font-bold text-slate-800">{creditResult.score} / 1000</span>
                                </div>
                                {!creditResult.allowed && (
                                     <div className="flex justify-between">
                                        <span className="text-slate-600">{t('ironSnapp.credit.reason')}:</span>
                                        <span className="font-bold text-red-700">{creditResult.reason}</span>
                                    </div>
                                )}
                                {creditResult.allowed && (
                                     <div className="flex justify-between">
                                        <span className="text-slate-600">Credit Limit:</span>
                                        <span className="font-bold text-green-700">{creditResult.maxAmount}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Results List */}
                <div className="lg:col-span-2 space-y-6">
                    {offers && (
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800">{t('ironSnapp.results.title')}</h2>
                            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">{offers.length} Found</span>
                        </div>
                    )}

                    {offers && offers.map((offer, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:border-corp-red transition-all group animate-fade-in">
                            {/* Card Header with Score */}
                            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{offer.sellerName}</h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {offer.location} ({offer.distanceKm} km)
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center bg-white shadow-sm">
                                        <span className="font-bold text-sm text-green-700">{offer.matchScore}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold mt-1 block">{t('ironSnapp.results.score')}</span>
                                </div>
                            </div>
                            
                            {/* Card Body */}
                            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">{t('ironSnapp.results.price')}</p>
                                    <p className="font-bold text-lg text-corp-red">{offer.totalPrice}</p>
                                    <p className="text-[10px] text-slate-400">({offer.pricePerUnit} / kg)</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">{t('ironSnapp.results.delivery')}</p>
                                    <p className="font-semibold text-slate-700">{offer.deliveryTime}</p>
                                    <p className="text-[10px] text-slate-400">{offer.deliveryCost} shipping</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Payment</p>
                                    <p className="font-semibold text-slate-700">{offer.paymentFlexibility}</p>
                                </div>
                                <div className="sm:text-right">
                                    <button className="w-full sm:w-auto px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl">
                                        {t('ironSnapp.results.buy')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {!offers && !loading && (
                        <div className="bg-slate-100 rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            <p className="text-lg">Enter your request details to find the best steel offers near you.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IronSnappPage;
