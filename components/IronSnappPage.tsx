import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage, MarketplaceRequest, CreditCheckResult } from '../types';
import { checkCreditScore } from '../services/geminiService';
import { useToast } from './Toast';
import TrustSafetyPanel from './TrustSafetyPanel';
import ReviewSystem from './ReviewSystem';

interface SellerWithLocation {
    sellerName: string;
    location: string;
    city: string;
    phone: string;
    lat: number;
    lon: number;
    distanceKm: number;
    pricePerUnit: string;
    pricePerUnitNum: number;
    totalPrice: string;
    totalPriceNum: number;
    deliveryCost: string;
    matchScore: number;
    paymentFlexibility: string;
    deliveryTime: string;
    verified: boolean;
    rating: number | null;
    scraped: boolean;
}

const getMarkerIcon = (score: number, isSelected: boolean) => {
    let color = '#ef4444';
    if (score >= 80) color = '#22c55e';
    else if (score >= 60) color = '#eab308';
    else if (score >= 40) color = '#f97316';
    
    const size = isSelected ? 40 : 30;
    
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                font-weight: bold;
                font-size: ${isSelected ? '14px' : '11px'};
                color: white;
                transition: all 0.2s;
                ${isSelected ? 'transform: scale(1.2);' : ''}
            ">
                ${score}
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
    });
};

