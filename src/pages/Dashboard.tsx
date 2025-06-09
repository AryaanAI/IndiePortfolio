import React from 'react';
import { useWorkItems } from '../context/WorkItemContext';
import { WorkItemStatus, WorkItemCategory } from '../types';
import { BarChart3, Image, CheckSquare, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { workItems, filterWorkItems } = useWorkItems();
  
  const publishedCount = filterWorkItems(undefined, WorkItemStatus.PUBLISHED).length;
  const draftCount = filterWorkItems(undefined, WorkItemStatus.DRAFT).length;
  const totalItems = workItems.length;
  
  // Count items by category
  const categoryCounts = Object.values(WorkItemCategory).reduce((acc, category) => {
    acc[category] = filterWorkItems(category).length;
    return acc;
  }, {} as Record<string, number>);
  
  // Get recent items
  const recentItems = [...workItems]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 4);
  
  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <h1 className="page-heading">Welcome to your Creative Portfolio</h1>
        <p className="subtitle">Manage and showcase your creative work all in one place</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
            <Image size={24} color="#8B5CF6" />
          </div>
          <div className="stat-content">
            <h2 className="stat-value">{totalItems}</h2>
            <p className="stat-label">Total Work Items</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
            <Award size={24} color="#14B8A6" />
          </div>
          <div className="stat-content">
            <h2 className="stat-value">{publishedCount}</h2>
            <p className="stat-label">Published Items</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }}>
            <BarChart3 size={24} color="#EC4899" />
          </div>
          <div className="stat-content">
            <h2 className="stat-value">{draftCount}</h2>
            <p className="stat-label">Draft Items</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}>
            <CheckSquare size={24} color="#EAB308" />
          </div>
          <div className="stat-content">
            <h2 className="stat-value">0</h2>
            <p className="stat-label">Todo Tasks</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="recent-works">
          <div className="section-header">
            <h2 className="section-title">Recent Work</h2>
            <Link to="/portfolio" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="recent-grid">
            {recentItems.length > 0 ? (
              recentItems.map(item => (
                <Link to={`/portfolio/${item.id}`} key={item.id} className="recent-item">
                  <div className="recent-item-image">
                    <img src={item.thumbnailUrl} alt={item.title} />
                    <div className="recent-item-category">{item.category}</div>
                  </div>
                  <div className="recent-item-content">
                    <h3 className="recent-item-title">{item.title}</h3>
                    <div className="recent-item-meta">
                      <span className={`status-badge status-${item.status}`}>
                        {item.status}
                      </span>
                      <span className="recent-item-date">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <p>No work items yet. Start building your portfolio!</p>
                <Link to="/portfolio" className="button-primary">
                  Add Work Item
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="category-breakdown">
          <div className="section-header">
            <h2 className="section-title">Categories</h2>
          </div>
          
          <div className="category-list">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div className="category-item" key={category}>
                <div className="category-name">{category}</div>
                <div className="category-bar-container">
                  <div 
                    className="category-bar" 
                    style={{ 
                      width: `${totalItems > 0 ? (count / totalItems) * 100 : 0}%`,
                      backgroundColor: getCategoryColor(category as WorkItemCategory)
                    }}
                  ></div>
                </div>
                <div className="category-count">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color for each category
const getCategoryColor = (category: WorkItemCategory): string => {
  const colors = {
    [WorkItemCategory.PHOTOGRAPHY]: 'var(--primary-500)',
    [WorkItemCategory.DESIGN]: 'var(--secondary-500)',
    [WorkItemCategory.FASHION]: 'var(--accent-500)',
    [WorkItemCategory.BEAUTY]: 'var(--success-500)',
    [WorkItemCategory.ILLUSTRATION]: 'var(--warning-500)',
    [WorkItemCategory.OTHER]: 'var(--neutral-500)',
  };
  
  return colors[category];
};

export default Dashboard;