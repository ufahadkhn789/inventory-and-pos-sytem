import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { ArrowUpRight, ArrowDownLeft, Calendar, Search, Filter, Plus, Barcode, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '', type: 'out', quantity: '', reason: ''
  });
  const [scanMode, setScanMode] = useState(false);
  const [scannedSKU, setScannedSKU] = useState('');
  const [foundProduct, setFoundProduct] = useState(null);
  const scanInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (scanMode && scanInputRef.current) {
      scanInputRef.current.focus();
    }
  }, [scanMode]);

  const fetchData = async () => {
    try {
      const [transRes, prodRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/products')
      ]);
      setTransactions(transRes.data.data || transRes.data);
      setProducts(prodRes.data.data || prodRes.data);
    } catch (err) {}
    finally {
      setLoading(false);
    }
  };

  const handleScan = (sku) => {
    setScannedSKU(sku);
    const product = products.find(p => p.sku === sku);
    if (product) {
      setFoundProduct(product);
      setFormData(prev => ({ ...prev, product_id: product.id }));
    } else {
      setFoundProduct(null);
    }
  };

  const quickSubmit = async () => {
    if (!foundProduct || !formData.quantity) return toast.error("Select product and quantity");
    try {
      await api.post('/transactions', formData);
      toast.success(`Recorded ${formData.type === 'in' ? 'inflow' : 'outflow'} for ${foundProduct.name}`);
      setScanMode(false);
      setScannedSKU('');
      setFoundProduct(null);
      setFormData({ product_id: '', type: 'out', quantity: '', reason: '' });
      fetchData();
    } catch (e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', formData);
      toast.success("Transaction recorded successfully");
      setShowModal(false);
      setFormData({ product_id: '', type: 'out', quantity: '', reason: '' });
      fetchData();
    } catch (err) {}
  };

  if (loading) return <div className="loading">Loading Transactions...</div>;

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Inventory Movements</h1>
          <p>Track every item coming in and going out of your market.</p>
        </div>
        <div className="header-btns">
          <button className={`btn-secondary ${scanMode ? 'active' : ''}`} onClick={() => setScanMode(!scanMode)}>
            <Barcode size={20} /> {scanMode ? 'Close Scanner' : 'Barcode Scan'}
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> New Transaction
          </button>
        </div>
      </div>

      {scanMode && (
        <div className="scan-simulator card animate-in">
          <div className="scan-input-group">
            <label>Scan Barcode (Enter SKU)</label>
            <div className="input-with-icon">
              <Barcode size={24} className="icon" />
              <input 
                ref={scanInputRef}
                type="text" 
                placeholder="Click here and scan..." 
                value={scannedSKU}
                onChange={(e) => handleScan(e.target.value)}
              />
            </div>
          </div>

          {foundProduct && (
            <div className="scan-result animate-slide">
              <div className="product-summary">
                <div className="p-icon"><Check size={20} /></div>
                <div className="p-details">
                  <h4>{foundProduct.name}</h4>
                  <p>In Stock: <strong>{foundProduct.stock_quantity}</strong> | Price: <strong>Rs. {foundProduct.selling_price}</strong></p>
                </div>
              </div>
              <div className="quick-actions">
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="out">Sale</option>
                  <option value="in">Purchase</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Qty" 
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
                <button className="btn-primary" onClick={quickSubmit}>Confirm</button>
              </div>
            </div>
          )}
          {!foundProduct && scannedSKU && <p className="scan-error">SKU not found in inventory</p>}
        </div>
      )}

      <div className="card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Reason / Reference</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>
                  <div className="date-cell">
                    <span className="main-date">{new Date(t.created_at).toLocaleDateString()}</span>
                    <span className="sub-time">{new Date(t.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </td>
                <td>
                  <div className="product-cell">
                    <p className="p-name">{t.product?.name}</p>
                    <p className="p-sku">{t.product?.sku}</p>
                  </div>
                </td>
                <td>
                  <span className={`type-badge ${t.type}`}>
                    {t.type === 'in' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    {t.type === 'in' ? 'Stock In' : 'Stock Out'}
                  </span>
                </td>
                <td className="qty-cell">
                   <span className={`qty-val ${t.type}`}>
                     {t.type === 'in' ? '+' : '-'}{t.quantity}
                   </span>
                </td>
                <td><span className="reason-text">{t.reason || 'N/A'}</span></td>
                <td><span className="user-badge">{t.user?.name}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal card">
            <div className="modal-header">
              <h2>Record Movement</h2>
              <p>Adjust stock levels for specific products</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Product</label>
                <select 
                  value={formData.product_id} 
                  onChange={e => setFormData({...formData, product_id: e.target.value})}
                  required
                >
                  <option value="">Choose a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Movement Type</label>
                  <div className="type-selector">
                    <button 
                      type="button" 
                      className={`type-btn in ${formData.type === 'in' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, type: 'in'})}
                    >
                      Stock In
                    </button>
                    <button 
                      type="button" 
                      className={`type-btn out ${formData.type === 'out' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, type: 'out'})}
                    >
                      Stock Out
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input 
                    type="number" 
                    value={formData.quantity} 
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                    placeholder="0"
                    min="1"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason / Note</label>
                <textarea 
                  value={formData.reason} 
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  placeholder="e.g. Daily Sale, New Shipment, Expired..."
                  rows="3"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Confirm Movement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .transactions-page { padding-bottom: 2rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-text h1 { font-size: 1.875rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .header-text p { color: #64748b; }

        .table-card { padding: 0; overflow: hidden; border: 1px solid #f1f5f9; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { background: #f8fafc; padding: 1rem 1.5rem; text-align: left; font-size: 0.85rem; font-weight: 700; color: #64748b; border-bottom: 1px solid #e2e8f0; }
        .data-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        
        .date-cell { display: flex; flex-direction: column; }
        .main-date { font-weight: 700; font-size: 0.9rem; color: #1e293b; }
        .sub-time { font-size: 0.75rem; color: #94a3b8; }

        .product-cell .p-name { font-weight: 700; font-size: 0.95rem; color: #0f172a; }
        .product-cell .p-sku { font-size: 0.75rem; color: #64748b; }

        .type-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
        .type-badge.in { background: #dcfce7; color: #166534; }
        .type-badge.out { background: #fee2e2; color: #991b1b; }

        .qty-val { font-weight: 800; font-size: 1.1rem; }
        .qty-val.in { color: #10b981; }
        .qty-val.out { color: #ef4444; }

        .user-badge { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }
        .reason-text { color: #64748b; font-size: 0.9rem; font-style: italic; }

        .modal-header { margin-bottom: 2rem; }
        .modal-header h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .modal-header p { color: #64748b; font-size: 0.9rem; }

        .type-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .type-btn { padding: 10px; border-radius: 8px; font-weight: 700; border: 2px solid #f1f5f9; background: white; color: #64748b; transition: all 0.2s; }
        .type-btn.in.active { border-color: #10b981; background: #dcfce7; color: #166534; }
        .type-btn.out.active { border-color: #ef4444; background: #fee2e2; color: #991b1b; }
        
        .form-row { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1rem; }

        .scan-simulator { margin-bottom: 2rem; border: 2px dashed #3b82f6; background: #eff6ff; padding: 2rem; }
        .scan-input-group label { display: block; font-weight: 700; color: #1e40af; margin-bottom: 0.75rem; }
        .input-with-icon { position: relative; }
        .input-with-icon .icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #3b82f6; }
        .input-with-icon input { width: 100%; padding: 16px 16px 16px 56px; border-radius: 12px; border: 2px solid #bfdbfe; font-size: 1.25rem; font-weight: 700; }
        
        .scan-result { margin-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; background: white; padding: 1.25rem; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .product-summary { display: flex; align-items: center; gap: 1rem; }
        .p-icon { width: 40px; height: 40px; border-radius: 50%; background: #dcfce7; color: #10b981; display: flex; align-items: center; justify-content: center; }
        .p-details h4 { font-weight: 800; font-size: 1.1rem; color: #0f172a; margin-bottom: 2px; }
        .p-details p { color: #64748b; font-size: 0.9rem; }
        
        .quick-actions { display: flex; gap: 10px; }
        .quick-actions select, .quick-actions input { padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; font-weight: 600; }
        .quick-actions input { width: 80px; }
        .scan-error { margin-top: 1rem; color: #ef4444; font-weight: 600; font-size: 0.9rem; }
        
        .animate-in { animation: fadeIn 0.3s ease-out; }
        .animate-slide { animation: slideUp 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .btn-secondary.active { background: #3b82f6; color: white; border-color: #2563eb; }
      `}</style>
    </div>
  );
};

export default Transactions;