const userIcon = L.divIcon({
    className: 'user-marker',
    html: `
        <div style="
            width: 24px;
            height: 24px;
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 10px rgba(59, 130, 246, 0.5);
        "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

interface ConnectionService {
    key: string;
    icon: React.ReactNode;
    color: string;
}

const IronSnappPage: React.FC = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();

    const [request, setRequest] = useState<MarketplaceRequest>({
        product: '',
        quantity: '',
        location: '',
        paymentType: 'cash',
        checkMonths: 2
    });

    const [sellers, setSellers] = useState<SellerWithLocation[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState<SellerWithLocation | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([35.6892, 51.3890]);
    const [mapZoom, setMapZoom] = useState(6);
    
    const [checkingCredit, setCheckingCredit] = useState(false);
    const [creditResult, setCreditResult] = useState<CreditCheckResult | null>(null);
    
    const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
    
    const [showServicesModal, setShowServicesModal] = useState(false);
    const [contactingSeller, setContactingSeller] = useState<SellerWithLocation | null>(null);
    const [showTrustSafety, setShowTrustSafety] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [reviewSeller, setReviewSeller] = useState<SellerWithLocation | null>(null);

    const connectionServices: ConnectionService[] = [
        {
            key: 'notary',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
            color: 'from-purple-500 to-purple-600'
        },
        {
            key: 'lawyer',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
            color: 'from-blue-500 to-blue-600'
        },
        {
            key: 'contract',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 3v4a2 2 0 002 2h4" /></svg>,
            color: 'from-green-500 to-green-600'
        },
        {
            key: 'insurance',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
            color: 'from-yellow-500 to-orange-500'
        },
        {
            key: 'escrow',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
            color: 'from-teal-500 to-cyan-500'
        },
        {
            key: 'inspection',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
            color: 'from-indigo-500 to-purple-500'
        }
    ];

    const handleContactSeller = (seller: SellerWithLocation) => {
        setContactingSeller(seller);
        setShowServicesModal(true);
    };

    const handleServiceRequest = (serviceKey: string) => {
        const serviceTitle = t(`ironSnapp.connectionServices.${serviceKey}.title`);
        addToast(`${serviceTitle} - ${t('ironSnapp.connectionServices.requestService')}`, 'success');
        setShowServicesModal(false);
    };

    const SAMPLE_REQUESTS = [
        { labelKey: 'rebarTehran', product: 'میلگرد 16 اصفهان', quantity: '25', location: 'تهران', paymentType: 'cash' },
        { labelKey: 'beamIsfahan', product: 'تیرآهن 180', quantity: '10', location: 'اصفهان', paymentType: 'check' },
        { labelKey: 'sheetTabriz', product: 'ورق گالوانیزه', quantity: '5', location: 'تبریز', paymentType: 'cash' },
    ];

    const applySample = (sample: any) => {
        setRequest({
            product: sample.product,
            quantity: sample.quantity,
            location: sample.location,
            paymentType: sample.paymentType as any,
            checkMonths: 2
        });
        addToast(t('ironSnapp.toasts.sampleLoaded'), "info");
    };

    const searchSellers = async () => {
        if (!request.product || !request.quantity || !request.location) {
            addToast(t('validation.fillRequiredFields'), 'error');
            return;
        }

        setLoading(true);
        setSellers([]);
        setCreditResult(null);
        setSelectedSeller(null);

        try {
            if (request.paymentType !== 'cash') {
                setCheckingCredit(true);
                addToast(t('ironSnapp.credit.checking'), 'info');
                const creditRes = await checkCreditScore("Estimated Total", request.checkMonths || 1, language);
                await new Promise(resolve => setTimeout(resolve, 1000));
                setCreditResult(creditRes);
                setCheckingCredit(false);
                
                if (!creditRes.allowed) {
                    addToast(t('ironSnapp.credit.rejected'), 'error');
                    setLoading(false);
                    return; 
                }
                addToast(t('ironSnapp.credit.approved'), 'success');
            }

            const response = await fetch('/api/sellers/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product: request.product,
                    location: request.location,
                    quantity: request.quantity
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSellers(data.sellers);
                if (data.userLocation) {
                    setUserLocation(data.userLocation);
                    setMapCenter([data.userLocation.lat, data.userLocation.lon]);
                    setMapZoom(10);
                }
                addToast(`${data.totalFound} ${t('ironSnapp.toasts.sellersFound')}`, 'success');
            }
        } catch (error) {
            console.error(error);
            addToast(t('ironSnapp.toasts.failedToFind'), 'error');
        } finally {
            setLoading(false);
            setCheckingCredit(false);
        }
    };

    const filteredSellers = sellers.filter(seller => {
        if (showVerifiedOnly && !seller.verified) return false;
        if (priceFilter === 'low' && seller.pricePerUnitNum > 28000) return false;
        if (priceFilter === 'medium' && (seller.pricePerUnitNum < 28000 || seller.pricePerUnitNum > 32000)) return false;
        if (priceFilter === 'high' && seller.pricePerUnitNum < 32000) return false;
        return true;
    });

    const calculateBenefit = (seller: SellerWithLocation) => {
        if (sellers.length === 0) return { savings: 0, savingsPercent: 0, benefitScore: 0, recommendationKey: '' };
        
        const maxPrice = Math.max(...sellers.map(s => s.totalPriceNum));
        const minPrice = Math.min(...sellers.map(s => s.totalPriceNum));
        const avgPrice = sellers.reduce((sum, s) => sum + s.totalPriceNum, 0) / sellers.length;
        
        const priceSavings = maxPrice - seller.totalPriceNum;
        const savingsVsAvg = avgPrice - seller.totalPriceNum;
        const savingsPercent = maxPrice > 0 ? Math.round((priceSavings / maxPrice) * 100) : 0;
        
        const distancePenalty = seller.distanceKm > 100 ? (seller.distanceKm - 100) * 1000 : 0;
        const verifiedBonus = seller.verified ? 5000000 : 0;
        const ratingBonus = (seller.rating || 3) * 1000000;
        
        const benefitScore = priceSavings + verifiedBonus + ratingBonus - distancePenalty;
        
        let recommendationKey = '';
        if (seller.totalPriceNum === minPrice) {
            recommendationKey = 'bestPrice';
        } else if (savingsVsAvg > 0) {
            recommendationKey = 'belowAverage';
        } else if (seller.verified && seller.rating && seller.rating >= 4.5) {
            recommendationKey = 'topRated';
        } else if (seller.distanceKm < 10) {
            recommendationKey = 'nearby';
        }
        
        return { 
            savings: priceSavings, 
            savingsPercent, 
            benefitScore,
            recommendationKey,
            savingsVsAvg: Math.round(savingsVsAvg)
        };
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('fa-IR').format(num);
    };

    const handleSellerClick = useCallback((seller: SellerWithLocation) => {
        setSelectedSeller(seller);
        setMapCenter([seller.lat, seller.lon]);
        setMapZoom(14);
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-6 px-4">
                <div className="container mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-corp-red rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold"><span className="text-corp-red">Iron</span>Snapp</h1>
                            <p className="text-sm text-slate-300">{t('ironSnapp.subtitle')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4">
                <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {SAMPLE_REQUESTS.map((sample, idx) => (
                            <button
                                key={idx}
                                onClick={() => applySample(sample)}
                                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-all"
                            >
                                {t(`ironSnapp.samples.${sample.labelKey}`)}
                            </button>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <input 
                            type="text" 
                            value={request.product}
                            onChange={e => setRequest({...request, product: e.target.value})}
                            placeholder={t('ironSnapp.form.productPlaceholder')}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-corp-red focus:border-transparent"
                        />
                        <input 
                            type="number" 
                            value={request.quantity}
                            onChange={e => setRequest({...request, quantity: e.target.value})}
                            placeholder={t('ironSnapp.form.qtyPlaceholder')}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-corp-red focus:border-transparent"
                        />
                        <input 
                            type="text" 
                            value={request.location}
                            onChange={e => setRequest({...request, location: e.target.value})}
                            placeholder={t('ironSnapp.form.locationPlaceholder')}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-corp-red focus:border-transparent"
                        />
                        <select
                            value={request.paymentType}
                            onChange={e => setRequest({...request, paymentType: e.target.value as any})}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-corp-red focus:border-transparent"
                        >
                            <option value="cash">{t('ironSnapp.form.paymentCash')}</option>
                            <option value="check">{t('ironSnapp.form.paymentCheck')}</option>
                            <option value="credit">{t('ironSnapp.form.paymentCredit')}</option>
                        </select>
                        <button 
                            onClick={searchSellers}
                            disabled={loading || checkingCredit}
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all ${loading ? 'bg-slate-400' : 'bg-corp-red hover:bg-red-700'}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                                    <span>{t('ironSnapp.form.searching')}</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                    <span>{t('ironSnapp.form.findSellers')}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {sellers.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-sm font-medium text-slate-600">{t('ironSnapp.filters.title')}:</span>
                            <div className="flex gap-2">
                                {(['all', 'low', 'medium', 'high'] as const).map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setPriceFilter(filter)}
                                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${priceFilter === filter ? 'bg-corp-red text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        {filter === 'all' ? t('ironSnapp.filters.allPrices') : filter === 'low' ? t('ironSnapp.filters.budget') : filter === 'medium' ? t('ironSnapp.filters.midRange') : t('ironSnapp.filters.premium')}
                                    </button>
                                ))}
                            </div>
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showVerifiedOnly}
                                    onChange={e => setShowVerifiedOnly(e.target.checked)}
                                    className="rounded text-corp-red focus:ring-corp-red"
                                />
                                {t('ironSnapp.filters.verifiedOnly')}
                            </label>
                            <span className="ml-auto text-sm text-slate-500">
                                {filteredSellers.length} {t('ironSnapp.filters.of')} {sellers.length} {t('ironSnapp.filters.sellers')}
                            </span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-slate-200" style={{ height: '75vh', minHeight: '500px' }}>
                        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-corp-red" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-semibold">{t('ironSnapp.map.title')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> {t('ironSnapp.map.best')}</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> {t('ironSnapp.map.good')}</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> {t('ironSnapp.map.high')}</span>
                            </div>
                        </div>
                        <MapContainer
                            center={mapCenter}
                            zoom={mapZoom}
                            style={{ height: 'calc(100% - 40px)', width: '100%' }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapController center={mapCenter} zoom={mapZoom} />
                            
                            {userLocation && (
                                <>
                                    <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
                                        <Popup>
                                            <div className="text-center">
                                                <strong>Your Location</strong>
                                                <p className="text-sm text-slate-600">{request.location}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                    <Circle
                                        center={[userLocation.lat, userLocation.lon]}
                                        radius={50000}
                                        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
                                    />
                                </>
                            )}
                            
                            {filteredSellers.map((seller, index) => {
                                const benefit = calculateBenefit(seller);
                                return (
                                    <Marker
                                        key={index}
                                        position={[seller.lat, seller.lon]}
                                        icon={getMarkerIcon(seller.matchScore, selectedSeller?.sellerName === seller.sellerName)}
                                        eventHandlers={{
                                            click: () => handleSellerClick(seller)
                                        }}
                                    >
                                        <Popup>
                                            <div className="min-w-[240px]">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <strong className="text-base">{seller.sellerName}</strong>
                                                    {seller.verified && (
                                                        <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">Verified</span>
                                                    )}
                                                </div>
                                                {benefit.recommendationKey && (
                                                    <div className={`text-xs font-bold mb-2 px-2 py-1 rounded-full inline-block ${
                                                        benefit.recommendationKey === 'bestPrice' ? 'bg-green-100 text-green-700' :
                                                        benefit.recommendationKey === 'topRated' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {t(`ironSnapp.recommendations.${benefit.recommendationKey}`)}
                                                    </div>
                                                )}
                                                <p className="text-sm text-slate-600 mb-2">{seller.location}</p>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                        <span className="text-slate-500">Price:</span>
                                                        <p className="font-bold text-corp-red">{seller.pricePerUnit}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500">Distance:</span>
                                                        <p className="font-bold">{seller.distanceKm} km</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-3 pt-2 border-t border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50 -mx-3 px-3 py-2 rounded-b">
                                                    <div className="text-xs font-semibold text-green-800 mb-1">Estimated Benefit</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <span className="text-slate-500 text-xs">vs Highest:</span>
                                                            <p className="font-bold text-green-600 text-sm">
                                                                {benefit.savings > 0 ? `${formatNumber(benefit.savings)} تومان` : '-'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500 text-xs">You Save:</span>
                                                            <p className="font-bold text-green-600 text-sm">
                                                                {benefit.savingsPercent > 0 ? `${benefit.savingsPercent}%` : '0%'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>

                    <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '75vh', minHeight: '500px' }}>
                        {!sellers.length && !loading && (
                            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('ironSnapp.noSellers.title')}</h3>
                                <p className="text-sm text-slate-500">{t('ironSnapp.noSellers.desc')}</p>
                            </div>
                        )}

                        {creditResult && (
                            <div className={`rounded-xl border p-4 ${creditResult.allowed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-center gap-2">
                                    {creditResult.allowed ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    )}
                                    <span className={`font-bold ${creditResult.allowed ? 'text-green-800' : 'text-red-800'}`}>
                                        {creditResult.allowed ? 'Credit Approved' : 'Credit Rejected'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 mt-1">Score: {creditResult.score}/1000</p>
                            </div>
                        )}

                        {filteredSellers.map((seller, index) => {
                            const benefit = calculateBenefit(seller);
                            return (
                                <div 
                                    key={index}
                                    onClick={() => handleSellerClick(seller)}
                                    className={`bg-white rounded-xl shadow-md border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${selectedSeller?.sellerName === seller.sellerName ? 'border-corp-red' : 'border-transparent hover:border-slate-200'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900">{seller.sellerName}</h3>
                                                {seller.verified && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                {seller.city} - {seller.distanceKm} km
                                            </p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${seller.matchScore >= 80 ? 'bg-green-500' : seller.matchScore >= 60 ? 'bg-yellow-500' : seller.matchScore >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}>
                                            {seller.matchScore}
                                        </div>
                                    </div>

                                    {benefit.recommendationKey && (
                                        <div className={`text-xs font-bold mb-2 px-2 py-1 rounded-full inline-block ${
                                            benefit.recommendationKey === 'bestPrice' ? 'bg-green-100 text-green-700' :
                                            benefit.recommendationKey === 'topRated' ? 'bg-blue-100 text-blue-700' :
                                            benefit.recommendationKey === 'nearby' ? 'bg-purple-100 text-purple-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {t(`ironSnapp.recommendations.${benefit.recommendationKey}`)}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-slate-500 text-xs">{t('ironSnapp.results.price')}</span>
                                            <p className="font-bold text-corp-red">{seller.pricePerUnit}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 text-xs">{t('ironSnapp.results.total')}</span>
                                            <p className="font-semibold text-slate-800">{seller.totalPrice}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 text-xs">{t('ironSnapp.results.delivery')}</span>
                                            <p className="text-slate-700">{seller.deliveryTime}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 text-xs">{t('ironSnapp.results.payment')}</span>
                                            <p className="text-slate-700 text-xs">{seller.paymentFlexibility}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-2 border-t border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50 -mx-4 px-4 py-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xs text-green-700 font-semibold">{t('ironSnapp.results.youSave')}</span>
                                                <p className="font-bold text-green-600">
                                                    {benefit.savings > 0 ? `${formatNumber(benefit.savings)} تومان` : t('ironSnapp.results.highestPrice')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-slate-500">{t('ironSnapp.results.vsMax')}</span>
                                                <p className={`font-bold text-lg ${benefit.savingsPercent > 10 ? 'text-green-600' : benefit.savingsPercent > 0 ? 'text-yellow-600' : 'text-red-500'}`}>
                                                    {benefit.savingsPercent > 0 ? `-${benefit.savingsPercent}%` : '0%'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {seller.rating && (
                                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-sm font-medium">{seller.rating}</span>
                                        </div>
                                    )}

                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleContactSeller(seller);
                                        }}
                                        className="w-full mt-3 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all"
                                    >
                                        {t('ironSnapp.contactSeller')}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {showServicesModal && contactingSeller && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowServicesModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{t('ironSnapp.connectionServices.title')}</h2>
                                    <p className="text-slate-300 mt-1">{t('ironSnapp.connectionServices.subtitle')}</p>
                                </div>
                                <button onClick={() => setShowServicesModal(false)} className="text-white/60 hover:text-white p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="mt-4 bg-white/10 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-corp-red rounded-full flex items-center justify-center text-white font-bold">
                                    {contactingSeller.matchScore}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{contactingSeller.sellerName}</h3>
                                    <p className="text-slate-300 text-sm">{contactingSeller.city} • {contactingSeller.pricePerUnit}</p>
                                </div>
                                <a 
                                    href={`tel:${contactingSeller.phone}`} 
                                    className="mr-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    {t('ironSnapp.connectionServices.callNow')}
                                </a>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {connectionServices.map((service) => {
                                    const serviceData = t(`ironSnapp.connectionServices.${service.key}`);
                                    const features = serviceData?.features || [];
                                    return (
                                        <div key={service.key} className="bg-white border-2 border-slate-100 rounded-xl p-5 hover:border-slate-300 hover:shadow-lg transition-all group">
                                            <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                                {service.icon}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                                {serviceData?.title || service.key}
                                            </h3>
                                            <p className="text-sm text-slate-600 mb-4">
                                                {serviceData?.desc || ''}
                                            </p>
                                            
                                            <ul className="space-y-2 mb-4">
                                                {Array.isArray(features) && features.slice(0, 4).map((feature: string, idx: number) => (
                                                    <li key={idx} className="text-xs text-slate-500 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                            
                                            <button 
                                                onClick={() => handleServiceRequest(service.key)}
                                                className={`w-full py-2 bg-gradient-to-r ${service.color} text-white text-sm font-bold rounded-lg hover:opacity-90 transition-all`}
                                            >
                                                {t('ironSnapp.connectionServices.requestService')}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => { setShowServicesModal(false); setShowTrustSafety(true); }}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-all"
                                >
                                    <div className="bg-white/20 p-3 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div className="text-right flex-1">
                                        <p className="font-bold">{language === 'fa' ? 'مرکز اعتماد و امنیت' : 'Trust & Safety Center'}</p>
                                        <p className="text-sm text-white/80">{language === 'fa' ? 'وکیل، محضر، پرداخت امن' : 'Lawyer, Notary, Secure Payment'}</p>
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={() => { setShowServicesModal(false); setReviewSeller(contactingSeller); setShowReviews(true); }}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-all"
                                >
                                    <div className="bg-white/20 p-3 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                    <div className="text-right flex-1">
                                        <p className="font-bold">{language === 'fa' ? 'نظرات خریداران' : 'Customer Reviews'}</p>
                                        <p className="text-sm text-white/80">{language === 'fa' ? 'مشاهده و ثبت نظر' : 'View & Write Reviews'}</p>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-4 bg-slate-50 rounded-xl p-4 flex items-center gap-4">
                                <div className="bg-slate-200 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-600">
                                        {language === 'fa' 
                                            ? 'برای هماهنگی خدمات تکمیلی و انجام معامله امن، با تیم پشتیبانی استیل آنلاین تماس بگیرید.'
                                            : 'For coordinating additional services and secure transactions, contact Steel Online support team.'}
                                    </p>
                                </div>
                                <a href="tel:02122041655" className="bg-corp-red hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    021-22041655
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <TrustSafetyPanel 
                isOpen={showTrustSafety}
                onClose={() => setShowTrustSafety(false)}
                sellerName={contactingSeller?.sellerName}
                transactionAmount={contactingSeller ? `${request.quantity} ${language === 'fa' ? 'تن' : 'tons'} - ${contactingSeller.totalPrice}` : undefined}
            />

            {showReviews && reviewSeller && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReviews(false)}>
                    <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end mb-2">
                            <button onClick={() => setShowReviews(false)} className="bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <ReviewSystem 
                            sellerId={reviewSeller.sellerName}
                            sellerName={reviewSeller.sellerName}
                            currentUser={null}
                            onLoginRequired={() => {}}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default IronSnappPage;
