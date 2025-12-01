
import React, { useState, useEffect } from 'react';
import { useLanguage, Page, DashboardStats, AuditAlert, CheckItem, AuditDocument, CustomerCredit } from '../types';
import { getDashboardStats, getAlerts, getChecks, getAuditDocuments, getCustomers } from '../services/dashboardService';
import { StatCard, InternalControlGauge, AlertsList, CheckStatusChart, CashFlowChart } from './DashboardComponents';

interface DashboardPageProps {
    setPage: (page: Page) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ setPage }) => {
    const { t, dir } = useLanguage();
    const [activeSection, setActiveSection] = useState('overview');
    
    // Data State
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [alerts, setAlerts] = useState<AuditAlert[]>([]);
    const [checks, setChecks] = useState<CheckItem[]>([]);
    const [auditDocs, setAuditDocs] = useState<AuditDocument[]>([]);
    const [customers, setCustomers] = useState<CustomerCredit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsData, alertsData, checksData, docsData, customersData] = await Promise.all([
                    getDashboardStats(),
                    getAlerts(),
                    getChecks(),
                    getAuditDocuments(),
                    getCustomers()
                ]);
                setStats(statsData);
                setAlerts(alertsData);
                setChecks(checksData);
                setAuditDocs(docsData);
                setCustomers(customersData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const menuItems = [
        { key: 'overview', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
        { key: 'financial', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { key: 'audit', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { key: 'customers', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
        { key: 'reports', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        { key: 'live', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    ];

    const formatCurrency = (amount: number) => {
        return (amount / 1000000000).toFixed(1) + 'B IRR';
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:text-[#72aee6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        <span className="mx-3 hidden md:block text-sm font-medium">Visit Site</span>
                    </button>
                </div>

                <nav className="flex-1 py-2 space-y-0.5">
                    {menuItems.map(item => (
                        <button key={item.key} onClick={() => setActiveSection(item.key)} className={`w-full flex items-center px-4 py-3 transition-colors relative group ${activeSection === item.key ? 'bg-[#2271b1] text-white' : 'text-[#f0f0f1] hover:bg-[#2c3338] hover:text-[#72aee6]'}`}>
                            {activeSection === item.key && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#72aee6] md:hidden"></div>}
                            <div className={`${activeSection === item.key ? 'text-white' : 'text-[#a7aaad] group-hover:text-[#72aee6]'}`}>{item.icon}</div>
                            <span className="mx-3 hidden md:block text-sm font-medium">{t(`dashboard.menu.${item.key}`)}</span>
                            {activeSection === item.key && <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-[#f0f0f1] rotate-45"></div>}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f0f0f1]">
                {/* Header */}
                <header className="bg-white shadow-sm h-14 flex items-center justify-between px-6 sticky top-0 z-10 border-b border-[#dcdcde]">
                    <h1 className="text-lg font-semibold text-[#1d2327]">{t(`dashboard.menu.${activeSection}`)}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 font-mono">v2.4.0 (Audit System Active)</span>
                        <div className="w-8 h-8 rounded-full bg-slate-200 border flex items-center justify-center text-slate-600 font-bold">A</div>
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
                                        <StatCard title={t('dashboard.stats.totalChecks')} value={formatCurrency(stats.totalChecksAmount)} change={`${stats.totalChecksCount} Checks`} color="blue" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
                                        <StatCard title={t('dashboard.stats.dueThisWeek')} value={formatCurrency(stats.checksDueThisWeekAmount)} change={`${stats.checksDueThisWeekCount} Urgent`} color="yellow" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                                        <StatCard title={t('dashboard.stats.cashBalance')} value={formatCurrency(stats.cashBalance)} change="4 Accounts" color="green" isPositive={true} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                                        <StatCard title={t('dashboard.stats.controlScore')} value={`${stats.internalControlScore}/100`} change="Good" color="purple" isPositive={true} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Main Chart Section */}
                                        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                            <h3 className="text-lg font-bold text-slate-800 mb-4">Cash Flow Forecast (6 Months)</h3>
                                            <CashFlowChart />
                                        </div>
                                        
                                        {/* Alerts Panel */}
                                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                                Urgent Alerts
                                            </h3>
                                            <AlertsList alerts={alerts} />
                                        </div>
                                    </div>

                                    {/* Bottom Widgets */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                            <h3 className="font-bold text-slate-800 mb-4">Check Status Distribution</h3>
                                            <CheckStatusChart 
                                                cleared={stats.totalChecksCount - stats.checksDueThisWeekCount - 2} 
                                                pending={stats.checksDueThisWeekCount} 
                                                bounced={2} 
                                            />
                                        </div>
                                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-slate-800 mb-2">Internal Control Assessment</h3>
                                                <p className="text-sm text-slate-500 mb-4">Based on latest audit logs</p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between w-48"><span className="text-slate-500">Risk Assessment:</span> <span className="text-green-600 font-bold">Good</span></div>
                                                    <div className="flex justify-between w-48"><span className="text-slate-500">Monitoring:</span> <span className="text-yellow-600 font-bold">Adequate</span></div>
                                                    <div className="flex justify-between w-48"><span className="text-slate-500">Activities:</span> <span className="text-green-600 font-bold">Strong</span></div>
                                                </div>
                                            </div>
                                            <InternalControlGauge score={stats.internalControlScore} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'financial' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-slate-800">Check Management</h2>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700">Register New Check</button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                                    <tr>
                                                        <th className="px-4 py-3">Check Number</th>
                                                        <th className="px-4 py-3">Due Date</th>
                                                        <th className="px-4 py-3">Amount (IRR)</th>
                                                        <th className="px-4 py-3">Drawer</th>
                                                        <th className="px-4 py-3">Bank</th>
                                                        <th className="px-4 py-3 text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {checks.map(check => (
                                                        <tr key={check.id} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3 font-mono">{check.number}</td>
                                                            <td className="px-4 py-3">{check.dueDate}</td>
                                                            <td className="px-4 py-3 font-bold">{check.amount.toLocaleString()}</td>
                                                            <td className="px-4 py-3">{check.drawer}</td>
                                                            <td className="px-4 py-3">{check.bank}</td>
                                                            <td className="px-4 py-3 text-right">
                                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                                    check.status === 'cleared' ? 'bg-green-100 text-green-700' :
                                                                    check.status === 'bounced' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                    {check.status}
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
                                        <StatCard title="Docs Reviewed" value="1,402" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
                                        <StatCard title="Discrepancies" value="12" color="red" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
                                        <StatCard title="Fraud Cases" value="3" color="red" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
                                    </div>

                                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                            AI Audit Logs
                                        </h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                                    <tr>
                                                        <th className="px-4 py-3">Document</th>
                                                        <th className="px-4 py-3">Type</th>
                                                        <th className="px-4 py-3">Date</th>
                                                        <th className="px-4 py-3">AI Risk Score</th>
                                                        <th className="px-4 py-3 text-right">Status</th>
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
                                                                <span className="text-xs mt-1 block">{doc.riskScore}/100</span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
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
                                        <h2 className="text-xl font-bold text-slate-800 mb-6">Customer Credit Profiles</h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                                    <tr>
                                                        <th className="px-4 py-3">Customer</th>
                                                        <th className="px-4 py-3">Type</th>
                                                        <th className="px-4 py-3">Credit Limit</th>
                                                        <th className="px-4 py-3">Used</th>
                                                        <th className="px-4 py-3">Score</th>
                                                        <th className="px-4 py-3 text-right">Risk</th>
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
                                                                    <span className="font-bold">{c.creditScore}</span>
                                                                    <div className="flex-1 bg-slate-200 h-1.5 rounded-full w-16">
                                                                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${c.creditScore / 10}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
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

                             {/* Placeholder for other sections */}
                            {(activeSection === 'reports' || activeSection === 'live') && (
                                <div className="flex flex-col items-center justify-center py-20 text-[#a7aaad] bg-white rounded border border-[#dcdcde]">
                                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    <p className="text-lg">Section ready for integration</p>
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
