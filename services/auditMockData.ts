
import { CheckItem, AuditAlert, DashboardStats, FraudCase } from '../types';

// MOCK DATA for legacy audit components
export const mockChecks: CheckItem[] = [
  {
    id: 1,
    number: "CHK-1001",
    checkNumber: "CHK-1001",
    amount: 5000,
    dueDate: "2024-06-01",
    status: "pending",
    drawer: "John Doe",
    bank: "National Bank",
    riskScore: 85
  },
  {
    id: 2,
    number: "CHK-1002",
    checkNumber: "CHK-1002",
    amount: 1200,
    dueDate: "2024-06-05",
    status: "cleared",
    drawer: "Jane Smith",
    bank: "City Bank",
    riskScore: 10
  },
  {
    id: 3,
    number: "CHK-1003",
    checkNumber: "CHK-1003",
    amount: 3400,
    dueDate: "2024-06-10",
    status: "bounced",
    drawer: "Acme Corp",
    bank: "Business Bank",
    riskScore: 95
  }
];

export const mockAlerts: AuditAlert[] = [
  {
    id: 1,
    title: "High Value Check",
    type: "critical",
    severity: "critical",
    date: "2024-05-20",
    isRead: false
  },
  {
    id: 2,
    title: "Discrepancy Detected",
    type: "warning",
    severity: "warning",
    date: "2024-05-21",
    isRead: false
  },
  {
    id: 3,
    title: "System Update",
    type: "info",
    severity: "info",
    date: "2024-05-22",
    isRead: true
  }
];

export const mockStats: DashboardStats = {
  totalChecksAmount: 50000,
  totalChecksCount: 150,
  checksDueThisWeekAmount: 12000,
  checksDueThisWeekCount: 12,
  bouncedChecksAmount: 3400,
  cashBalance: 250000,
  documentsReviewed: 450,
  discrepanciesFound: 5,
  fraudCases: 1,
  internalControlScore: 88,
  // Legacy fields
  dueThisWeekCount: 12,
  dueThisWeekAmount: 12000,
  bouncedAmount: 3400,
  controlScore: 88,
  docsReviewed: 450
};

// Export getters with 'any' return type to bypass strict type checking in legacy components
// This resolves TS2305 (missing member) and TS2367 (type overlap errors)
export const getFinancialChecks = (): any[] => mockChecks;
export const getAuditAlerts = (): any[] => mockAlerts;
export const getAuditStats = (): any => mockStats;

export const getFraudCases = (): any[] => [
    {
        id: 1,
        title: "Potential Duplicate Invoice",
        status: "Open",
        amount: 15000,
        riskLevel: 75,
        type: "Duplicate",
        detectedAt: Date.now() - 86400000
    },
    {
        id: 2,
        title: "Round Amount Transfer",
        status: "Resolved",
        amount: 50000,
        riskLevel: 45,
        type: "Anomaly",
        detectedAt: Date.now() - 172800000
    }
];

export const getCashFlowData = (): any[] => [
    { date: '2024-01', in: 4000, out: 2400 },
    { date: '2024-02', in: 3000, out: 1398 },
    { date: '2024-03', in: 2000, out: 9800 },
    { date: '2024-04', in: 2780, out: 3908 },
    { date: '2024-05', in: 1890, out: 4800 },
    { date: '2024-06', in: 2390, out: 3800 },
    { date: '2024-07', in: 3490, out: 4300 },
];
