import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'status-active';
    case 'Pending': return 'status-pending';
    case 'Overdue': return 'status-inactive';
    case 'Partial': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-muted';
  }
};

export const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case 'Credit Card':
    case 'Square': return React.createElement(CreditCard, { className: "h-4 w-4" });
    case 'Cash': return React.createElement(DollarSign, { className: "h-4 w-4" });
    default: return React.createElement(DollarSign, { className: "h-4 w-4" });
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const calculatePaymentStats = (payments: any[], schedules: any[]) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTotal = payments?.reduce((sum, payment) => {
    const paymentDate = new Date(payment.payment_date!);
    if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
      return sum + Number(payment.amount);
    }
    return sum;
  }, 0) || 0;

  const overdue = schedules?.filter(schedule => {
    const dueDate = new Date(schedule.due_date);
    return dueDate < new Date() && schedule.status === 'Pending';
  }).length || 0;

  const pendingAmount = schedules?.reduce((sum, schedule) => {
    if (schedule.status === 'Pending') {
      return sum + Number(schedule.amount);
    }
    return sum;
  }, 0) || 0;

  return { monthlyTotal, overdue, pendingAmount };
};

export const getOverdueSchedules = (schedules: any[]) => {
  return schedules?.filter(schedule => {
    const dueDate = new Date(schedule.due_date);
    return dueDate < new Date() && schedule.status === 'Pending';
  }) || [];
};

export const getUpcomingSchedules = (schedules: any[]) => {
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  return schedules?.filter(schedule => {
    const dueDate = new Date(schedule.due_date);
    return dueDate >= today && dueDate <= thirtyDaysFromNow && schedule.status === 'Pending';
  }) || [];
};