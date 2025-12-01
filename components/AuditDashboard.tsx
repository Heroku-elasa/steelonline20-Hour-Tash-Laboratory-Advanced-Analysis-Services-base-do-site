import React, { useState, useEffect } from 'react';
import { useLanguage } from '../types';
import AuditOverview from './AuditOverview';
import AuditChecks from './AuditChecks';
import AuditAIPanel from './AuditAIPanel';
import { getAuditStats, getAuditAlerts } from '../services/auditMockData';

const AuditDashboard: React.FC = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'overview' | 'checks' | 'ai' | 'reports'>('overview');
    
    // Fetch initial data
    const stats = getAuditStats();
    const alerts = getAuditAlerts();

    const tabs = [
        { id: 'overview', label: t('audit.tabs.overview') },
        { id: 'checks', label: t('audit.tabs.checks') },
        { id: 'ai', label: t('audit.tabs.ai') },
        { id: 'reports', label: t('audit.tabs.reports') },
    ];

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800">{t('audit.title')}</h1>
                <p className="text-slate-500 mt-2">{t('audit.subtitle')}</p>
            </header>

            {/* Sub Navigation */}
            <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === tab.id 
                                ? 'border-blue-600 text-blue-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'overview' && <AuditOverview stats={stats} alerts={alerts} />}
                {activeTab === 'checks' && <AuditChecks />}
                {activeTab === 'ai' && <AuditAIPanel />}
                {activeTab === 'reports' && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p className="text-slate-500 font-medium">Financial Reports Module</p>
                        <button className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm transition-colors">Generate PDF Report</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditDashboard;