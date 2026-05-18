import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  Trash2, 
  CreditCard, 
  Coffee, 
  ShoppingBag, 
  Car, 
  Home, 
  MoreHorizontal
} from 'lucide-react';
import './App.css';

// Utility function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Map categories to icons
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Makanan': return <Coffee size={20} />;
    case 'Belanja': return <ShoppingBag size={20} />;
    case 'Transportasi': return <Car size={20} />;
    case 'Tagihan': return <Home size={20} />;
    case 'Gaji': return <Wallet size={20} />;
    default: return <MoreHorizontal size={20} />;
  }
};

function App() {
  // State for transactions
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Form states
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Derived states
  const balance = transactions.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  // Save to local storage whenever transactions change
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;

    const newTransaction = {
      id: crypto.randomUUID(),
      type,
      amount: parseFloat(amount),
      category: type === 'income' ? 'Gaji' : category, // Default income category
      note,
      date,
      createdAt: new Date().toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Reset form
    setAmount('');
    setNote('');
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="app-container animate-fade-in">
      <header className="app-header">
        <h1 className="text-gradient">NeoFinance</h1>
        <p>Kelola keuangan Anda dengan elegan</p>
      </header>

      <div className="dashboard-grid">
        <div className="summary-card glass-panel">
          <div className="summary-icon balance">
            <Wallet size={24} />
          </div>
          <div className="summary-info">
            <h3>Total Saldo</h3>
            <p>{formatCurrency(balance)}</p>
          </div>
        </div>

        <div className="summary-card glass-panel">
          <div className="summary-icon income">
            <TrendingUp size={24} />
          </div>
          <div className="summary-info">
            <h3>Pemasukan</h3>
            <p>{formatCurrency(totalIncome)}</p>
          </div>
        </div>

        <div className="summary-card glass-panel">
          <div className="summary-icon expense">
            <TrendingDown size={24} />
          </div>
          <div className="summary-info">
            <h3>Pengeluaran</h3>
            <p>{formatCurrency(totalExpense)}</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="form-section glass-panel">
          <h2 className="section-title">
            <PlusCircle size={20} className="text-gradient" /> 
            Tambah Transaksi
          </h2>
          
          <form className="transaction-form" onSubmit={handleSubmit}>
            <div className="type-selector">
              <button 
                type="button" 
                className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
                onClick={() => setType('expense')}
              >
                Pengeluaran
              </button>
              <button 
                type="button" 
                className={`type-btn ${type === 'income' ? 'active income' : ''}`}
                onClick={() => setType('income')}
              >
                Pemasukan
              </button>
            </div>

            <div className="form-group">
              <label className="input-label">Nominal (Rp)</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="Contoh: 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {type === 'expense' && (
              <div className="form-group">
                <label className="input-label">Kategori</label>
                <select 
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Makanan">Makanan & Minuman</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Belanja">Belanja</option>
                  <option value="Tagihan">Tagihan & Utilitas</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="input-label">Tanggal</label>
              <input 
                type="date" 
                className="input-field" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Catatan (Opsional)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Makan siang..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button type="submit" className="btn" style={{ marginTop: '8px' }}>
              <PlusCircle size={18} /> Simpan Transaksi
            </button>
          </form>
        </div>

        <div className="history-section glass-panel">
          <h2 className="section-title">
            <CreditCard size={20} className="text-gradient" /> 
            Riwayat Transaksi
          </h2>

          {transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💸</div>
              <p>Belum ada transaksi. Mulai catat keuangan Anda!</p>
            </div>
          ) : (
            <div className="transaction-list">
              {transactions.map(t => (
                <div key={t.id} className="transaction-item animate-fade-in">
                  <div className="transaction-main">
                    <div className={`transaction-icon ${t.type}`}>
                      {t.type === 'income' ? <TrendingUp size={20} /> : getCategoryIcon(t.category)}
                    </div>
                    <div className="transaction-details">
                      <h4>{t.category === 'Gaji' && t.type === 'income' ? 'Pemasukan' : t.category}</h4>
                      <p>{t.note || 'Tanpa catatan'} • {new Date(t.date).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`transaction-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                    <button 
                      className="delete-btn" 
                      onClick={() => deleteTransaction(t.id)}
                      title="Hapus Transaksi"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
