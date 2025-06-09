import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWorkItems } from '../context/WorkItemContext';
import { ArrowLeft, Edit, Trash2, Calendar, Tag } from 'lucide-react';
import WorkItemModal from '../components/portfolio/WorkItemModal';
import './WorkItemDetail.css';

const WorkItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkItemById, deleteWorkItem } = useWorkItems();
  const [showModal, setShowModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  
  const workItem = id ? getWorkItemById(id) : undefined;
  
  useEffect(() => {
    if (!workItem) {
      navigate('/portfolio');
    }
  }, [workItem, navigate]);
  
  if (!workItem) {
    return null;
  }
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this work item?')) {
      deleteWorkItem(workItem.id);
      navigate('/portfolio');
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="work-detail-page fade-in">
      <div className="detail-header">
        <Link to="/portfolio" className="back-button">
          <ArrowLeft size={20} />
          <span>Back to Portfolio</span>
        </Link>
        
        <div className="detail-actions">
          <button className="button-secondary" onClick={() => setShowModal(true)}>
            <Edit size={18} />
            <span>Edit</span>
          </button>
          <button className="button-danger" onClick={handleDelete}>
            <Trash2 size={18} />
            <span>Delete</span>
          </button>
        </div>
      </div>
      
      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-gallery">
            <div className="main-image">
              <img 
                src={workItem.images[activeImage]} 
                alt={workItem.title} 
              />
            </div>
            
            {workItem.images.length > 1 && (
              <div className="image-thumbnails">
                {workItem.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {workItem.videos && workItem.videos.length > 0 && (
            <div className="detail-videos">
              <h3>Videos</h3>
              <div className="video-list">
                {workItem.videos.map((video, index) => (
                  <div key={index} className="video-item">
                    <iframe
                      src={video}
                      title={`Video ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="detail-sidebar">
          <div className="detail-header-content">
            <h1 className="detail-title">{workItem.title}</h1>
            
            <div className="detail-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>Updated: {formatDate(workItem.updatedAt)}</span>
              </div>
              <div className="meta-item">
                <Tag size={16} />
                <span>{workItem.category}</span>
              </div>
            </div>
            
            <div className={`status-badge status-${workItem.status}`}>
              {workItem.status}
            </div>
          </div>
          
          <div className="detail-description">
            <h3>Description</h3>
            <p>{workItem.description}</p>
          </div>
          
          {workItem.tags.length > 0 && (
            <div className="detail-tags">
              <h3>Tags</h3>
              <div className="tags-list">
                {workItem.tags.map(tag => (
                  <span key={tag} className="detail-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="detail-ml-section">
            <h3>ML Processing</h3>
            <p>Use machine learning to process this work item.</p>
            <div className="ml-form">
              <div className="form-group">
                <label htmlFor="client-image">Upload Client Image</label>
                <input type="file" id="client-image" accept="image/*" />
              </div>
              <button className="button-primary">
                Run ML Processing
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showModal && (
        <WorkItemModal 
          workItem={workItem} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default WorkItemDetail;