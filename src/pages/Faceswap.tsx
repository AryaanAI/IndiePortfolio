import React, { useState } from 'react';
import { useFaceswap } from '../context/FaceswapContext';
import { TargetImage } from '../types';
import { Plus, Search, Grid, List, Tag, Upload, Trash2, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './Faceswap.css';

const Faceswap: React.FC = () => {
  const {
    targetImages,
    addTargetImage,
    deleteTargetImage,
    filterTargetImages,
    performFaceswap,
    getSwapResultsByTargetId
  } = useFaceswap();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<TargetImage | null>(null);
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredImages = filterTargetImages(selectedCategory, searchTerm);

  const handleAddImage = () => {
    setShowAddModal(true);
    setSelectedImage(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSourceImage(file);
    }
  };

  const handleFaceswap = async (targetImage: TargetImage) => {
    if (!sourceImage) {
      toast.error('Please select a source image');
      return;
    }

    setIsProcessing(true);
    try {
      const sourceUrl = URL.createObjectURL(sourceImage);
      await performFaceswap(targetImage.id, sourceUrl);
      setSourceImage(null);
    } catch (error) {
      console.error('Faceswap failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="faceswap-page fade-in">
      <div className="page-header">
        <h1 className="page-heading">Faceswap Studio</h1>
        <p className="subtitle">Upload target images and perform face swapping</p>
      </div>

      <div className="filters-bar">
        <div className="search-filter">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search target images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            <option value="people">People</option>
            <option value="portraits">Portraits</option>
            <option value="other">Other</option>
          </select>

          <div className="view-toggle">
            <button
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>

          <button className="button-primary" onClick={handleAddImage}>
            <Plus size={18} />
            <span>Add Target Image</span>
          </button>
        </div>
      </div>

      <div className={`target-images ${viewMode}`}>
        {filteredImages.map(image => (
          <div key={image.id} className="target-image-card">
            <div className="image-preview">
              <img src={image.imageUrl} alt={image.title} />
              <div className="image-actions">
                <button
                  className="action-button"
                  onClick={() => setSelectedImage(image)}
                >
                  <ImageIcon size={18} />
                  <span>Select</span>
                </button>
                <button
                  className="action-button delete"
                  onClick={() => deleteTargetImage(image.id)}
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
            <div className="image-info">
              <h3>{image.title}</h3>
              <div className="image-tags">
                {image.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="faceswap-panel">
          <div className="panel-header">
            <h2>Perform Faceswap</h2>
            <button className="close-button" onClick={() => setSelectedImage(null)}>
              <X size={20} />
            </button>
          </div>

          <div className="panel-content">
            <div className="selected-target">
              <h3>Selected Target</h3>
              <img src={selectedImage.imageUrl} alt={selectedImage.title} />
            </div>

            <div className="source-upload">
              <h3>Upload Source Image</h3>
              <div className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="source-image"
                />
                <label htmlFor="source-image">
                  <Upload size={24} />
                  <span>Click to upload or drag and drop</span>
                </label>
              </div>
            </div>

            <button
              className="button-primary process-button"
              onClick={() => handleFaceswap(selectedImage)}
              disabled={!sourceImage || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Process Faceswap'}
            </button>
          </div>

          <div className="results-section">
            <h3>Previous Results</h3>
            <div className="results-grid">
              {getSwapResultsByTargetId(selectedImage.id).map(result => (
                <div key={result.id} className="result-item">
                  <img src={result.resultImageUrl} alt="Faceswap result" />
                  <span className="result-date">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faceswap;