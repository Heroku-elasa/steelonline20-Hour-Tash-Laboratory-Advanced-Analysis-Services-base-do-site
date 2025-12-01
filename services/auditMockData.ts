import { AuditStats, FinancialCheck, AuditAlert, FraudCase } from '../types';

export const getAuditStats = (): AuditStats => {
    return {
        totalChecksAmount: '45,000,000,000',
        totalChecksCount: 34,
        dueThisWeekAmount: '8,500,000,000',
        dueThisWeekCount: 7,
        bouncedAmount: '2,300,000,000',
        cashBalance: '12,800,000,000',
        docsReviewed: 1402,
        discrepancies: 12,
        fraudCases: 3,
        controlScore: 78
    };
};

export const getFinancialChecks = (): FinancialCheck[] => {
    return [
        { id: 101, checkNumber: '11223344', amount: '1,200,000,000', dueDate: '1403/04/10', drawer: 'شرکت فولاد گستر', bank: 'ملت', status: 'pending', riskScore: 20 },
        { id: 102, checkNumber: '55667788', amount: '500,000,000', dueDate: '1403/04/12', drawer: 'بازرگانی آهن چی', bank: 'صادرات', status: 'pending', riskScore: 45 },
        { id: 103, checkNumber: '99001122', amount: '2,800,000,000', dueDate: '1403/04/15', drawer: 'پروژه ساختمانی امید', bank: 'تجارت', status: 'pending', riskScore: 85 },
        { id: 104, checkNumber: '33445566', amount: '350,000,000', dueDate: '1403/04/01', drawer: 'فروشگاه فلزات', bank: 'سپه', status: 'bounced', riskScore: 90 },
        { id: 105, checkNumber: '77889900', amount: '1,500,000,000', dueDate: '1403/03/25', drawer: 'شرکت سازه پایدار', bank: 'ملی', status: 'cleared', riskScore: 10 },
        { id: 106, checkNumber: '12345678', amount: '900,000,000', dueDate: '1403/04/20', drawer: 'تعاونی مسکن مهر', bank: 'مسکن', status: 'pending', riskScore: 30 },
    ];
};

export const getAuditAlerts = (): AuditAlert[] => {
    return [
        { id: 1, type: 'critical', message: 'چک شماره 99001122 با مبلغ بالا سررسید نزدیک دارد (ریسک بالا).', date: '2 ساعت پیش', isRead: false },
        { id: 2, type: 'warning', message: 'موجودی حساب جاری بانک ملت کمتر از حد تعیین شده است.', date: '5 ساعت پیش', isRead: false },
        { id: 3, type: 'error', message: 'مغایرت در سند شماره 4501 یافت شد.', date: 'دیروز', isRead: true },
        { id: 4, type: 'info', message: 'گزارش حسابرسی ماهانه آماده شد.', date: 'دیروز', isRead: true },
    ];
};

export const getFraudCases = (): FraudCase[] => {
    return [
        { id: 1, title: 'الگوی مشکوک در پرداخت‌های خرد', type: 'invoice_fraud', status: 'investigating', riskLevel: 'medium', amount: '450,000,000', detectedAt: '1403/04/01' },
        { id: 2, title: 'عدم تطابق امضا چک 334455', type: 'check_fraud', status: 'confirmed', riskLevel: 'high', amount: '350,000,000', detectedAt: '1403/04/02' },
        { id: 3, title: 'اختلاف حساب انبار و فروش', type: 'inventory_fraud', status: 'resolved', riskLevel: 'low', amount: '120,000,000', detectedAt: '1403/03/28' },
    ];
};

export const getCashFlowData = () => {
    return [
        { month: 'Far', income: 15000, expense: 12000 },
        { month: 'Ord', income: 18000, expense: 14000 },
        { month: 'Kho', income: 16000, expense: 15500 },
        { month: 'Tir', income: 22000, expense: 18000 },
        { month: 'Mor', income: 20000, expense: 16000 },
        { month: 'Sha', income: 24000, expense: 19000 },
    ];
};