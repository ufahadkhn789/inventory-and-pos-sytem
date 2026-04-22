import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  ShoppingCart,
  Wallet,
  DollarSign,
  Activity,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (isManual = false) => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
      if (isManual) toast.info("Dashboard updated");
    } catch (err) {}
    finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num).replace('PKR', 'Rs.');
  };

  const statCards = [
    { title: 'Inventory Cost', value: formatCurrency(stats?.total_inventory_value || 0), icon: <Wallet />, color: '#3b82f6' },
    { title: 'Sale Potential', value: formatCurrency(stats?.potential_revenue || 0), icon: <DollarSign />, color: '#10b981' },
    { title: "Today's Sales", value: stats?.transactions_today || 0, icon: <Activity />, color: '#f59e0b' },
    { title: 'Stock Alerts', value: stats?.low_stock_count || 0, icon: <AlertTriangle />, color: '#ef4444' },
  ];

  const chartData = [
    { name: 'Cost', amount: stats?.total_inventory_value || 0, color: '#3b82f6' },
    { name: 'Revenue', amount: stats?.potential_revenue || 0, color: '#10b981' },
  ];

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading Your SuperMart Analytics...</p>
      <style>{`
        .loading-screen { height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; color: #64748b; }
        .spinner { width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-text">
          <h1>SuperMart Analytics</h1>
          <p>Welcome back! Here's what's happening in your market today.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => fetchStats(true)} disabled={loading} style={{marginRight: '1rem'}}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <Link to="/transactions" className="btn-primary">
            <Activity size={18} /> Record New Sale
          </Link>
        </div>
      </div>
      
      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <p className="stat-label">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card card main-chart">
          <div className="chart-header">
             <h3>Inventory Valuation</h3>
             <p>Financial health of your current stock</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `Rs.${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px'}}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="amount" radius={[10, 10, 0, 0]} barSize={80}>
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="sidebar-panels">
          <div className="panel card">
            <div className="panel-header">
              <h3>Urgent Stock Alerts</h3>
              <Link to="/products" className="view-all">View All <ArrowRight size={14} /></Link>
            </div>
            <div className="panel-content">
              {stats?.low_stock_items?.map(item => (
                <div key={item.id} className="alert-item">
                  <div className="alert-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-sku">{item.sku}</p>
                  </div>
                  <div className="alert-status">
                    <span className="qty">{item.stock_quantity}</span>
                    <span className="label">left</span>
                  </div>
                </div>
              ))}
              {(!stats?.low_stock_items || stats.low_stock_items.length === 0) && (
                <div className="empty-panel">
                  <Package size={32} color="#10b981" />
                  <p>All stock levels healthy!</p>
                </div>
              )}
            </div>
          </div>

          <div className="panel card">
            <div className="panel-header">
              <h3>Recent Sales & Inflow</h3>
            </div>
            <div className="panel-content">
              {stats?.recent_transactions?.map(t => (
                <div key={t.id} className="mini-t-item">
                  <div className={`t-indicator ${t.type}`}></div>
                  <div className="t-details">
                    <p className="t-title">{t.product?.name}</p>
                    <p className="t-meta">{t.type === 'in' ? 'Purchased' : 'Sold'} • {t.quantity} units</p>
                  </div>
                  <div className="t-time">
                    {new Date(t.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard { padding-bottom: 2rem; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .header-text h1 { font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 6px; letter-spacing: -0.025em; }
        .header-text p { color: #64748b; font-size: 1.1rem; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; }
        .stat-card { display: flex; align-items: center; gap: 1.5rem; border: 1px solid #f1f5f9; position: relative; overflow: hidden; }
        .stat-card::after { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: currentColor; opacity: 0.1; }
        .stat-icon { width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; }
        .stat-label { color: #64748b; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
        .stat-value { font-size: 1.6rem; font-weight: 800; color: #0f172a; }

        .charts-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; }
        @media (max-width: 1100px) { .charts-grid { grid-template-columns: 1fr; } }
        
        .main-chart { padding: 2rem; }
        .chart-header { margin-bottom: 2rem; }
        .chart-header h3 { font-size: 1.25rem; font-weight: 800; color: #1e293b; }
        .chart-header p { color: #64748b; font-size: 0.9rem; }

        .sidebar-panels { display: flex; flex-direction: column; gap: 1.5rem; }
        .panel { padding: 1.5rem; }
        .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .panel-header h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; }
        .view-all { color: #3b82f6; font-size: 0.875rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        
        .alert-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #fff1f2; border-radius: 12px; margin-bottom: 10px; border: 1px solid #ffe4e6; }
        .item-name { font-weight: 700; font-size: 0.9rem; color: #991b1b; }
        .item-sku { font-size: 0.75rem; color: #e11d48; opacity: 0.8; }
        .alert-status { text-align: right; }
        .alert-status .qty { display: block; font-weight: 800; font-size: 1.1rem; color: #e11d48; line-height: 1; }
        .alert-status .label { font-size: 0.7rem; color: #e11d48; text-transform: uppercase; font-weight: 600; }

        .mini-t-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .mini-t-item:last-child { border-bottom: none; }
        .t-indicator { width: 8px; height: 8px; border-radius: 50%; }
        .t-indicator.in { background: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
        .t-indicator.out { background: #f59e0b; box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1); }
        .t-details { flex: 1; }
        .t-title { font-weight: 600; font-size: 0.9rem; color: #1e293b; }
        .t-meta { font-size: 0.75rem; color: #64748b; }
        .t-time { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }

        .empty-panel { text-align: center; padding: 30px; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;
