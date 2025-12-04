
import { CheckItem, AuditAlert, DashboardStats } from '../types';

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
