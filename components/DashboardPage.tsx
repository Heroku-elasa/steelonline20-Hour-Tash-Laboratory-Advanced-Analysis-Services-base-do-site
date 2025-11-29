
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../types';

// Mock Data for Charts
const salesData = [
  { month: 'Farvardin', value: 120 },
  { month: 'Ordibehesht', value: 145 },
  { month: 'Khordad', value: 130 },
  { month: 'Tir', value: 160 },
  { month: 'Mordad', value: 150 },
  { month: 'Shahrivar', value: 175 },
];

const distData = [
    { label: 'Rebar', value: 45, color: '#ef4444' }, // red-500
    { label: 'Beams', value: 30, color: '#3b82f6' }, // blue-500
    { label: 'Sheets', value: 15, color: '#10b981' }, // green-500
    { label: 'Profiles', value: 10, color: '#f59e0b' }, // amber-500
];

const Tooltip = ({ x, y, children }: { x: number, y: number, children?: React.ReactNode }) => (
    <div 
        className="absolute bg-slate-800 text-white text-xs rounded px-2 py-1 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 z-10 shadow-lg whitespace-nowrap"
        style={{ left: x, top: y - 5 }}
    >
        {children}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1 border-4 border-transparent border-t-slate-800"></div>
    </div>
);

const SalesChart = ({ title }: { title: string }) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    
    const maxVal = Math.max(...salesData.map(d => d.value));

    const handleMouseMove = (e: React.MouseEvent, index: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
        setHovered(index);
    };

    return (
        <div className="h-64 bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative" ref={containerRef}>
            <h3 className="font-bold text-slate-700 mb-6">{title}</h3>
            <div className="flex items-end justify-between h-40 gap-2 px-2 border-b border-slate-100 pb-2">
                {salesData.map((d, i) => {
                    const barHeight = (d.value / maxVal) * 100;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                            <div 
                                className={`w-full rounded-t-sm transition-all duration-300 relative cursor-pointer ${hovered === i ? 'bg-corp-red' : 'bg-corp-red/70'}`}
                                style={{ height: `${barHeight}%` }}
                                onMouseMove={(e) => handleMouseMove(e, i)}
                                onMouseLeave={() => setHovered(null)}
                            >
                            </div>
                            <span className="text-[10px] text-slate-500 truncate w-full text-center">{d.month}</span>
                        </div>
                    );
                })}
            </div>
             {hovered !== null && (
                <Tooltip x={mousePos.x} y={mousePos.y}>
                    <p className="font-bold">{salesData[hovered].month}</p>
                    <p>{salesData[hovered].value}M IRR</p>
                </Tooltip>
            )}
        </div>
    );
};

