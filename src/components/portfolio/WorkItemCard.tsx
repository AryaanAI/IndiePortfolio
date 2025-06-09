import React from 'react';
import { Link } from 'react-router-dom';
import { WorkItem } from '../../types';
import { Edit, Eye, Calendar, Tag } from 'lucide-react';
import './WorkItemCard.css';

interface WorkItemCardProps {
  item: WorkItem;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
}

const WorkItemCard: React.FC<WorkItemCardProps> = ({ item, viewMode, onEdit }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className={`work-item-card ${viewMode === 'list' ? 'list-mode' : ''}`}>
      <div className="work-item-thumbnail">
        <img src={item.thumbnailUrl} alt={item.title} />
        <div className="work-item-overlay">
          <Link to={`/portfolio/${item.id}`} className="overlay-button view">
            <Eye size={18} />
            <span>View</span>
          </Link>
          <button className="overlay-button edit" onClick={onEdit}>
            <Edit size={18} />
            <span>Edit</span>
          </button>
        </div>
        <div className={`status-badge status-${item.status}`}>
          {item.status}
        </div>
      </div>
      
      <div className="work-item-content">
        <Link to={`/portfolio/${item.id}`} className="work-item-title">
          {item.title}
        </Link>
        
        <div className="work-item-meta">
          <div className="meta-item">
            <Calendar size={14} />
            <span>{formatDate(item.updatedAt)}</span>
          </div>
          <div className="meta-item">
            <Tag size={14} />
            <span>{item.category}</span>
          </div>
        </div>
        
        {viewMode === 'list' && (
          <p className="work-item-description">
            {item.description.length > 120 
              ? item.description.substring(0, 120) + '...' 
              : item.description}
          </p>
        )}
        
        {viewMode === 'list' && item.tags.length > 0 && (
          <div className="work-item-tags">
            {item.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkItemCard;