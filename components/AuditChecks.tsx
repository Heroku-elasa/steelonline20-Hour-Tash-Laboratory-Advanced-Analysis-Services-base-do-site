import React, { useState } from 'react';
import { useLanguage, FinancialCheck } from '../types';
import { getFinancialChecks } from '../services/auditMockData';

const AuditChecks: React.FC = () => {
    const { t } = useLanguage();
    const [checks] = useState<FinancialCheck[]>(getFinancialChecks());

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">Pending</span>;
            case 'cleared': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Cleared</span>;
            case 'bounced': return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">Bounced</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    const getRiskBadge = (score: number) => {
        if (score > 70) return <span className="text-red-600 font-bold">{score} (High)</span>;
        if (score > 30) return <span className="text-yellow-600 font-bold">{score} (Med)</span>;
        return <span className="text-green-600 font-bold">{score} (Low)</span>;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">{t('audit.checks.title')}</h3>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm font-semibold hover:bg-slate-200">Export</button>
                    <button className="px-4 py-2 bg-corp-blue text-white rounded-md text-sm font-semibold hover:bg-corp-blue-dark">New Check</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-6 py-3 font-medium">{t('audit.checks.table.number')}</th>
                            <th className="px-6 py-3 font-medium">{t('audit.checks.table.drawer')}</th>
                            <th className="px-6 py-3 font-medium">{t('audit.checks.table.bank')}</th>
                            <th className="px-6 py-3 font-medium">{t('audit.checks.table.amount')}</th>
                            <th className="px-6 py-3 font-medium">{t('audit.checks.table.date')}</th>
                            <th className="px-6 py-3 font-medium">{t('audit.checks.table.status')}</th>
                            <th className="px-6 py-3 font-medium">{t('audit.checks.table.risk')}</th>
                            <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {checks.map((check) => (
                            <tr key={check.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono font-medium text-slate-700">{check.checkNumber}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">{check.drawer}</td>
                                <td className="px-6 py-4 text-slate-600">{check.bank}</td>
                                <td className="px-6 py-4 font-mono font-bold text-slate-800">{check.amount}</td>
                                <td className="px-6 py-4 text-slate-600">{check.dueDate}</td>
                                <td className="px-6 py-4">{getStatusBadge(check.status)}</td>
                                <td className="px-6 py-4">{getRiskBadge(check.riskScore)}</td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase">Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditChecks;