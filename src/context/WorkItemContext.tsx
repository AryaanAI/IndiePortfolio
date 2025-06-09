import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkItem, WorkItemCategory, WorkItemStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

interface WorkItemContextType {
  workItems: WorkItem[];
  addWorkItem: (workItem: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkItem: (id: string, updates: Partial<WorkItem>) => void;
  deleteWorkItem: (id: string) => void;
  getWorkItemById: (id: string) => WorkItem | undefined;
  filterWorkItems: (category?: WorkItemCategory, status?: WorkItemStatus, searchTerm?: string) => WorkItem[];
  backupWorkItems: () => string;
  restoreWorkItems: (jsonData: string) => boolean;
}

const WorkItemContext = createContext<WorkItemContextType | undefined>(undefined);

export const useWorkItems = () => {
  const context = useContext(WorkItemContext);
  if (!context) {
    throw new Error('useWorkItems must be used within a WorkItemProvider');
  }
  return context;
};

export const WorkItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workItems, setWorkItems] = useState<WorkItem[]>(() => {
    const savedItems = localStorage.getItem('workItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('workItems', JSON.stringify(workItems));
  }, [workItems]);

  const addWorkItem = (workItem: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = Date.now();
    const newWorkItem: WorkItem = {
      ...workItem,
      id: uuidv4(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setWorkItems(prevItems => [...prevItems, newWorkItem]);
    toast.success('Work item added successfully');
  };

  const updateWorkItem = (id: string, updates: Partial<WorkItem>) => {
    setWorkItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: Date.now() } 
          : item
      )
    );
    toast.success('Work item updated successfully');
  };

  const deleteWorkItem = (id: string) => {
    setWorkItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success('Work item deleted successfully');
  };

  const getWorkItemById = (id: string) => {
    return workItems.find(item => item.id === id);
  };

  const filterWorkItems = (
    category?: WorkItemCategory, 
    status?: WorkItemStatus, 
    searchTerm?: string
  ) => {
    return workItems.filter(item => {
      const matchesCategory = !category || item.category === category;
      const matchesStatus = !status || item.status === status;
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesStatus && matchesSearch;
    });
  };

  const backupWorkItems = () => {
    const data = JSON.stringify(workItems);
    toast.success('Backup created successfully');
    return data;
  };

  const restoreWorkItems = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData) as WorkItem[];
      setWorkItems(parsedData);
      toast.success('Work items restored successfully');
      return true;
    } catch (error) {
      toast.error('Failed to restore data. Invalid format.');
      return false;
    }
  };

  return (
    <WorkItemContext.Provider 
      value={{ 
        workItems, 
        addWorkItem, 
        updateWorkItem, 
        deleteWorkItem, 
        getWorkItemById, 
        filterWorkItems,
        backupWorkItems,
        restoreWorkItems
      }}
    >
      {children}
    </WorkItemContext.Provider>
  );
};