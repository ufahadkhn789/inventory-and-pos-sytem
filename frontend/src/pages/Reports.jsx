import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Download, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { exportToCSV } from '../utils/export';

const Reports = () => {
  const [valuationData, setValuationData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [valRes, lowRes] = await Promise.all([
        api.get('/reports/category-valuation'),
        api.get('/reports/low-stock')
      ]);
      setValuationData(valRes.data.filter(d => d.total_value > 0));
      setLowStockData(lowRes.data);
    } catch (e) {}
    finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e'];

  const formatCurrency = (val) => `Rs. ${new Intl.NumberFormat().format(val)}`;

  if (loading) return <div>Generating reports...</div>;

  return (
    <div className="reports-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Reports & Analytics</h1>
          <p>Deep insights into your supermarket's inventory value and stock health.</p>
        </div>
        <div className="header-btns">
          <button className="btn-secondary" onClick={() => exportToCSV(lowStockData, 'low_stock_report')}>
            <Download size={18} /> Export Low Stock
          </button>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card card">
          <div className="report-header">
            <h3><TrendingUp size={20} /> Inventory Value by Category</h3>
            <p>Monetary distribution across your market sections</p>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={valuationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="total_value"
                  label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {valuationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-card card">
          <div className="report-header">
            <h3><AlertTriangle size={20} /> Urgent Low Stock Analysis</h3>
            <p>Products requiring immediate procurement</p>
          </div>
          <div className="low-stock-list">
            {lowStockData.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Current</th>
                    <th>Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockData.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category?.name}</td>
                      <td className="text-danger font-bold">{item.stock_quantity}</td>
                      <td>{item.low_stock_threshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-reports">
                <FileText size={48} color="#e2e8f0" />
                <p>No low stock items detected!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-text h1 { font-size: 1.875rem; font-weight: 800; color: #0f172a; }
        .header-text p { color: #64748b; }
        .header-btns { display: flex; gap: 1rem; }

        .reports-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 1200px) { .reports-grid { grid-template-columns: 1fr 1fr; } }
        
        .report-card { padding: 2rem; }
        .report-header { margin-bottom: 2rem; }
        .report-header h3 { display: flex; align-items: center; gap: 10px; font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
        .report-header p { color: #64748b; font-size: 0.875rem; }

        .low-stock-list { overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 12px; border-bottom: 2px solid #f1f5f9; font-size: 0.85rem; color: #64748b; }
        .data-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
        .text-danger { color: #ef4444; }
        .font-bold { font-weight: 700; }
        
        .empty-reports { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; color: #94a3b8; gap: 15px; }
      `}</style>
    </div>
  );
};

export default Reports;
