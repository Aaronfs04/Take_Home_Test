export interface Transaction {
  id: number;
  productID: string;
  productName: string;
  amount: string | number;
  customerName: string;
  status: number;
  transactionDate: string;
  createBy?: string;
  createOn?: string;
}

export interface GroupedTransactions {
  [monthYear: string]: Transaction[];
}

