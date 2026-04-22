import React from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
           <div className="search-bar">
             <input type="text" placeholder="Search inventory..." />
           </div>
           <div className="header-actions">
              <div className="notifications">
                 <span className="badge">3</span>
                 <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
           </div>
        </header>
        <div className="page-container">
          {children}
        </div>
      </main>

      <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 2rem;
          background: #f8fafc;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          background: white;
          padding: 1rem 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .search-bar {
          width: 400px;
        }

        .search-bar input {
           background: #f1f5f9;
           border: none;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .notifications {
          position: relative;
          color: #64748b;
          cursor: pointer;
        }

        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 10px;
          font-weight: bold;
        }

        .page-container {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
