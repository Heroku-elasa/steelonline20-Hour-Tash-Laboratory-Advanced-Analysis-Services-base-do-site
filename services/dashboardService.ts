
import { supabase } from './supabaseClient';
import { DashboardStats, AuditAlert, CheckItem, AuditDocument, CustomerCredit, Language } from '../types';

// Mock data to seed if DB is empty
const MOCK_CHECKS: any[] = [
    { number: '88219901', amount: 2500000000, due_date: '1403/04/15', status: 'pending', drawer: 'Tehran Sazeh Co.', bank: 'Mellat' },
    { number: '77210022', amount: 1200000000, due_date: '1403/04/16', status: 'pending', drawer: 'Alavi Trading', bank: 'Saderat' },
    { number: '66551122', amount: 450000000, due_date: '1403/04/18', status: 'pending', drawer: 'Pars Metal', bank: 'Sepah' },
    { number: '11223344', amount: 3200000000, due_date: '1403/04/10', status: 'bounced', drawer: 'Omran Gostar', bank: 'Melli' },
    { number: '99887766', amount: 5000000000, due_date: '1403/04/01', status: 'cleared', drawer: 'Zob Ahan Isfahan', bank: 'Tejarat' },
];

const MOCK_ALERTS: any[] = [
    { title: 'Check #1298 due tomorrow (2.5B IRR)', type: 'check_due', severity: 'critical', date: 'Today', is_read: false },
    { title: 'Suspicious transaction detected: Invoice #9921', type: 'fraud_detected', severity: 'critical', date: 'Yesterday', is_read: false },
    { title: 'Customer "Steel Pars" exceeded credit limit', type: 'credit_limit', severity: 'warning', date: 'Yesterday', is_read: false },
    { title: 'Discrepancy in Bank Reconciliation (Mellat)', type: 'discrepancy', severity: 'warning', date: '2 days ago', is_read: true },
    { title: 'System backup completed successfully', type: 'system', severity: 'info', date: '3 days ago', is_read: true },
];

const MOCK_CUSTOMERS: any[] = [
    { name: 'Tehran Sazeh Co.', type: 'company', credit_score: 750, credit_limit: 50000000000, used_credit: 12000000000, risk_level: 'low' },
    { name: 'Omran Gostar', type: 'company', credit_score: 420, credit_limit: 10000000000, used_credit: 9500000000, risk_level: 'high' },
    { name: 'Ali Rezaei', type: 'individual', credit_score: 680, credit_limit: 5000000000, used_credit: 2000000000, risk_level: 'medium' },
];

