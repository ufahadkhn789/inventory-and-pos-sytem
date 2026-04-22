import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  ArrowLeftRight, 
  BarChart3, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Products', icon: <Package size={20} />, path: '/products' },
    { name: 'Categories', icon: <Tags size={20} />, path: '/categories' },
    { name: 'Suppliers', icon: <Users size={20} />, path: '/suppliers' },
    { name: 'Transactions', icon: <ArrowLeftRight size={20} />, path: '/transactions' },
    { name: 'Reports', icon: <BarChart3 size={20} />, path: '/reports' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Package className="brand-icon" />
        <span>StockMaster</span>
      </div>

      <div className="user-profile">
        <div className="avatar">{user?.name?.charAt(0)}</div>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-role">{user?.role?.toUpperCase()}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
            <ChevronRight className="nav-chevron" size={16} />
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={logout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>

      <style>{`
        .sidebar {
          width: 280px;
          height: 100vh;
          background: #1e293b;
          color: white;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          position: fixed;
          left: 0;
          top: 0;
          box-shadow: 4px 0 10px rgba(0,0,0,0.1);
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #38bdf8;
        }

        .brand-icon {
          color: #38bdf8;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: #38bdf8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .user-info p {
          margin: 0;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .nav-item.active {
          background: #38bdf8;
          color: white;
        }

        .nav-icon {
          margin-right: 1rem;
          display: flex;
        }

        .nav-text {
          flex: 1;
          font-weight: 500;
        }

        .nav-chevron {
          opacity: 0;
          transition: opacity 0.2s;
        }

        .nav-item:hover .nav-chevron {
          opacity: 1;
        }

        .logout-btn {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border-radius: 8px;
          font-weight: 600;
          width: 100%;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .logout-btn:hover {
          background: #ef4444;
          color: white;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
