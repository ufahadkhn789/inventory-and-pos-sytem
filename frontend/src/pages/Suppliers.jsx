import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data);
    } catch (e) {}
    finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/suppliers/${editingItem.id}`, formData);
        toast.success("Supplier updated");
      } else {
        await api.post('/suppliers', formData);
        toast.success("Supplier added");
      }
      setShowModal(false);
      fetchData();
    } catch (e) {}
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item ? {
      name: item.name, email: item.email || '', phone: item.phone || '', address: item.address || ''
    } : {
      name: '', email: '', phone: '', address: ''
    });
    setShowModal(true);
  };

  if (loading) return <div>Loading suppliers...</div>;

  return (
    <div className="suppliers-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Suppliers Management</h1>
          <p>Manage your inventory providers and contact details.</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={20} /> Add Supplier
        </button>
      </div>

      <div className="suppliers-grid">
        {suppliers.map(s => (
          <div key={s.id} className="supplier-card card">
            <div className="supplier-info">
              <h3>{s.name}</h3>
              <div className="contact-item">
                <Mail size={14} /> <span>{s.email || 'No email'}</span>
              </div>
              <div className="contact-item">
                <Phone size={14} /> <span>{s.phone || 'No phone'}</span>
              </div>
              <div className="contact-item">
                <MapPin size={14} /> <span>{s.address || 'No address'}</span>
              </div>
            </div>
            {user?.role !== 'staff' && (
              <div className="card-actions">
                <button className="btn-icon" onClick={() => openModal(s)}><Edit size={16} /></button>
                <button className="btn-icon danger" onClick={async () => {
                   if(window.confirm("Delete this supplier?")) {
                     await api.delete(`/suppliers/${s.id}`);
                     fetchData();
                   }
                }}><Trash2 size={16} /></button>
              </div>
            )}
          </div>
        ))}
        {suppliers.length === 0 && <p className="empty-state">No suppliers found. Add one to get started.</p>}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal card">
            <h2>{editingItem ? 'Edit Supplier' : 'Add Supplier'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Supplier Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows="3" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-text h1 { font-size: 1.875rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .header-text p { color: #64748b; }
        
        .suppliers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .supplier-card { display: flex; justify-content: space-between; padding: 1.5rem; border: 1px solid #f1f5f9; }
        .supplier-card h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem; }
        .contact-item { display: flex; align-items: center; gap: 10px; color: #64748b; font-size: 0.875rem; margin-bottom: 8px; }
        
        .card-actions { display: flex; flex-direction: column; gap: 8px; }
        .btn-icon { padding: 8px; border-radius: 8px; background: #f8fafc; color: #64748b; transition: 0.2s; }
        .btn-icon:hover { background: #f1f5f9; color: #0f172a; }
        .btn-icon.danger:hover { background: #fee2e2; color: #ef4444; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { width: 100%; max-width: 500px; padding: 2rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
      `}</style>
    </div>
  );
};

export default Suppliers;
