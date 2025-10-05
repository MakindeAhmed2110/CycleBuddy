'use client';

import React, { useState, useEffect } from 'react';
import { useWallet, useWalletModal } from '@vechain/dapp-kit-react';
import { useSearchParams } from 'next/navigation';
import { AIChat } from '../../components/AIChat';
import { PeriodTracker } from '../../components/PeriodTracker';
import { UserProfile } from '../../types/period';

export default function DemoPage() {
  const { account, disconnect } = useWallet();
  const { open } = useWalletModal();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'ai'>('landing');

  // Handle URL parameters for tab selection
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['landing', 'dashboard', 'ai'].includes(tab)) {
      setActiveTab(tab as 'landing' | 'dashboard' | 'ai');
    }
  }, [searchParams]);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: account || 'demo-user',
    averageCycleLength: 28,
    averagePeriodLength: 5,
    averageLutealPhase: 14,
    periods: [],
    symptoms: [],
  });

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const formatAddress = (address: string) => {
    // Show more characters for longer addresses to prevent truncation
    if (address.length > 20) {
      return `${address.slice(0, 10)}...${address.slice(-6)}`;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="demo-container">
      <style jsx>{`
        .demo-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .demo-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .demo-title {
          font-size: 24px;
          font-weight: bold;
          color: #ec4899;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .demo-nav {
          display: flex;
          gap: 8px;
        }

        .nav-tab {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }

        .nav-tab:hover {
          background: #f9fafb;
        }

        .nav-tab.active {
          background: #ec4899;
          color: white;
          border-color: #ec4899;
        }

        .wallet-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wallet-address {
          background: #f3f4f6;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-family: monospace;
          white-space: nowrap;
          overflow: visible;
          text-overflow: unset;
          min-width: fit-content;
        }

        .connect-btn, .disconnect-btn {
          background: #ec4899;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .connect-btn:hover, .disconnect-btn:hover {
          background: #be185d;
        }

        .demo-content {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .demo-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .feature-card {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .feature-title {
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }

        .feature-desc {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
        }

        .ai-demo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          height: 600px;
        }

        .dashboard-demo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .demo-note {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .demo-note-title {
          font-weight: 600;
          color: #92400e;
          margin-bottom: 8px;
        }

        .demo-note-text {
          color: #92400e;
          font-size: 14px;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .demo-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .demo-nav {
            justify-content: center;
          }

          .wallet-info {
            justify-content: center;
          }

          .ai-demo, .dashboard-demo {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="demo-header">
        <div className="demo-title">
          <span>💫</span>
          CycleBuddy Demo
        </div>
        
        <div className="demo-nav">
          <button 
            className={`nav-tab ${activeTab === 'landing' ? 'active' : ''}`}
            onClick={() => setActiveTab('landing')}
          >
            🏠 Landing Page
          </button>
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-tab ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            🤖 AI Chat
          </button>
        </div>

        <div className="wallet-info">
          {account ? (
            <>
              <div className="wallet-address">
                {formatAddress(account)}
              </div>
              <button className="disconnect-btn" onClick={disconnect}>
                Disconnect
              </button>
            </>
          ) : (
            <button className="connect-btn" onClick={open}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      <div className="demo-content">
        {activeTab === 'landing' && (
          <div className="demo-section">
            <div className="section-title">
              🏠 Landing Page Demo
            </div>
            <div className="demo-note">
              <div className="demo-note-title">📝 Note</div>
              <div className="demo-note-text">
                This is the main landing page that users see when they first visit CycleBuddy. 
                It showcases the app's features and includes wallet connection functionality.
              </div>
            </div>
            <div style={{ 
              border: '2px dashed #d1d5db', 
              borderRadius: '8px', 
              padding: '20px', 
              textAlign: 'center',
              color: '#6b7280'
            }}>
              Landing page content would be embedded here
              <br />
              <small>Navigate to "/" to see the full landing page</small>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="demo-section">
            <div className="section-title">
              📊 Dashboard Demo
            </div>
            <div className="demo-note">
              <div className="demo-note-title">💡 Features</div>
              <div className="demo-note-text">
                The dashboard includes period tracking, calendar view, and crypto rewards. 
                Users earn B3TR tokens for tracking their health data.
              </div>
            </div>
            <div className="dashboard-demo">
              <div>
                <h3 style={{ marginBottom: '16px', color: '#111827' }}>Period Tracker</h3>
                <PeriodTracker 
                  userProfile={userProfile} 
                  onProfileUpdate={handleProfileUpdate}
                />
              </div>
              <div>
                <h3 style={{ marginBottom: '16px', color: '#111827' }}>Features</h3>
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-title">📅 Period Logging</div>
                    <div className="feature-desc">Track your menstrual cycle and earn 1 B3TR per day</div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-title">😊 Mood Tracking</div>
                    <div className="feature-desc">Log your daily mood and emotional well-being</div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-title">💊 Medication</div>
                    <div className="feature-desc">Set reminders for birth control and pain relief</div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-title">💰 Crypto Rewards</div>
                    <div className="feature-desc">Earn up to 4 B3TR tokens daily for health tracking</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="demo-section">
            <div className="section-title">
              🤖 AI Health Assistant Demo
            </div>
            <div className="demo-note">
              <div className="demo-note-title">🚀 Powered by OpenRouter</div>
              <div className="demo-note-text">
                This AI assistant is powered by GPT-4o through OpenRouter API. 
                It can help with period tracking, cycle predictions, and general health questions.
                Make sure to set your OPENROUTER_API_KEY in .env.local
              </div>
            </div>
            <div className="ai-demo">
              <div>
                <h3 style={{ marginBottom: '16px', color: '#111827' }}>AI Chat Interface</h3>
                <AIChat userProfile={userProfile} />
              </div>
              <div>
                <h3 style={{ marginBottom: '16px', color: '#111827' }}>Sample Questions</h3>
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-title">❓ Cycle Questions</div>
                    <div className="feature-desc">"When will my next period start?"</div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-title">😰 Symptom Help</div>
                    <div className="feature-desc">"I'm having cramps, what can I do?"</div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-title">💡 Health Tips</div>
                    <div className="feature-desc">"What foods help with PMS symptoms?"</div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-title">🎯 Tracking Tips</div>
                    <div className="feature-desc">"How can I track my cycle better?"</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
