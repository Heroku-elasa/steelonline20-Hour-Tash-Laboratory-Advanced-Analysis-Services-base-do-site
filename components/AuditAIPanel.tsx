import React, { useState } from 'react';
import { useLanguage, FraudCase } from '../types';
import { getFraudCases } from '../services/auditMockData';

const AuditAIPanel: React.FC = () => {
    const { t } = useLanguage();
    const [cases] = useState<FraudCase[]>(getFraudCases());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Main AI Monitor */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">Teamyar AI Guardian</h2>
                        <p className="text-indigo-200 mb-6 max-w-lg">Active monitoring enabled. Analyzing 1,400+ daily transactions for anomalies using advanced pattern recognition.</p>
                        
                        <div className="flex gap-8">
                            <div>
                                <p className="text-xs text-indigo-300 uppercase font-bold">Current Threat Level</p>
                                <p className="text-2xl font-bold text-yellow-400 mt-1">Medium</p>
                            </div>
                             <div>
                                <p className="text-xs text-indigo-300 uppercase font-bold">Scanning</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="font-bold">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-600 rounded-full opacity-20 filter blur-3xl"></div>
                </div>

                {/* Fraud Cases List */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">{t('audit.ai.anomalies')}</h3>
                    <div className="space-y-4">
                        {cases.map((fraud) => (
                            <div key={fraud.id} className="border border-slate-100 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-slate-50 transition-colors">
                                <div className={`p-3 rounded-full flex-shrink-0 ${fraud.riskLevel === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800">{fraud.title}</h4>
                                    <p className="text-sm text-slate-500">{fraud.type} • Detected: {fraud.detectedAt}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">{fraud.amount}</p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${fraud.status === 'confirmed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {fraud.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-4">{t('audit.ai.riskAnalysis')}</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Check Fraud Risk</span>
                                <span className="font-bold text-slate-800">12%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                            </div>
                        </div>
                         <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Invoice Anomalies</span>
                                <span className="font-bold text-slate-800">45%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                         <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Identity Verification</span>
                                <span className="font-bold text-slate-800">98%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                    <h3 className="font-bold text-blue-900 mb-2">{t('audit.ai.recommendations')}</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
                        <li>Review high-value checks from new drawers.</li>
                        <li>Update user permissions for Invoice #4500-4590 range.</li>
                        <li>Schedule manual audit for Warehouse B inventory.</li>
                    </ul>
                 </div>
            </div>
        </div>
    );
};

export default AuditAIPanel;