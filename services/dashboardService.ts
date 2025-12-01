
import { DashboardStats, AuditAlert, CheckItem, AuditDocument, CustomerCredit } from '../types';

// Mock Data Service simulating a backend for the Audit & Financial System

export const getDashboardStats = async (): Promise<DashboardStats> => {
    // Simulating API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        totalChecksAmount: 45000000000, // 45B IRR
        totalChecksCount: 34,
        checksDueThisWeekAmount: 8500000000, // 8.5B IRR
        checksDueThisWeekCount: 7,
        bouncedChecksAmount: 2300000000, // 2.3B IRR
        cashBalance: 12800000000, // 12.8B IRR
        documentsReviewed: 1402,
        discrepanciesFound: 12,
        fraudCases: 3,
        internalControlScore: 78
    };
};

export const getAlerts = async (): Promise<AuditAlert[]> => {
    return [
        { id: 1, title: 'Check #1298 due tomorrow (2.5B IRR)', type: 'check_due', severity: 'critical', date: 'Today', isRead: false },
        { id: 2, title: 'Suspicious transaction detected: Invoice #9921', type: 'fraud_detected', severity: 'critical', date: 'Yesterday', isRead: false },
        { id: 3, title: 'Customer "Steel Pars" exceeded credit limit', type: 'credit_limit', severity: 'warning', date: 'Yesterday', isRead: false },
        { id: 4, title: 'Discrepancy in Bank Reconciliation (Mellat)', type: 'discrepancy', severity: 'warning', date: '2 days ago', isRead: true },
        { id: 5, title: 'System backup completed successfully', type: 'system', severity: 'info', date: '3 days ago', isRead: true },
    ];
};

export const getChecks = async (): Promise<CheckItem[]> => {
    return [
        { id: 101, number: '88219901', amount: 2500000000, dueDate: '1403/04/15', status: 'pending', drawer: 'Tehran Sazeh Co.', bank: 'Mellat' },
        { id: 102, number: '77210022', amount: 1200000000, dueDate: '1403/04/16', status: 'pending', drawer: 'Alavi Trading', bank: 'Saderat' },
        { id: 103, number: '66551122', amount: 450000000, dueDate: '1403/04/18', status: 'pending', drawer: 'Pars Metal', bank: 'Sepah' },
        { id: 104, number: '11223344', amount: 3200000000, dueDate: '1403/04/10', status: 'bounced', drawer: 'Omran Gostar', bank: 'Melli' },
        { id: 105, number: '99887766', amount: 5000000000, dueDate: '1403/04/01', status: 'cleared', drawer: 'Zob Ahan Isfahan', bank: 'Tejarat' },
    ];
};

export const getAuditDocuments = async (): Promise<AuditDocument[]> => {
    return [
        { id: 'DOC-2024-001', type: 'Invoice', title: 'Purchase Inv #4421', amount: 450000000, status: 'approved', riskScore: 12, date: '1403/04/12' },
        { id: 'DOC-2024-002', type: 'Check', title: 'Check Image #8821', amount: 2500000000, status: 'flagged', riskScore: 85, date: '1403/04/12' },
        { id: 'DOC-2024-003', type: 'Contract', title: 'Sales Contract - Alavi', amount: 12000000000, status: 'pending', riskScore: 45, date: '1403/04/11' },
        { id: 'DOC-2024-004', type: 'Expense', title: 'Logistics Report June', amount: 85000000, status: 'approved', riskScore: 5, date: '1403/04/10' },
        { id: 'DOC-2024-005', type: 'Invoice', title: 'Sales Inv #9901', amount: 1250000000, status: 'rejected', riskScore: 92, date: '1403/04/09' },
    ];
};

export const getCustomers = async (): Promise<CustomerCredit[]> => {
    return [
        { id: 1, name: 'Tehran Sazeh Co.', type: 'company', creditScore: 750, creditLimit: 50000000000, usedCredit: 12000000000, riskLevel: 'low' },
        { id: 2, name: 'Omran Gostar', type: 'company', creditScore: 420, creditLimit: 10000000000, usedCredit: 9500000000, riskLevel: 'high' },
        { id: 3, name: 'Ali Rezaei', type: 'individual', creditScore: 680, creditLimit: 5000000000, usedCredit: 2000000000, riskLevel: 'medium' },
        { id: 4, name: 'Pars Metal Group', type: 'company', creditScore: 810, creditLimit: 100000000000, usedCredit: 45000000000, riskLevel: 'low' },
        { id: 5, name: 'Kaveh Construction', type: 'company', creditScore: 550, creditLimit: 20000000000, usedCredit: 18000000000, riskLevel: 'medium' },
    ];
};
