import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) await api.put(`/categories/${editingItem.id}`, formData);
      else await api.post('/categories', formData);
      toast.success("Success");
      setShowModal(false);
      fetchData();
    } catch (e) {}
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item ? { name: item.name, description: item.description || '' } : { name: '', description: '' });
    setShowModal(true);
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Categories</h1>
        <button className="btn-primary" onClick={() => openModal()}><Plus size={20} /> Add Category</button>
      </div>
      <div className="card table-card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td className="actions">
                  <button className="btn-icon" onClick={() => openModal(c)}><Edit size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal card">
            <h2>{editingItem ? 'Edit' : 'Add'} Category</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .table-card { padding: 0; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { background: #f8fafc; padding: 1rem; text-align: left; }
        .data-table td { padding: 1rem; border-bottom: 1px solid #f1f5f9; }
        .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; }
        .modal { width: 400px; padding: 2rem; }
      `}</style>
    </div>
  );
};

export default Categories;
