import React from 'react';
import { ShieldCheck, User, LogIn } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div className="logo">
          <ShieldCheck size={32} />
          <span>FundBoss</span>
        </div>
        <nav>
          <a href="#" className="nav-link">Business Loans</a>
          <a href="#" className="nav-link">Partner with us</a>
          <button className="btn btn-outline">
            <LogIn size={18} />
            Login
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
