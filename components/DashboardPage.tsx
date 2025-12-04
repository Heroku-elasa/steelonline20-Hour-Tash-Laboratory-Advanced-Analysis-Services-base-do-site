
import React, { useState, useEffect } from 'react';
import { useLanguage, Page, DashboardStats, AuditAlert, CheckItem, AuditDocument, CustomerCredit } from '../types';
import { getDashboardStats, getAlerts, getChecks, getAuditDocuments, getCustomers, checkAndSeedDatabase, getSEOReports, runDatabaseDiagnostics } from '../services/dashboardService';
import { StatCard, InternalControlGauge, AlertsList, CheckStatusChart, CashFlowChart } from './DashboardComponents';
import { useToast } from './Toast';

interface DashboardPageProps {
    setPage: (page: Page) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ setPage }) => {
    const { t, dir, language } = useLanguage();
    const { addToast } = useToast();
    const [activeSection, setActiveSection] = useState('overview');
    
    // Data State
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [alerts, setAlerts] = useState<AuditAlert[]>([]);
    const [checks, setChecks] = useState<CheckItem[]>([]);
    const [auditDocs, setAuditDocs] = useState<AuditDocument[]>([]);
    const [customers, setCustomers] = useState<CustomerCredit[]>([]);
    const [seoReports, setSeoReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbStatus, setDbStatus] = useState<string>('checking');
    
    // Diagnostics State
    const [diagLogs, setDiagLogs] = useState<any[]>([]);
    const [runningDiag, setRunningDiag] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Try to seed/check DB first
                const seedRes = await checkAndSeedDatabase();
                if (seedRes.success) {
                    setDbStatus('connected');
                } else {
                    setDbStatus('needs_setup');
                    setActiveSection('system'); // Auto-navigate to system if not setup
                }

                // Pass language to service to get localized data
                const [statsData, alertsData, checksData, docsData, customersData, seoData] = await Promise.all([
                    getDashboardStats(),
                    getAlerts(language),
                    getChecks(),
                    getAuditDocuments(language),
                    getCustomers(),
                    getSEOReports().catch(() => [])
                ]);
                setStats(statsData);
                setAlerts(alertsData);
                setChecks(checksData);
                setAuditDocs(docsData);
                setCustomers(customersData);
                setSeoReports(seoData || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                setDbStatus('error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [language]);

    const handleSync = async () => {
        addToast("Attempting to sync with database...", "info");
        const res = await checkAndSeedDatabase();
        if (res.success) {
            setDbStatus('connected');
            addToast("Database synced successfully.", "success");
            // Reload data
            const checksData = await getChecks();
            setChecks(checksData);
            const alertsData = await getAlerts(language);
            setAlerts(alertsData);
            const customersData = await getCustomers();
            setCustomers(customersData);
            const seoData = await getSEOReports().catch(() => []);
            setSeoReports(seoData || []);
        } else {
            setDbStatus('needs_setup');
            addToast("Sync failed. Check tables in Supabase.", "error");
        }
    };
    
    const handleRunDiagnostics = async () => {
        setRunningDiag(true);
        setDiagLogs([]);
        const logs = await runDatabaseDiagnostics();
        setDiagLogs(logs);
        setRunningDiag(false);
    };

    const menuItems = [
        { key: 'overview', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
        { key: 'financial', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { key: 'audit', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { key: 'customers', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
        { key: 'reports', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        { key: 'system', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg> }
    ];

    const safeNumber = (val: number | string | undefined): number => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseFloat(val.replace(/,/g, '')) || 0;
        return 0;
    };

    const formatCurrency = (amount: number | string) => {
        const num = safeNumber(amount);
        if (language === 'fa') {
            return (num / 1000000000).toLocaleString('fa-IR') + ' میلیارد ریال';
        }
        return (num / 1000000000).toFixed(1) + 'B IRR';
    };

    const formatNumber = (num: number | string) => {
        const n = safeNumber(num);
        return language === 'fa' ? n.toLocaleString('fa-IR') : n.toLocaleString();
    };

    return (
        <div className="min-h-screen bg-[#f0f0f1] flex animate-fade-in" dir={dir}>
            {/* Sidebar */}
            <aside className="w-16 md:w-56 bg-[#1d2327] text-white flex flex-col flex-shrink-0 transition-all duration-300 relative z-20">
                <div className="h-14 flex items-center justify-center border-b border-[#3c434a] bg-[#1d2327]">
                     <span className="text-xl font-bold text-white hidden md:block">Steel Online 20</span>
                     <span className="text-xl font-bold text-white md:hidden">S</span>
                </div>
                
                <div className="border-b border-[#3c434a] mb-2">
                    <button onClick={() => setPage('home')} className="w-full flex items-center px-4 py-3 text-[#f0f0f1] hover:text-[#72aee6] hover:bg-[#2c3338] transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 group-hover:text-[#72aee6] transition-colors ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        <span className="hidden md:block text-sm font-medium">
                            {language === 'fa' ? 'مشاهده سایت' : 'Visit Site'}
                        </span>
                    </button>
                </div>

                <nav className="flex-1 py-2 space-y-0.5">
                    {menuItems.map(item => (
                        <button key={item.key} onClick={() => setActiveSection(item.key)} className={`w-full flex items-center px-4 py-3 transition-colors relative group ${activeSection === item.key ? 'bg-[#2271b1] text-white' : 'text-[#f0f0f1] hover:bg-[#2c3338] hover:text-[#72aee6]'}`}>
                            {activeSection === item.key && (
                                <div className={`absolute top-0 bottom-0 w-1 bg-[#72aee6] md:hidden ${dir === 'rtl' ? 'right-0' : 'left-0'}`}></div>
                            )}
                            <div className={`${activeSection === item.key ? 'text-white' : 'text-[#a7aaad] group-hover:text-[#72aee6]'}`}>{item.icon}</div>
                            <span className={`hidden md:block text-sm font-medium ${dir === 'rtl' ? 'mr-3' : 'ml-3'}`}>
                                {item.key === 'system' ? 'System & DB' : t(`dashboard.menu.${item.key}`)}
                            </span>
                            {activeSection === item.key && (
                                <div className={`hidden md:block absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#f0f0f1] rotate-45 ${dir === 'rtl' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'}`}></div>
                            )}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f0f0f1]">
                {/* Header */}
                <header className="bg-white shadow-sm h-14 flex items-center justify-between px-6 sticky top-0 z-10 border-b border-[#dcdcde]">
                    <h1 className="text-lg font-semibold text-[#1d2327]">
                        {activeSection === 'system' ? 'System Status' : t(`dashboard.menu.${activeSection}`)}
                    </h1>
                    <div className="flex items-center gap-4">
                        {dbStatus === 'connected' ? (
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span> DB Connected
                            </span>
                        ) : (
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> DB Missing
                            </span>
                        )}
                        <span className="text-xs text-slate-500 font-mono">v2.4.0</span>
                    </div>
                </header>

                <div className="p-6">
                    {loading ? (
                         <div className="flex items-center justify-center h-64">
                             <div className="w-10 h-10 border-4 border-slate-200 border-t-corp-blue rounded-full animate-spin"></div>
                         </div>
                    ) : (
                        <>
                            {activeSection === 'overview' && stats && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <StatCard 
                                            title={t('dashboard.stats.totalChecks')} 
                                            value={formatCurrency(stats.totalChecksAmount)} 
                                            change={`${formatNumber(stats.totalChecksCount)} ${t('dashboard.labels.checks')}`} 
                                            color="blue" 
                                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} 
                                        />
                                        <StatCard 
                                            title={t('dashboard.stats.dueThisWeek')} 
                                            value={formatCurrency(stats.checksDueThisWeekAmount)} 
                                            change={`${formatNumber(stats.checksDueThisWeekCount)} ${t('dashboard.labels.urgent')}`} 
                                            color="yellow" 
                                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                                        />
                                        <StatCard 
                                            title={t('dashboard.stats.cashBalance')} 
                                            value={formatCurrency(stats.cashBalance)} 
                                            change={`4 ${t('dashboard.labels.accounts')}`} 
                                            color="green" 
                                            isPositive={true} 
                                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                                        />
                                        <StatCard 
                                            title={t('dashboard.stats.controlScore')} 
                                            value={`${formatNumber(stats.internalControlScore)}/100`} 
                                            change={t('dashboard.labels.good')} 
                                            color="purple" 
                                            isPositive={true} 
                                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Main Chart Section */}
                                        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                            <h3 className="text-lg font-bold text-slate-800 mb-4">{t('dashboard.charts.cashFlow')}</h3>
                                            <CashFlowChart />
                                        </div>
                                        
                                        {/* Alerts Panel */}
                                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                                {t('dashboard.audit.urgentAlerts')}
                                            </h3>
                                            <AlertsList alerts={alerts} />
                                        </div>
                                    </div>

                                    {/* Bottom Widgets */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                            <h3 className="font-bold text-slate-800 mb-4">{t('dashboard.charts.checkStatus')}</h3>
                                            <CheckStatusChart 
                                                cleared={safeNumber(stats.totalChecksCount) - safeNumber(stats.checksDueThisWeekCount) - 2} 
                                                pending={safeNumber(stats.checksDueThisWeekCount)} 
                                                bounced={2} 
                                            />
                                        </div>
                                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-slate-800 mb-2">{t('dashboard.charts.internalControl')}</h3>
                                                <p className="text-sm text-slate-500 mb-4">{t('dashboard.labels.basedOn')}</p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between w-48"><span className="text-slate-500">{t('dashboard.labels.risk')}:</span> <span className="text-green-600 font-bold">{t('dashboard.labels.good')}</span></div>
                                                    <div className="flex justify-between w-48"><span className="text-slate-500">{t('dashboard.labels.monitoring')}:</span> <span className="text-yellow-600 font-bold">{t('dashboard.labels.adequate')}</span></div>
                                                    <div className="flex justify-between w-48"><span className="text-slate-500">{t('dashboard.labels.activities')}:</span> <span className="text-green-600 font-bold">{t('dashboard.labels.strong')}</span></div>
                                                </div>
                                            </div>
                                            <InternalControlGauge score={safeNumber(stats.internalControlScore)} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'financial' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-slate-800">{t('dashboard.financial.title')}</h2>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700">{t('dashboard.financial.registerBtn')}</button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left rtl:text-right">
                                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                                    <tr>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.checkNumber')}</th>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.dueDate')}</th>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.amount')}</th>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.drawer')}</th>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.bank')}</th>
                                                        <th className="px-4 py-3 text-right rtl:text-left">{t('dashboard.tables.headers.status')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {checks.map(check => (
                                                        <tr key={check.id} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3 font-mono">{check.number}</td>
                                                            <td className="px-4 py-3">{check.dueDate}</td>
                                                            <td className="px-4 py-3 font-bold">{formatNumber(check.amount)}</td>
                                                            <td className="px-4 py-3">{check.drawer}</td>
                                                            <td className="px-4 py-3">{check.bank}</td>
                                                            <td className="px-4 py-3 text-right rtl:text-left">
                                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                                    check.status === 'cleared' ? 'bg-green-100 text-green-700' :
                                                                    check.status === 'bounced' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                    {check.status === 'cleared' ? t('dashboard.labels.cleared') : check.status === 'bounced' ? t('dashboard.labels.bounced') : t('dashboard.labels.pending')}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'audit' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <StatCard title={t('dashboard.stats.documentsReviewed')} value={formatNumber(1402)} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
                                        <StatCard title={t('dashboard.stats.discrepancies')} value={formatNumber(12)} color="red" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
                                        <StatCard title={t('dashboard.stats.fraudCases')} value={formatNumber(3)} color="red" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
                                    </div>

                                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                            {t('dashboard.audit.auditLogs')}
                                        </h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left rtl:text-right">
                                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                                    <tr>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.document')}</th>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.type')}</th>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.date')}</th>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.aiRisk')}</th>
                                                        <th className="px-4 py-3 text-right rtl:text-left">{t('dashboard.tables.headers.status')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {auditDocs.map(doc => (
                                                        <tr key={doc.id} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3">
                                                                <p className="font-bold text-slate-800">{doc.title}</p>
                                                                <p className="text-xs text-slate-500">{doc.id}</p>
                                                            </td>
                                                            <td className="px-4 py-3">{doc.type}</td>
                                                            <td className="px-4 py-3">{doc.date}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                                                                    <div 
                                                                        className={`h-2 rounded-full ${doc.riskScore > 70 ? 'bg-red-500' : doc.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                                                        style={{ width: `${doc.riskScore}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-xs mt-1 block">{formatNumber(doc.riskScore)}/100</span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right rtl:text-left">
                                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                                    doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                                    doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                    doc.status === 'flagged' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                    {doc.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'customers' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('dashboard.customers.title')}</h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left rtl:text-right">
                                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                                    <tr>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.customer')}</th>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.type')}</th>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.creditLimit')}</th>
                                                        <th className="px-4 py-3">{t('dashboard.tables.headers.used')}</th>
                                                        <th className="px-4 py-3">{t('dashboard.labels.score')}</th>
                                                        <th className="px-4 py-3 text-right rtl:text-left">{t('dashboard.tables.headers.risk')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {customers.map(c => (
                                                        <tr key={c.id} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3 font-bold text-slate-800">{c.name}</td>
                                                            <td className="px-4 py-3 capitalize">{c.type}</td>
                                                            <td className="px-4 py-3 font-mono">{formatCurrency(c.creditLimit)}</td>
                                                            <td className="px-4 py-3 font-mono">{formatCurrency(c.usedCredit)}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold">{formatNumber(c.creditScore)}</span>
                                                                    <div className="flex-1 bg-slate-200 h-1.5 rounded-full w-16">
                                                                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${c.creditScore / 10}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-right rtl:text-left">
                                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                                    c.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                                                                    c.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                    {c.riskLevel}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'reports' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                        <h2 className="text-xl font-bold text-slate-800 mb-6">SEO & Performance Reports</h2>
                                        <div className="overflow-x-auto">
                                            {seoReports.length > 0 ? (
                                            <table className="w-full text-sm text-left rtl:text-right">
                                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                                    <tr>
                                                        <th className="px-4 py-3">ID</th>
                                                        <th className="px-4 py-3">URL</th>
                                                        <th className="px-4 py-3">Score</th>
                                                        <th className="px-4 py-3">Date</th>
                                                        <th className="px-4 py-3 text-right rtl:text-left">Metrics</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {seoReports.map(report => (
                                                        <tr key={report.id} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3 text-slate-500">#{report.id}</td>
                                                            <td className="px-4 py-3 text-blue-600 font-medium truncate max-w-xs">{report.url}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                                    report.score >= 90 ? 'bg-green-100 text-green-800' :
                                                                    report.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {report.score}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-slate-600">{new Date(report.created_at).toLocaleString()}</td>
                                                            <td className="px-4 py-3 text-right rtl:text-left text-xs text-slate-500">
                                                                {report.metrics ? Object.keys(report.metrics).length + ' Metrics' : 'N/A'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            ) : (
                                                <div className="text-center py-12 text-slate-500">No reports found. Use the SEO Checker tool to generate one.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'system' && (
                                <div className="space-y-6 animate-fade-in bg-white p-6 rounded-lg border border-slate-200">
                                    <h2 className="text-xl font-bold text-slate-800 mb-4">Database Connection & Setup</h2>
                                    
                                    <div className={`p-4 rounded-md border ${dbStatus === 'connected' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`w-3 h-3 rounded-full ${dbStatus === 'connected' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                            <h3 className="font-bold">{dbStatus === 'connected' ? 'Connected to Supabase' : 'Connection/Schema Issue'}</h3>
                                        </div>
                                        <p className="text-sm">{dbStatus === 'connected' ? 'The application is successfully connected to your database.' : 'Could not find the required tables. Please copy the SQL below and run it in your Supabase SQL Editor.'}</p>
                                    </div>
                                    
                                    {/* Diagnostics Panel */}
                                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                            <h3 className="font-bold text-slate-700 text-sm">Connection Diagnostics</h3>
                                            <button 
                                                onClick={handleRunDiagnostics} 
                                                disabled={runningDiag}
                                                className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-700 transition-colors disabled:opacity-50"
                                            >
                                                {runningDiag ? 'Running...' : 'Run Diagnostics'}
                                            </button>
                                        </div>
                                        <div className="p-4 bg-slate-900 min-h-[120px] max-h-60 overflow-y-auto font-mono text-xs">
                                            {diagLogs.length === 0 ? (
                                                <span className="text-slate-500">Ready to run diagnostics. Click the button above.</span>
                                            ) : (
                                                <ul className="space-y-1">
                                                    {diagLogs.map((log, i) => (
                                                        <li key={i} className="flex gap-2">
                                                            <span className="text-slate-500">[{log.step}]</span>
                                                            <span className={log.status === 'success' ? 'text-green-400' : log.status === 'error' ? 'text-red-400' : 'text-blue-300'}>
                                                                {log.message}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    {dbStatus !== 'connected' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <label className="text-sm font-bold text-slate-700">Required Schema (Copy & Paste):</label>
                                                <button onClick={() => { navigator.clipboard.writeText(`-- SEO Reports Table
create table if not exists seo_reports (
  id bigint generated by default as identity primary key,
  url text,
  score numeric,
  metrics jsonb,
  recommendations jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table seo_reports enable row level security;
create policy "Public insert seo" on seo_reports for insert with check (true);
create policy "Public select seo" on seo_reports for select using (true);

-- Financial Checks Table
create table if not exists financial_checks (
  id bigint generated by default as identity primary key,
  number text,
  amount numeric,
  due_date text,
  status text,
  drawer text,
  bank text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table financial_checks enable row level security;
create policy "Public insert checks" on financial_checks for insert with check (true);
create policy "Public select checks" on financial_checks for select using (true);

-- Audit Alerts Table
create table if not exists audit_alerts (
  id bigint generated by default as identity primary key,
  title text,
  type text,
  severity text,
  date text,
  is_read boolean,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table audit_alerts enable row level security;
create policy "Public insert alerts" on audit_alerts for insert with check (true);
create policy "Public select alerts" on audit_alerts for select using (true);

-- Customer Credits Table
create table if not exists customer_credits (
  id bigint generated by default as identity primary key,
  name text,
  type text,
  credit_score numeric,
  credit_limit numeric,
  used_credit numeric,
  risk_level text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table customer_credits enable row level security;
create policy "Public insert credits" on customer_credits for insert with check (true);
create policy "Public select credits" on customer_credits for select using (true);`); addToast("SQL Copied!", "success"); }} className="text-xs text-blue-600 hover:underline">Copy to Clipboard</button>
                                            </div>
                                            <div className="bg-slate-900 text-slate-300 p-4 rounded-md text-xs font-mono overflow-x-auto max-h-96">
                                                <pre>{`-- SEO Reports Table
create table if not exists seo_reports (
  id bigint generated by default as identity primary key,
  url text,
  score numeric,
  metrics jsonb,
  recommendations jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table seo_reports enable row level security;
create policy "Public insert seo" on seo_reports for insert with check (true);
create policy "Public select seo" on seo_reports for select using (true);

-- Financial Checks Table
create table if not exists financial_checks (
  id bigint generated by default as identity primary key,
  number text,
  amount numeric,
  due_date text,
  status text,
  drawer text,
  bank text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table financial_checks enable row level security;
create policy "Public insert checks" on financial_checks for insert with check (true);
create policy "Public select checks" on financial_checks for select using (true);

-- Audit Alerts Table
create table if not exists audit_alerts (
  id bigint generated by default as identity primary key,
  title text,
  type text,
  severity text,
  date text,
  is_read boolean,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table audit_alerts enable row level security;
create policy "Public insert alerts" on audit_alerts for insert with check (true);
create policy "Public select alerts" on audit_alerts for select using (true);

-- Customer Credits Table
create table if not exists customer_credits (
  id bigint generated by default as identity primary key,
  name text,
  type text,
  credit_score numeric,
  credit_limit numeric,
  used_credit numeric,
  risk_level text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table customer_credits enable row level security;
create policy "Public insert credits" on customer_credits for insert with check (true);
create policy "Public select credits" on customer_credits for select using (true);`}</pre>
                                            </div>
                                            <p className="text-sm text-slate-600">After running the SQL in Supabase, click Sync below.</p>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-slate-200">
                                        <button onClick={handleSync} className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors">
                                            Check Connection & Sync Mock Data
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
