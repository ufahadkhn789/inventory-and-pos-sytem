import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, AlertCircle, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { exportToCSV } from '../utils/export';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '', sku: '', category_id: '', supplier_id: '',
    purchase_price: '', selling_price: '', stock_quantity: 0, low_stock_threshold: 10
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes, supRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/suppliers')
      ]);
      setProducts(prodRes.data.data || prodRes.data);
      setCategories(catRes.data);
      setSuppliers(supRes.data);
    } catch (err) {
      // toast is handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
        toast.success("Product updated");
      } else {
        await api.post('/products', formData);
        toast.success("Product created");
      }
      setShowModal(false);
      fetchData();
    } catch (err) { }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted");
        fetchData();
      } catch (err) { }
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, sku: product.sku, category_id: product.category_id,
        supplier_id: product.supplier_id || '', purchase_price: product.purchase_price,
        selling_price: product.selling_price, stock_quantity: product.stock_quantity,
        low_stock_threshold: product.low_stock_threshold
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', sku: '', category_id: '', supplier_id: '',
        purchase_price: '', selling_price: '', stock_quantity: 0, low_stock_threshold: 10
      });
    }
    setShowModal(true);
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products Management</h1>
        <div className="header-btns">
          <button className="btn-secondary" onClick={() => exportToCSV(products, 'inventory_report')}>
            <Download size={20} /> Export CSV
          </button>
          <button className="btn-primary" onClick={() => openModal()}>
            <Plus size={20} /> Add Product
          </button>
        </div>
      </div>

      <div className="card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td><code>{product.sku}</code></td>
                <td>{product.name}</td>
                <td>{product.category?.name}</td>
                <td>
                  <span className={`stock-badge ${product.stock_quantity <= product.low_stock_threshold ? 'low' : ''}`}>
                    {product.stock_quantity}
                    {product.stock_quantity <= product.low_stock_threshold && <AlertCircle size={14} />}
                  </span>
                </td>
                <td>Rs. {product.selling_price}</td>
                <td className="actions">
                  {user?.role !== 'staff' && (
                    <>
                      <button className="btn-icon" onClick={() => openModal(product)}><Edit size={18} /></button>
                      <button className="btn-icon danger" onClick={() => deleteProduct(product.id)}><Trash2 size={18} /></button>
                    </>
                  )}
                  {user?.role === 'staff' && <span className="text-muted">No Actions</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal card">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <select value={formData.supplier_id} onChange={e => setFormData({ ...formData, supplier_id: e.target.value })}>
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Purchase Price</label>
                  <input type="number" step="0.01" value={formData.purchase_price} onChange={e => setFormData({ ...formData, purchase_price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Selling Price</label>
                  <input type="number" step="0.01" value={formData.selling_price} onChange={e => setFormData({ ...formData, selling_price: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Initial Stock</label>
                  <input type="number" value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })} required disabled={editingProduct} />
                </div>
                <div className="form-group">
                  <label>Low Stock Alert</label>
                  <input type="number" value={formData.low_stock_threshold} onChange={e => setFormData({ ...formData, low_stock_threshold: e.target.value })} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-btns { display: flex; gap: 1rem; }
        .table-card { padding: 0; overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { background: #f8fafc; padding: 1rem 1.5rem; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; }
        .data-table td { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
        .stock-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.75rem; border-radius: 20px; background: #dcfce7; color: #166534; font-weight: 600; font-size: 0.875rem; }
        .stock-badge.low { background: #fee2e2; color: #991b1b; }
        .actions { display: flex; gap: 0.5rem; }
        .btn-icon { padding: 0.5rem; background: #f1f5f9; color: #64748b; border-radius: 8px; }
        .btn-icon:hover { background: #e2e8f0; color: #0f172a; }
        .btn-icon.danger:hover { background: #fee2e2; color: #ef4444; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { width: 100%; max-width: 600px; padding: 2rem; }
        .modal h2 { margin-bottom: 1.5rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
        .btn-secondary { background: #f1f5f9; color: #64748b; padding: 0.75rem 1.5rem; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default Products;
