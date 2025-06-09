import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import { WorkItem, WorkItemCategory, WorkItemStatus } from '../../types';
import { useWorkItems } from '../../context/WorkItemContext';
import { v4 as uuidv4 } from 'uuid';
import './WorkItemModal.css';

interface WorkItemModalProps {
  workItem: WorkItem | null;
  onClose: () => void;
}

const WorkItemModal: React.FC<WorkItemModalProps> = ({ workItem, onClose }) => {
  const { addWorkItem, updateWorkItem } = useWorkItems();
  const isEditMode = !!workItem;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkItemCategory>(WorkItemCategory.OTHER);
  const [status, setStatus] = useState<WorkItemStatus>(WorkItemStatus.DRAFT);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (workItem) {
      setTitle(workItem.title);
      setDescription(workItem.description);
      setCategory(workItem.category);
      setStatus(workItem.status);
      setThumbnailUrl(workItem.thumbnailUrl);
      setImages(workItem.images);
      setVideos(workItem.videos || []);
      setTags(workItem.tags);
    }
  }, [workItem]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !thumbnailUrl) {
      alert('Please fill in all required fields');
      return;
    }
    
    const workItemData = {
      title,
      description,
      category,
      status,
      thumbnailUrl,
      images,
      videos,
      tags,
    };
    
    if (isEditMode && workItem) {
      updateWorkItem(workItem.id, workItemData);
    } else {
      addWorkItem(workItemData);
    }
    
    onClose();
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleAddImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setImages([...images, url]);
      if (!thumbnailUrl) {
        setThumbnailUrl(url);
      }
    }
  };
  
  const handleRemoveImage = (url: string) => {
    setImages(images.filter(image => image !== url));
    if (thumbnailUrl === url) {
      setThumbnailUrl(images.length > 1 ? images[0] : '');
    }
  };
  
  const handleAddVideo = () => {
    const url = prompt('Enter video URL:');
    if (url) {
      setVideos([...videos, url]);
    }
  };
  
  const handleRemoveVideo = (url: string) => {
    setVideos(videos.filter(video => video !== url));
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Work Item' : 'Add New Work Item'}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="work-item-form">
          <div className="form-grid">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WorkItemCategory)}
                  >
                    {Object.values(WorkItemCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as WorkItemStatus)}
                  >
                    {Object.values(WorkItemStatus).map(stat => (
                      <option key={stat} value={stat}>{stat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Tags</label>
                <div className="tag-input-container">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                  />
                  <button type="button" className="tag-add-button" onClick={handleAddTag}>
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="tags-container">
                  {tags.map(tag => (
                    <div key={tag} className="tag-pill">
                      <span>{tag}</span>
                      <button type="button" onClick={() => handleRemoveTag(tag)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="form-column">
              <div className="form-group">
                <label>Images *</label>
                <div className="media-container">
                  {images.map(url => (
                    <div key={url} className="media-item">
                      <img src={url} alt="Work item" />
                      <div className="media-actions">
                        <button 
                          type="button" 
                          className="media-action-button thumbnail-button"
                          onClick={() => setThumbnailUrl(url)}
                          title="Set as thumbnail"
                        >
                          {thumbnailUrl === url ? 'Thumbnail' : 'Set Thumbnail'}
                        </button>
                        <button 
                          type="button" 
                          className="media-action-button delete-button"
                          onClick={() => handleRemoveImage(url)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button type="button" className="add-media-button" onClick={handleAddImage}>
                    <Upload size={24} />
                    <span>Add Image</span>
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Videos (Optional)</label>
                <div className="media-container">
                  {videos.map(url => (
                    <div key={url} className="media-item video-item">
                      <div className="video-placeholder">
                        <span>{url}</span>
                      </div>
                      <div className="media-actions">
                        <button 
                          type="button" 
                          className="media-action-button delete-button"
                          onClick={() => handleRemoveVideo(url)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button type="button" className="add-media-button" onClick={handleAddVideo}>
                    <Upload size={24} />
                    <span>Add Video</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button-primary">
              {isEditMode ? 'Update Work Item' : 'Add Work Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkItemModal;