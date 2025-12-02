




import React from 'react';
import { useLanguage, AuditAlert } from '../types';

// --- Stat Card ---
interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    icon?: React.ReactNode;
    color?: 'blue' | 'red' | 'green' | 'yellow' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        red: 'bg-red-50 text-red-600 border-red-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };

    return (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-0 right-0 rtl:right-auto rtl:left-0 p-3 rounded-bl-xl rtl:rounded-bl-none rtl:rounded-br-xl ${colorClasses[color]} opacity-20`}>
                {icon}
            </div>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{title}</p>
            <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 font-mono">{value}</span>
                {change && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
};

// --- Internal Control Gauge ---
export const InternalControlGauge: React.FC<{ score: number }> = ({ score }) => {
    const { t } = useLanguage();
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    
    let color = '#10B981'; // Green
    if (score < 50) color = '#EF4444'; // Red
    else if (score < 80) color = '#F59E0B'; // Yellow

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="#E2E8F0"
                    strokeWidth="12"
                    fill="transparent"
                />
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke={color}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800 font-mono">{score}</span>
                <span className="text-[10px] text-slate-500 uppercase">{t('dashboard.labels.score')}</span>
            </div>
        </div>
    );
};

// --- Alerts List ---
export const AlertsList: React.FC<{ alerts: AuditAlert[] }> = ({ alerts }) => {
    const { t } = useLanguage();
    
    const severityColors = {
        critical: 'border-red-500 bg-red-50 text-red-700',
        warning: 'border-yellow-500 bg-yellow-50 text-yellow-700',
        info: 'border-blue-500 bg-blue-50 text-blue-700',
    };

    return (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {alerts.map(alert => (
                <div key={alert.id} className={`p-3 rounded-r-md border-l-4 rtl:border-l-0 rtl:border-r-4 rtl:rounded-r-none rtl:rounded-l-md ${severityColors[alert.severity]} flex justify-between items-start gap-3 shadow-sm`}>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {alert.severity === 'critical' && <span className="animate-pulse w-2 h-2 rounded-full bg-red-500"></span>}
                            <h4 className="font-bold text-sm">{alert.title}</h4>
                        </div>
                        <p className="text-xs opacity-80">{alert.date}</p>
                    </div>
                    <button className="text-xs bg-white/50 hover:bg-white px-2 py-1 rounded transition-colors border border-transparent hover:border-slate-200">
                        {t('dashboard.labels.view')}
                    </button>
                </div>
            ))}
        </div>
    );
};

// --- Check Status Chart (Donut) ---
export const CheckStatusChart: React.FC<{ cleared: number, pending: number, bounced: number }> = ({ cleared, pending, bounced }) => {
    const { t } = useLanguage();
    const total = cleared + pending + bounced;
    const data = [
        { value: cleared, color: '#10B981', label: t('dashboard.labels.cleared') },
        { value: pending, color: '#F59E0B', label: t('dashboard.labels.pending') },
        { value: bounced, color: '#EF4444', label: t('dashboard.labels.bounced') },
    ];
    
    let cumulativePercent = 0;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="flex items-center justify-center gap-6">
            <div className="relative w-32 h-32">
                 <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                    {data.map((d, i) => {
                        if (d.value === 0) return null;
                        const startPercent = cumulativePercent;
                        const endPercent = cumulativePercent + (d.value / total);
                        cumulativePercent = endPercent;

                        const [startX, startY] = getCoordinatesForPercent(startPercent);
                        const [endX, endY] = getCoordinatesForPercent(endPercent);
                        const largeArcFlag = d.value / total > 0.5 ? 1 : 0;
                        const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;

                        return <path key={i} d={pathData} fill={d.color} stroke="white" strokeWidth="0.02" />;
                    })}
                    <circle cx="0" cy="0" r="0.6" fill="white" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-xs font-bold text-slate-400">{t('dashboard.labels.total')}</span>
                     <span className="text-lg font-bold text-slate-800 font-mono">{total}</span>
                 </div>
            </div>
            <div className="space-y-2">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                        <span className="font-medium text-slate-700">{d.label}</span>
                        <span className="text-slate-500 font-mono">({d.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Cash Flow Chart (Simple Bar) ---
export const CashFlowChart: React.FC = () => {
    // Mock data for 6 months forecast
    const data = [
        { label: 'M1', in: 120, out: 100 },
        { label: 'M2', in: 150, out: 110 },
        { label: 'M3', in: 180, out: 190 }, // Negative
        { label: 'M4', in: 200, out: 140 },
        { label: 'M5', in: 170, out: 130 },
        { label: 'M6', in: 220, out: 150 },
    ];
    const maxVal = 250;

    return (
        <div className="h-48 w-full flex items-end justify-between gap-2 pt-6">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="w-full flex gap-1 items-end justify-center h-full">
                        <div style={{ height: `${(d.in / maxVal) * 100}%` }} className="w-3 bg-green-500 rounded-t-sm relative group-hover:opacity-80 transition-all"></div>
                        <div style={{ height: `${(d.out / maxVal) * 100}%` }} className="w-3 bg-red-500 rounded-t-sm relative group-hover:opacity-80 transition-all"></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{d.label}</span>
                </div>
            ))}
        </div>
    );
};