const ProductDistChart = ({ title }: { title: string }) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const total = distData.reduce((acc, curr) => acc + curr.value, 0);
    let cumulativePercent = 0;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };
    
    return (
        <div className="h-64 bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative flex flex-col" ref={containerRef}>
            <h3 className="font-bold text-slate-700 mb-4">{title}</h3>
            <div className="flex-1 flex items-center justify-center gap-8">
                <div className="relative w-32 h-32">
                    <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                        {distData.map((d, i) => {
                            const startPercent = cumulativePercent;
                            const endPercent = cumulativePercent + (d.value / total);
                            cumulativePercent = endPercent;

                            const [startX, startY] = getCoordinatesForPercent(startPercent);
                            const [endX, endY] = getCoordinatesForPercent(endPercent);
                            
                            const largeArcFlag = d.value / total > 0.5 ? 1 : 0;
                            
                            const pathData = [
                                `M ${startX} ${startY}`,
                                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                `L 0 0`,
                            ].join(' ');

                            return (
                                <path 
                                    key={i} 
                                    d={pathData} 
                                    fill={d.color} 
                                    stroke="white" 
                                    strokeWidth="0.05"
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                    onMouseEnter={() => setHovered(i)}
                                    onMouseLeave={() => setHovered(null)}
                                />
                            );
                        })}
                        <circle cx="0" cy="0" r="0.6" fill="white" />
                    </svg>
                    {hovered !== null && (
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-xs text-slate-500 font-bold">{distData[hovered].label}</p>
                                <p className="text-sm font-bold text-slate-800">{distData[hovered].value}%</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    {distData.map((d, i) => (
                        <div key={i} className={`flex items-center gap-2 text-xs transition-opacity ${hovered !== null && hovered !== i ? 'opacity-30' : 'opacity-100'}`}>
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                            <span className="text-slate-600 font-medium">{d.label}</span>
                            <span className="text-slate-400">{d.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { t, dir } = useLanguage();
    const [activeSection, setActiveSection] = useState('overview');

    const metrics = [
        { label: t('dashboard.metrics.orders'), value: '24', change: '↑ 12%', isPositive: true },
        { label: t('dashboard.metrics.sales'), value: '1,250,000,000 IRR', change: '↑ 8%', isPositive: true },
        { label: t('dashboard.metrics.newCustomers'), value: '8', change: '↑ 25%', isPositive: true },
        { label: t('dashboard.metrics.visits'), value: '1,542', change: '↓ 5%', isPositive: false },
    ];

    const recentOrders = [
        { id: '#1234', customer: 'شرکت آلفا', product: 'میلگرد ۱۴', amount: '500,000,000', status: 'در انتظار', statusColor: 'bg-yellow-100 text-yellow-700' },
        { id: '#1233', customer: 'آقای احمدی', product: 'تیرآهن ۱۸', amount: '320,000,000', status: 'ارسال شده', statusColor: 'bg-blue-100 text-blue-700' },
        { id: '#1232', customer: 'پیمانکاری سازه', product: 'ورق سیاه ۱۰', amount: '180,000,000', status: 'تکمیل شده', statusColor: 'bg-green-100 text-green-700' },
        { id: '#1231', customer: 'بازرگانی آهن', product: 'نبشی ۵', amount: '450,000,000', status: 'لغو شده', statusColor: 'bg-red-100 text-red-700' },
    ];

    const livePrices = [
        { product: 'میلگرد ۱۴ اصفهان', price: '28,500', change: '↑ 2%', time: '10:30' },
        { product: 'میلگرد ۱۶ بناب', price: '28,200', change: '↓ 1%', time: '10:25' },
        { product: 'تیرآهن ۱۴ ذوب آهن', price: '32,000', change: '─ 0%', time: '10:30' },
        { product: 'ورق سیاه ۲ میل', price: '38,500', change: '↑ 1.5%', time: '10:15' },
    ];

    const menuItems = [
        { key: 'overview', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
        { key: 'live', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
        { key: 'products', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
        { key: 'pricing', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
        { key: 'orders', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
        { key: 'customers', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
        { key: 'reports', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
        { key: 'settings', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    ];

    const LiveDashboard = () => {
        const [candles, setCandles] = useState<{time: number, open: number, close: number, high: number, low: number}[]>([]);
        const [realtimeOrders, setRealtimeOrders] = useState<{product: string, quantity: string, city: string, time: string, status: string}[]>([]);
        const [activeUsers, setActiveUsers] = useState(124);
        const [tickerItems, setTickerItems] = useState([
            { product: 'Rebar 14 Esf', price: 28500, change: 1.2 },
            { product: 'IPE 180 Zob', price: 34200, change: -0.5 },
            { product: 'Sheet 2mm', price: 38100, change: 0.8 },
            { product: 'Rebar 16 Bonab', price: 27900, change: -1.5 },
            { product: 'Profile 2x2', price: 42000, change: 0.0 },
        ]);
        const scrollRef = useRef<HTMLDivElement>(null);

        // Simulate Real-time Data
        useEffect(() => {
            // Initial candles for Rebar Price
            let lastPrice = 28500;
            const initialCandles = [];
            let now = Date.now();
            for (let i = 0; i < 40; i++) {
                const open = lastPrice;
                const close = open + (Math.random() - 0.5) * 100;
                const high = Math.max(open, close) + Math.random() * 30;
                const low = Math.min(open, close) - Math.random() * 30;
                initialCandles.push({ time: now - (40 - i) * 1000, open, close, high, low });
                lastPrice = close;
            }
            setCandles(initialCandles);

            // Simulation Interval
            const interval = setInterval(() => {
                // Update Candles
                setCandles(prev => {
                    const last = prev[prev.length - 1];
                    const open = last.close;
                    const change = (Math.random() - 0.5) * 50; 
                    const close = open + change;
                    const high = Math.max(open, close) + Math.random() * 10;
                    const low = Math.min(open, close) - Math.random() * 10;
                    const newCandle = { time: Date.now(), open, close, high, low };
                    return [...prev.slice(1), newCandle];
                });

                // Update Active Users
                setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);

                // Update Ticker
                setTickerItems(prev => prev.map(item => ({
                    ...item,
                    price: Math.floor(item.price + (Math.random() - 0.5) * 50),
                    change: parseFloat((item.change + (Math.random() - 0.5) * 0.1).toFixed(2))
                })));

                // Simulate New Orders
                if (Math.random() > 0.6) {
                    const products = ['Rebar 14', 'Rebar 16', 'IPE 140', 'IPE 180', 'Sheet 2mm', 'Sheet 10mm', 'Corner 5'];
                    const cities = ['Tehran', 'Isfahan', 'Mashhad', 'Tabriz', 'Shiraz', 'Ahvaz', 'Yazd'];
                    const statuses = ['Processing', 'Confirmed', 'Pending'];
                    const newOrder = {
                        product: products[Math.floor(Math.random() * products.length)],
                        quantity: (Math.floor(Math.random() * 25) + 1) + ' Tons',
                        city: cities[Math.floor(Math.random() * cities.length)],
                        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                        status: statuses[Math.floor(Math.random() * statuses.length)]
                    };
                    setRealtimeOrders(prev => [newOrder, ...prev].slice(0, 10)); // Keep last 10
                }
            }, 1500);

            return () => clearInterval(interval);
        }, []);

        useEffect(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = 0; 
            }
        }, [realtimeOrders]);

        // Simple SVG Chart Config
        const width = 600;
        const height = 300;
        
        // Calculate max/min for scaling with safety check
        const highs = candles.map(c => c.high);
        const lows = candles.map(c => c.low);
        const maxPrice = highs.length ? Math.max(...highs) : 1000;
        const minPrice = lows.length ? Math.min(...lows) : 0;
        const range = maxPrice - minPrice || 1;
        
        const getY = (price: number) => height - ((price - minPrice) / range) * height;

        return (
            <div className="space-y-6 animate-fade-in">
                {/* Ticker */}
                <div className="bg-slate-900 text-white p-3 rounded-lg overflow-hidden whitespace-nowrap flex gap-8 shadow-md">
                     {tickerItems.map((item, i) => (
                         <div key={i} className="flex items-center gap-2">
                             <span className="font-bold text-slate-400">{item.product}</span>
                             <span>{item.price.toLocaleString()}</span>
                             <span className={item.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                                 {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change)}%
                             </span>
                         </div>
                     ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart */}
                    <div className="lg:col-span-2 bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {t('dashboard.live.risingwave')}
                            </h3>
                            <div className="flex gap-2 text-xs">
                                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded cursor-pointer hover:bg-slate-600">1M</span>
                                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded cursor-pointer hover:bg-slate-600">5M</span>
                                <span className="bg-corp-blue text-white px-2 py-1 rounded">15M</span>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                                {candles.map((c, i) => {
                                    const x = (i / 40) * width; // 40 candles shown
                                    const candleW = (width / 40) * 0.6;
                                    const yHigh = getY(c.high);
                                    const yLow = getY(c.low);
                                    const yOpen = getY(c.open);
                                    const yClose = getY(c.close);
                                    const isGreen = c.close >= c.open;
                                    const color = isGreen ? '#10B981' : '#EF4444';
                                    
                                    return (
                                        <g key={c.time}>
                                            <line x1={x + candleW/2} y1={yLow} x2={x + candleW/2} y2={yHigh} stroke={color} strokeWidth="1" />
                                            <rect 
                                                x={x} 
                                                y={Math.min(yOpen, yClose)} 
                                                width={candleW} 
                                                height={Math.max(1, Math.abs(yOpen - yClose))} 
                                                fill={color} 
                                            />
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    {/* Order Stream & Stats */}
                    <div className="space-y-4">
                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
                             <h3 className="text-white font-bold mb-4">{t('dashboard.live.systemStatus')}</h3>
                             <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Active Users</span>
                                    <span className="text-white font-mono">{activeUsers}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Order/Sec</span>
                                    <span className="text-green-400 font-mono">12.5</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Latency</span>
                                    <span className="text-green-400 font-mono">24ms</span>
                                </div>
                             </div>
                        </div>
                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex-1 overflow-hidden shadow-lg h-60">
                             <h3 className="text-white font-bold mb-3">{t('dashboard.live.logs')}</h3>
                             <div className="space-y-2 h-44 overflow-y-auto font-mono text-xs pr-1" ref={scrollRef}>
                                {realtimeOrders.map((order, i) => (
                                    <div key={i} className="flex gap-2 text-slate-300 border-b border-slate-700/50 pb-1 animate-fade-in">
                                        <span className="text-slate-500 opacity-70">{order.time}</span>
                                        <span className="text-corp-blue-light">{order.product}</span>
                                        <span className="text-slate-400">{order.quantity}</span>
                                        <span className="ml-auto text-slate-500 opacity-70">{order.city}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-100 flex animate-fade-in" dir={dir}>
            {/* Sidebar */}
            <aside className="w-20 md:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all duration-300">
                <div className="h-16 flex items-center justify-center border-b border-slate-800">
                     <span className="text-2xl font-bold text-corp-red hidden md:block">S.O.20</span>
                     <span className="text-2xl font-bold text-corp-red md:hidden">S</span>
                </div>
                <nav className="flex-1 py-4 space-y-1">
                    {menuItems.map(item => (
                        <button
                            key={item.key}
                            onClick={() => setActiveSection(item.key)}
                            className={`w-full flex items-center px-4 py-3 transition-colors ${activeSection === item.key ? 'bg-corp-red text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            {item.icon}
                            <span className="mx-3 hidden md:block text-sm font-medium">{t(`dashboard.menu.${item.key}`)}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                        <div className="hidden md:block">
                            <p className="text-sm font-bold">Admin</p>
                            <p className="text-xs text-slate-500">Super User</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
                    <h1 className="text-xl font-bold text-slate-800">{t(`dashboard.menu.${activeSection}`)}</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <div className="p-6">
                    {activeSection === 'overview' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {metrics.map((metric, i) => (
                                    <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                                        <p className="text-sm text-slate-500 font-medium">{metric.label}</p>
                                        <div className="mt-2 flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-slate-800">{metric.value}</span>
                                            <span className={`text-xs font-bold ${metric.isPositive ? 'text-green-500' : 'text-red-500'}`}>{metric.change}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                             {/* Interactive Charts Section */}
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <SalesChart title={t('dashboard.charts.salesTitle')} />
                                <ProductDistChart title={t('dashboard.charts.productDist')} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Recent Orders Table */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-800">{t('dashboard.tables.ordersTitle')}</h3>
                                        <button className="text-corp-blue-dark text-sm hover:underline">View All</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-500">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium">{t('dashboard.tables.headers.orderId')}</th>
                                                    <th className="px-6 py-3 font-medium">{t('dashboard.tables.headers.customer')}</th>
                                                    <th className="px-6 py-3 font-medium">{t('dashboard.tables.headers.amount')}</th>
                                                    <th className="px-6 py-3 font-medium text-right">{t('dashboard.tables.headers.status')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {recentOrders.map((order, i) => (
                                                    <tr key={i} className="hover:bg-slate-50">
                                                        <td className="px-6 py-3 font-mono text-slate-600">{order.id}</td>
                                                        <td className="px-6 py-3 font-medium text-slate-800">{order.customer}</td>
                                                        <td className="px-6 py-3 text-slate-600">{order.amount}</td>
                                                        <td className="px-6 py-3 text-right">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>{order.status}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                                {/* Live Prices List */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h3 className="font-bold text-slate-800">{t('dashboard.tables.pricesTitle')}</h3>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {livePrices.map((item, i) => (
                                            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                                                <div>
                                                    <p className="font-bold text-slate-800">{item.product}</p>
                                                    <p className="text-xs text-slate-400">{item.time}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-mono font-bold text-slate-700">{item.price}</p>
                                                    <p className={`text-xs font-bold ${item.change.includes('↑') ? 'text-green-500' : item.change.includes('↓') ? 'text-red-500' : 'text-slate-400'}`}>
                                                        {item.change}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'live' && <LiveDashboard />}

                    {activeSection !== 'overview' && activeSection !== 'live' && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            <p className="text-lg">Section under construction</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;