// Helper to seed data if empty
export const checkAndSeedDatabase = async () => {
    try {
        const { error: checkError, count } = await supabase.from('financial_checks').select('*', { count: 'exact', head: true });
        
        if (checkError) throw checkError;

        if (count === 0) {
            console.log("Seeding Database...");
            await supabase.from('financial_checks').insert(MOCK_CHECKS);
            await supabase.from('audit_alerts').insert(MOCK_ALERTS);
            await supabase.from('customer_credits').insert(MOCK_CUSTOMERS);
            return { success: true, message: "Database seeded successfully." };
        }
        
        return { success: true, message: "Database already populated." };
    } catch (error: any) {
        console.error("Database connection/seeding failed:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
};

export const runDatabaseDiagnostics = async () => {
    const logs = [];
    logs.push({ step: 'Init', status: 'info', message: 'Starting diagnostics...' });
    
    try {
        // 1. Check Connection & Select
        const { data, error: selectError } = await supabase.from('financial_checks').select('count', { count: 'exact', head: true });
        if (selectError) {
            logs.push({ step: 'Read Check', status: 'error', message: `Read failed: ${selectError.message} (Code: ${selectError.code})` });
            throw new Error('Read failed');
        } else {
            logs.push({ step: 'Read Check', status: 'success', message: 'Read successful. Table accessible.' });
        }

        // 2. Check Write
        const { error: insertError } = await supabase.from('audit_alerts').insert({
            title: 'Diagnostic Test',
            type: 'system',
            severity: 'info',
            date: new Date().toISOString(),
            is_read: true
        });
        
        if (insertError) {
             logs.push({ step: 'Write Check', status: 'error', message: `Write failed: ${insertError.message} (Code: ${insertError.code})` });
             throw new Error('Write failed');
        } else {
             logs.push({ step: 'Write Check', status: 'success', message: 'Write successful. RLS policies likely correct.' });
        }

    } catch (e: any) {
        logs.push({ step: 'Diagnostics Failed', status: 'error', message: 'Stopping diagnostics due to error.' });
    }
    return logs;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const { data: checks, error } = await supabase.from('financial_checks').select('amount, status');
        
        if (error) throw error;

        if (checks) {
            const totalAmount = checks.reduce((sum, c) => sum + (c.amount || 0), 0);
            const totalCount = checks.length;
            const bouncedAmount = checks.filter(c => c.status === 'bounced').reduce((sum, c) => sum + (c.amount || 0), 0);
            const pendingCount = checks.filter(c => c.status === 'pending').length;
            
            return {
                totalChecksAmount: totalAmount,
                totalChecksCount: totalCount,
                checksDueThisWeekAmount: totalAmount * 0.2, // Estimate
                checksDueThisWeekCount: pendingCount,
                bouncedChecksAmount: bouncedAmount,
                cashBalance: 12800000000, 
                documentsReviewed: 1402,
                discrepanciesFound: 12,
                fraudCases: 3,
                internalControlScore: 78,
                // Legacy fields
                dueThisWeekCount: pendingCount,
                dueThisWeekAmount: totalAmount * 0.2,
                bouncedAmount: bouncedAmount,
                controlScore: 78,
                docsReviewed: 1402
            };
        }
    } catch (e) {
        console.warn("Using fallback stats due to DB error or empty DB");
    }

    return {
        totalChecksAmount: 0,
        totalChecksCount: 0,
        checksDueThisWeekAmount: 0,
        checksDueThisWeekCount: 0,
        bouncedChecksAmount: 0,
        cashBalance: 0,
        documentsReviewed: 0,
        discrepanciesFound: 0,
        fraudCases: 0,
        internalControlScore: 0,
        dueThisWeekCount: 0,
        dueThisWeekAmount: 0,
        bouncedAmount: 0,
        controlScore: 0,
        docsReviewed: 0
    };
};

export const getAlerts = async (language: Language = 'en'): Promise<AuditAlert[]> => {
    const { data, error } = await supabase.from('audit_alerts').select('*').order('created_at', { ascending: false });
    
    if (error || !data) {
        return [];
    }

    return data.map(a => ({
        id: a.id,
        title: a.title,
        type: a.type,
        severity: a.severity,
        date: a.date,
        isRead: a.is_read
    }));
};

export const getChecks = async (): Promise<CheckItem[]> => {
    const { data, error } = await supabase.from('financial_checks').select('*').order('created_at', { ascending: false });

    if (error || !data) {
        return [];
    }

    return data.map(c => ({
        id: c.id,
        number: c.number,
        amount: c.amount,
        dueDate: c.due_date,
        status: c.status,
        drawer: c.drawer,
        bank: c.bank,
        // Populate legacy fields
        checkNumber: c.number,
        riskScore: Math.floor(Math.random() * 100) // Mock risk score for legacy components
    }));
};

export const getAuditDocuments = async (language: Language = 'en'): Promise<AuditDocument[]> => {
    const types = {
        Invoice: language === 'fa' ? 'فاکتور' : 'Invoice',
        Check: language === 'fa' ? 'چک' : 'Check',
        Contract: language === 'fa' ? 'قرارداد' : 'Contract',
        Expense: language === 'fa' ? 'هزینه' : 'Expense'
    };

    return [
        { id: 'DOC-2024-001', type: types.Invoice, title: language === 'fa' ? 'فاکتور خرید #۴۴۲۱' : 'Purchase Inv #4421', amount: 450000000, status: 'approved', riskScore: 12, date: '1403/04/12' },
        { id: 'DOC-2024-002', type: types.Check, title: language === 'fa' ? 'تصویر چک #۸۸۲۱' : 'Check Image #8821', amount: 2500000000, status: 'flagged', riskScore: 85, date: '1403/04/12' },
        { id: 'DOC-2024-003', type: types.Contract, title: language === 'fa' ? 'قرارداد فروش - علوی' : 'Sales Contract - Alavi', amount: 12000000000, status: 'pending', riskScore: 45, date: '1403/04/11' },
    ];
};

export const getCustomers = async (): Promise<CustomerCredit[]> => {
    const { data, error } = await supabase.from('customer_credits').select('*');
    
    if (error || !data) {
        return [];
    }

    return data.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        creditScore: c.credit_score,
        creditLimit: c.credit_limit,
        usedCredit: c.used_credit,
        riskLevel: c.risk_level
    }));
};

export const saveSEOReport = async (url: string, result: any) => {
    return await supabase.from('seo_reports').insert({
        url: url,
        score: result.score,
        metrics: result.metrics,
        recommendations: result.aiRecommendations
    });
};

export const getSEOReports = async () => {
    const { data, error } = await supabase
        .from('seo_reports')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        throw error; 
    }
    return data;
};
