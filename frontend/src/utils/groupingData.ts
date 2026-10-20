import { Transaction, GroupedTransactions } from '../types/transaction';

export const groupTransactionsByMonth = (
  transactions: Transaction[]
): GroupedTransactions => {
  return transactions.reduce((acc: GroupedTransactions, item) => {
    const date = new Date(item.transactionDate);
    if (isNaN(date.getTime())) return acc;

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(item);
    return acc;
  }, {});
};

