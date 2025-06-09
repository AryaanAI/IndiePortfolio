import React, { createContext, useContext, useState, useEffect } from 'react';
import { TargetImage, FaceswapResult } from '../types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

interface FaceswapContextType {
  targetImages: TargetImage[];
  swapResults: FaceswapResult[];
  addTargetImage: (image: Omit<TargetImage, 'id' | 'createdAt'>) => void;
  deleteTargetImage: (id: string) => void;
  updateTargetImage: (id: string, updates: Partial<TargetImage>) => void;
  getTargetImageById: (id: string) => TargetImage | undefined;
  filterTargetImages: (category?: string, searchTerm?: string) => TargetImage[];
  performFaceswap: (targetImageId: string, sourceImageUrl: string) => Promise<FaceswapResult>;
  getSwapResultsByTargetId: (targetImageId: string) => FaceswapResult[];
}

const FaceswapContext = createContext<FaceswapContextType | undefined>(undefined);

export const useFaceswap = () => {
  const context = useContext(FaceswapContext);
  if (!context) {
    throw new Error('useFaceswap must be used within a FaceswapProvider');
  }
  return context;
};

export const FaceswapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [targetImages, setTargetImages] = useState<TargetImage[]>(() => {
    const saved = localStorage.getItem('targetImages');
    return saved ? JSON.parse(saved) : [];
  });

  const [swapResults, setSwapResults] = useState<FaceswapResult[]>(() => {
    const saved = localStorage.getItem('swapResults');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('targetImages', JSON.stringify(targetImages));
  }, [targetImages]);

  useEffect(() => {
    localStorage.setItem('swapResults', JSON.stringify(swapResults));
  }, [swapResults]);

  const addTargetImage = (image: Omit<TargetImage, 'id' | 'createdAt'>) => {
    const newImage: TargetImage = {
      ...image,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    setTargetImages(prev => [...prev, newImage]);
    toast.success('Target image added successfully');
  };

  const deleteTargetImage = (id: string) => {
    setTargetImages(prev => prev.filter(img => img.id !== id));
    setSwapResults(prev => prev.filter(result => result.targetImageId !== id));
    toast.success('Target image deleted successfully');
  };

  const updateTargetImage = (id: string, updates: Partial<TargetImage>) => {
    setTargetImages(prev =>
      prev.map(img => (img.id === id ? { ...img, ...updates } : img))
    );
    toast.success('Target image updated successfully');
  };

  const getTargetImageById = (id: string) => {
    return targetImages.find(img => img.id === id);
  };

  const filterTargetImages = (category?: string, searchTerm?: string) => {
    return targetImages.filter(img => {
      const matchesCategory = !category || img.category === category;
      const matchesSearch = !searchTerm || 
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  };

  const performFaceswap = async (targetImageId: string, sourceImageUrl: string) => {
    try {
      const targetImage = getTargetImageById(targetImageId);
      if (!targetImage) {
        throw new Error('Target image not found');
      }

      // Call the faceswap API
      const response = await fetch('https://api.example.com/faceswap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_image: targetImage.imageUrl,
          source_image: sourceImageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform faceswap');
      }

      const data = await response.json();
      const result: FaceswapResult = {
        id: uuidv4(),
        targetImageId,
        sourceImageUrl,
        resultImageUrl: data.result_url,
        createdAt: Date.now(),
      };

      setSwapResults(prev => [...prev, result]);
      toast.success('Faceswap completed successfully');
      return result;
    } catch (error) {
      toast.error('Failed to perform faceswap');
      throw error;
    }
  };

  const getSwapResultsByTargetId = (targetImageId: string) => {
    return swapResults.filter(result => result.targetImageId === targetImageId);
  };

  return (
    <FaceswapContext.Provider
      value={{
        targetImages,
        swapResults,
        addTargetImage,
        deleteTargetImage,
        updateTargetImage,
        getTargetImageById,
        filterTargetImages,
        performFaceswap,
        getSwapResultsByTargetId,
      }}
    >
      {children}
    </FaceswapContext.Provider>
  );
};