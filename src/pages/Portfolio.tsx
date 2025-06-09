import React, { useState } from 'react';
import { useWorkItems } from '../context/WorkItemContext';
import { WorkItemCategory, WorkItemStatus, WorkItem } from '../types';
import { Link } from 'react-router-dom';
import { PlusCircle, Filter, Grid, List, Tag, Download, Upload } from 'lucide-react';
import WorkItemCard from '../components/portfolio/WorkItemCard';
import WorkItemModal from '../components/portfolio/WorkItemModal';
import './Portfolio.css';

const Portfolio: React.FC = () => {
  const { workItems, filterWorkItems, backupWorkItems, restoreWorkItems } = useWorkItems();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WorkItemCategory | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<WorkItemStatus | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<WorkItem | null>(null);
  
  const filteredItems = filterWorkItems(selectedCategory, selectedStatus, searchTerm);
  
  const handleAddNewClick = () => {
    setCurrentItem(null);
    setShowModal(true);
  };
  
  const handleEditItem = (item: WorkItem) => {
    setCurrentItem(item);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentItem(null);
  };
  
  const handleBackup = () => {
    const backupData = backupWorkItems();
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };
  
  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      restoreWorkItems(content);
    };
    reader.readAsText(file);
    
    // Reset the input to allow selecting the same file again
    event.target.value = '';
  };
  
  return (
    <div className="portfolio-page fade-in">
      <div className="portfolio-header">
        <h1 className="page-heading">Your Creative Portfolio</h1>
        
        <div className="portfolio-actions">
          <div className="backup-actions">
            <button className="button-icon-text" onClick={handleBackup}>
              <Download size={18} />
              <span>Backup</span>
            </button>
            
            <label className="button-icon-text">
              <Upload size={18} />
              <span>Restore</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleRestore} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
          
          <button className="button-primary" onClick={handleAddNewClick}>
            <PlusCircle size={18} />
            <span>Add New</span>
          </button>
        </div>
      </div>
      
      <div className="portfolio-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search portfolio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <Filter size={18} />
          
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? e.target.value as WorkItemCategory : undefined)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {Object.values(WorkItemCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={selectedStatus || ''}
            onChange={(e) => setSelectedStatus(e.target.value ? e.target.value as WorkItemStatus : undefined)}
            className="filter-select"
          >
            <option value="">All Status</option>
            {Object.values(WorkItemStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <div className="view-toggle">
            <button 
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button 
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {filteredItems.length > 0 ? (
        <div className={`portfolio-items ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
          {filteredItems.map(item => (
            <WorkItemCard 
              key={item.id} 
              item={item} 
              viewMode={viewMode} 
              onEdit={() => handleEditItem(item)} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-portfolio">
          <div className="empty-message">
            <Tag size={48} />
            <h3>No work items found</h3>
            <p>
              {workItems.length === 0 
                ? "You haven't added any work items to your portfolio yet" 
                : "No items match your current filters"}
            </p>
            {workItems.length === 0 ? (
              <button className="button-primary" onClick={handleAddNewClick}>
                Add Your First Work Item
              </button>
            ) : (
              <button className="button-secondary" onClick={() => {
                setSearchTerm('');
                setSelectedCategory(undefined);
                setSelectedStatus(undefined);
              }}>
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
      
      {showModal && (
        <WorkItemModal 
          workItem={currentItem} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Portfolio;