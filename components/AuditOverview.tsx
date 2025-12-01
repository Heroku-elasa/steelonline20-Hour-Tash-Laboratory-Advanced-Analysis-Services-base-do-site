import React, { useState } from 'react';
import { useLanguage, AuditStats, AuditAlert } from '../types';
import { getCashFlowData } from '../services/auditMockData';

interface AuditOverviewProps {
    stats: AuditStats;
    alerts: AuditAlert[];
}

const StatCard: React.FC<{ title: string; value: string | number; subtext?: string; icon: React.ReactNode; color: string }> = ({ title, value, subtext, icon, color }) => (
    <div className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow border-t-4 ${color}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{value}</h3>
                {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('border-t-', 'bg-').replace('border-', 'text-')}`}>
                {icon}
            </div>
        </div>
    </div>
);

const CashFlowChart = () => {
    const data = getCashFlowData();
    const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expense)));
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="h-64 flex items-end justify-between gap-2 pt-6">
            {data.map((d, i) => {
                const incomeH = (d.income / maxVal) * 100;
                const expenseH = (d.expense / maxVal) * 100;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                        <div className="w-full flex gap-1 items-end justify-center h-full">
                            <div className="w-3 bg-green-500 rounded-t-sm transition-all duration-500" style={{ height: `${incomeH}%` }}></div>
                            <div className="w-3 bg-red-500 rounded-t-sm transition-all duration-500" style={{ height: `${expenseH}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-500">{d.month}</span>
                        {hovered === i && (
                            <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-xs p-2 rounded shadow-lg z-10 w-32 text-center">
                                <p className="text-green-400">In: {d.income}</p>
                                <p className="text-red-400">Out: {d.expense}</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const AuditOverview: React.FC<AuditOverviewProps> = ({ stats, alerts }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Key Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title={t('audit.stats.totalChecks')} 
                    value={stats.totalChecksCount} 
                    subtext={`${stats.totalChecksAmount} IRR`}
                    color="border-blue-500"
                    icon={<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                />
                <StatCard 
                    title={t('audit.stats.dueThisWeek')} 
                    value={stats.dueThisWeekCount} 
                    subtext={`${stats.dueThisWeekAmount} IRR`}
                    color="border-yellow-500"
                    icon={<svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard 
                    title={t('audit.stats.bounced')} 
                    value={stats.bouncedAmount} 
                    subtext="Action Required"
                    color="border-red-500"
                    icon={<svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                />
                <StatCard 
                    title={t('audit.stats.cashBalance')} 
                    value={stats.cashBalance} 
                    subtext="Across 4 Accounts"
                    color="border-green-500"
                    icon={<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cash Flow Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Cash Flow Forecast</h3>
                        <div className="flex gap-4 text-xs">
                            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-sm"></span> Income</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-sm"></span> Expense</div>
                        </div>
                    </div>
                    <CashFlowChart />
                </div>

                {/* Alerts List */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4">{t('audit.alerts.title')}</h3>
                    <div className="flex-1 overflow-y-auto space-y-3 max-h-80 pr-1">
                        {alerts.map(alert => (
                            <div key={alert.id} className={`p-3 rounded-lg border-l-4 text-sm ${
                                alert.type === 'critical' ? 'bg-red-50 border-red-500 text-red-800' :
                                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                                alert.type === 'error' ? 'bg-orange-50 border-orange-500 text-orange-800' :
                                'bg-blue-50 border-blue-500 text-blue-800'
                            }`}>
                                <p className="font-semibold">{alert.message}</p>
                                <div className="flex justify-between items-center mt-2 text-xs opacity-75">
                                    <span>{alert.date}</span>
                                    {!alert.isRead && <span className="bg-white px-2 py-0.5 rounded-full shadow-sm">New</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Score & Fraud */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-slate-300">{t('audit.stats.score')}</h3>
                        <div className="flex items-end gap-2 mt-2">
                            <span className="text-5xl font-extrabold text-green-400">{stats.controlScore}</span>
                            <span className="text-xl text-slate-400 mb-2">/ 100</span>
                        </div>
                        <p className="mt-4 text-sm text-slate-300">Internal controls are effective. No major weaknesses detected in the last audit cycle.</p>
                        <div className="w-full bg-slate-700 h-2 rounded-full mt-4">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.controlScore}%` }}></div>
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 opacity-10">
                        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                     <div>
                         <h3 className="font-bold text-slate-800">{t('audit.stats.fraud')}</h3>
                         <p className="text-3xl font-extrabold text-red-600 mt-2">{stats.fraudCases}</p>
                         <p className="text-sm text-slate-500 mt-1">Active investigations requiring attention.</p>
                     </div>
                     <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors">
                        Investigate
                     </button>
                 </div>
            </div>
        </div>
    );
};

export default AuditOverview;