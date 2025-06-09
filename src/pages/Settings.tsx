import React, { useState } from 'react';
import { useWorkItems } from '../context/WorkItemContext';
import { useTheme } from '../context/ThemeContext';
import { Download, Upload, CreditCard, Zap } from 'lucide-react';
import './Settings.css';

const Settings: React.FC = () => {
  const { backupWorkItems, restoreWorkItems } = useWorkItems();
  const { theme, toggleTheme } = useTheme();
  const [backupStatus, setBackupStatus] = useState('');
  const [restoreStatus, setRestoreStatus] = useState('');
  
  const handleBackup = () => {
    const backupData = backupWorkItems();
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    setBackupStatus('Backup created successfully!');
    
    setTimeout(() => {
      setBackupStatus('');
    }, 3000);
  };
  
  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = restoreWorkItems(content);
      
      if (success) {
        setRestoreStatus('Data restored successfully!');
      } else {
        setRestoreStatus('Failed to restore data. Invalid format.');
      }
      
      setTimeout(() => {
        setRestoreStatus('');
      }, 3000);
    };
    reader.readAsText(file);
    
    // Reset the input to allow selecting the same file again
    event.target.value = '';
  };
  
  return (
    <div className="settings-page fade-in">
      <div className="settings-header">
        <h1 className="page-heading">Settings</h1>
        <p className="subtitle">Configure your portfolio and preferences</p>
      </div>
      
      <div className="settings-grid">
        <div className="settings-section">
          <h2 className="section-title">Appearance</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Theme</h3>
                <p>Switch between light and dark mode</p>
              </div>
              <div className="setting-control">
                <button 
                  className={`theme-button ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => theme === 'dark' && toggleTheme()}
                >
                  Light
                </button>
                <button 
                  className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => theme === 'light' && toggleTheme()}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h2 className="section-title">Backup & Restore</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Backup Portfolio Data</h3>
                <p>Download all your work items as a JSON file</p>
                {backupStatus && <p className="status-message success">{backupStatus}</p>}
              </div>
              <button className="button-with-icon" onClick={handleBackup}>
                <Download size={18} />
                <span>Backup Data</span>
              </button>
            </div>
            
            <div className="setting-divider"></div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Restore Portfolio Data</h3>
                <p>Upload a backup file to restore your portfolio</p>
                {restoreStatus && (
                  <p className={`status-message ${restoreStatus.includes('Failed') ? 'error' : 'success'}`}>
                    {restoreStatus}
                  </p>
                )}
              </div>
              <label className="button-with-icon">
                <Upload size={18} />
                <span>Upload Backup</span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleRestore} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h2 className="section-title">Payment Integration</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Payment Gateway</h3>
                <p>Connect a payment gateway to monetize your portfolio</p>
              </div>
              <div className="setting-control gateway-buttons">
                <button className="gateway-button">
                  <span>Stripe</span>
                </button>
                <button className="gateway-button">
                  <span>Razorpay</span>
                </button>
              </div>
            </div>
            
            <div className="setting-divider"></div>
            
            <div className="payment-setup-placeholder">
              <CreditCard size={48} />
              <h3>Set Up Payments</h3>
              <p>Connect your account to start accepting payments from clients</p>
              <button className="button-primary">
                Connect Payment Gateway
              </button>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h2 className="section-title">ML Integration</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Python Script Path</h3>
                <p>Configure the path to your Python ML script</p>
              </div>
              <div className="setting-control">
                <input 
                  type="text" 
                  placeholder="Enter path to Python script"
                  className="text-input"
                />
              </div>
            </div>
            
            <div className="setting-divider"></div>
            
            <div className="ml-setup-placeholder">
              <Zap size={48} />
              <h3>ML Processing</h3>
              <p>Use machine learning to process your work items and client images</p>
              <button className="button-primary">
                Test ML Script
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;