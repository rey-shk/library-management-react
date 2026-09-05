import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import type { LibrarySettings } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDefaultData,
    exportDataJSON,
    importDataJSON
  } = useLibrary();

  const [formSettings, setFormSettings] = useState<LibrarySettings>({ ...settings });
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importDataJSON(importJsonText);
    if (ok) {
      setImportJsonText('');
      setShowImportBox(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data back to the factory sample dataset? All custom records will be overwritten.')) {
      resetToDefaultData();
    }
  };

  return (
    <div className="view-container animate-fade-in">
      {/* View Header */}
      <div className="view-header">
        <div className="view-header-title">
          <h2>Library Settings & Policies</h2>
          <p>Configure circulation loan periods, late penalty fees, patron quotas, and data backups</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* General Identity */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Institutional Identity</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Library Institution Name
              </label>
              <input
                type="text"
                value={formSettings.libraryName}
                onChange={e => setFormSettings({ ...formSettings, libraryName: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Subtitle / Division
              </label>
              <input
                type="text"
                value={formSettings.subTitle}
                onChange={e => setFormSettings({ ...formSettings, subTitle: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Contact & Support Email
              </label>
              <input
                type="email"
                value={formSettings.contactEmail}
                onChange={e => setFormSettings({ ...formSettings, contactEmail: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Currency Symbol
              </label>
              <input
                type="text"
                value={formSettings.currencySymbol}
                onChange={e => setFormSettings({ ...formSettings, currencySymbol: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Circulation & Fines Policy */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Circulation & Lending Policy Rules</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Standard Student Loan (Days)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={formSettings.studentLoanDays}
                onChange={e => setFormSettings({ ...formSettings, studentLoanDays: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Faculty Loan Period (Days)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={formSettings.facultyLoanDays}
                onChange={e => setFormSettings({ ...formSettings, facultyLoanDays: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Overdue Late Fee ($ / Day)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formSettings.finePerDay}
                onChange={e => setFormSettings({ ...formSettings, finePerDay: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Max Allowed Loan Renewals
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formSettings.maxRenewals}
                onChange={e => setFormSettings({ ...formSettings, maxRenewals: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} />
            <span>Save Configuration Settings</span>
          </button>
        </div>
      </form>

      {/* Data Management & Factory Reset */}
      <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Data Backup & Local Persistence</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          All catalog records, patron memberships, circulation histories, and transactions are securely kept inside your browser's LocalStorage. You can export a full snapshot or restore from a JSON backup.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <button className="btn btn-secondary" onClick={exportDataJSON}>
            <Download size={16} />
            <span>Download JSON Backup</span>
          </button>
          <button className="btn btn-secondary" onClick={() => setShowImportBox(prev => !prev)}>
            <Upload size={16} />
            <span>Restore from JSON</span>
          </button>
          <button className="btn btn-danger" onClick={handleReset}>
            <RotateCcw size={16} />
            <span>Reset to Sample Dataset</span>
          </button>
        </div>

        {showImportBox && (
          <div
            className="glass-panel"
            style={{
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-strong)'
            }}
          >
            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              Paste JSON Backup Content Below:
            </label>
            <textarea
              rows={5}
              placeholder='{"books": [...], "members": [...], ...}'
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowImportBox(false)}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleImport}>
                Apply & Overwrite Database
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
