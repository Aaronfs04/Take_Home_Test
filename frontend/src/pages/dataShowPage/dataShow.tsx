import React, { useState, useEffect, useMemo } from 'react';
import styles from './dataShow.module.css';

interface Transaction {
  id: number;
  productID: string;
  productName: string;
  amount: number;
  customerName: string;
  status: number;
  transactionDate: string;
  createBy: string;
  createOn: string;
}

interface DataShowProps {
  onBack?: () => void;
}

const formatRupiah = (val: number): string => {
  return `Rp ${Number(val || 0).toLocaleString('id-ID')}`;
};

const formatMonthYear = (yearMonth: string): string => {
  const [year, month] = yearMonth.split('-');
  const months: Record<string, string> = {
    '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
    '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
    '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
  };
  return `${months[month] || month} ${year}`;
};

const groupByMonthYear = (items: Transaction[]): Record<string, Transaction[]> => {
  return items.reduce((acc, item) => {
    const key = item.transactionDate ? item.transactionDate.substring(0, 7) : 'Lainnya';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, Transaction[]>);
};

const DataShow: React.FC<DataShowProps> = ({ onBack }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/transactions')
      .then((res) => res.json())
      .then((res) => setTransactions(res.data || []))
      .catch((err) => console.error('Gagal mengambil data:', err));
  }, []);

  const groupedData = useMemo(() => groupByMonthYear(transactions), [transactions]);
  const sortedMonths = useMemo(() => Object.keys(groupedData).sort((a, b) => b.localeCompare(a)), [groupedData]);

  return (
    <div className={styles.container}>
      <header className={styles.topBar}>
        <button onClick={onBack} className={styles.backBtn}>Kembali ke Beranda</button>
      </header>

      <section className={styles.header}>
        <h1 className={styles.title}>Data Transaksi (Grid Table)</h1>
        <p className={styles.subtitle}>Data digrouping berdasarkan Tahun & Bulan dari tanggal transaksi</p>
      </section>

      {sortedMonths.map((monthKey) => {
        const items = groupedData[monthKey];
        const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

        return (
          <div key={monthKey} className={styles.groupSection}>
            <div className={styles.groupHeader}>
              <div className={styles.groupTitle}>
                <span>{formatMonthYear(monthKey)}</span>
                <span className={styles.groupBadge}>{items.length} Transaksi</span>
              </div>
              <div className={styles.groupSummary}>Total: <strong>{formatRupiah(total)}</strong></div>
            </div>

            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Kode Produk</th>
                    <th>Nama Produk</th>
                    <th>Nominal</th>
                    <th>Pelanggan</th>
                    <th>Status</th>
                    <th>Tanggal Transaksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => (
                    <tr key={t.id}>
                      <td><strong>#{t.id}</strong></td>
                      <td>{t.productID}</td>
                      <td>{t.productName}</td>
                      <td>{formatRupiah(t.amount)}</td>
                      <td>{t.customerName}</td>
                      <td>
                        <span className={t.status === 0 ? styles.badgeSuccess : styles.badgeFailed}>
                          {t.status === 0 ? 'SUCCESS' : 'FAILED'}
                        </span>
                      </td>
                      <td>{t.transactionDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DataShow;
