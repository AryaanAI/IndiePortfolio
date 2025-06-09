import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutGrid, Image, CheckSquare, Settings, X, Palette, Wand2, User } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-mobile-open' : ''}`}>
      <div className="sidebar-header">
        <Link to="/dashboard" className="logo">
          <Palette size={24} />
          <span className="logo-text">CreativePort</span>
        </Link>
        <button className="close-sidebar" onClick={toggleSidebar}>
          <X size={20} />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <LayoutGrid size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/portfolio" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Image size={20} />
          <span>Portfolio</span>
        </NavLink>
        
        <NavLink to="/todo" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <CheckSquare size={20} />
          <span>Todo Board</span>
        </NavLink>

        <NavLink to="/faceswap" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Wand2 size={20} />
          <span>Faceswap</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <User size={20} />
          <span>Profile</span>
        </NavLink>
        
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <div className="app-version">v1.0.0</div>
      </div>
    </aside>
  );
};

export default Sidebar;