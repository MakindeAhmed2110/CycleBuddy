'use client';

import { useWallet, useWalletModal } from '@vechain/dapp-kit-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CSSLandingPage() {
  const { open } = useWalletModal();
  const { account } = useWallet();
  const router = useRouter();

  // Auto-redirect to dashboard when wallet is connected
  useEffect(() => {
    if (account) {
      // Small delay to ensure wallet connection is fully established
      const timer = setTimeout(() => {
        router.push('/demo?tab=dashboard');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [account, router]);
  // Show loading state when wallet is connected and redirecting
  if (account) {
    return (
      <div className="landing-container">
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>🎉</div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ec4899',
              marginBottom: '12px'
            }}>Wallet Connected!</h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              Redirecting you to your CycleBuddy dashboard...
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#ec4899'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #ec4899',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ fontSize: '14px' }}>Loading...</span>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="landing-container">
      {/* Background decorative elements */}
      <div className="background-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
        <div className="bg-circle bg-circle-4"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo-icon">C</div>
            <span className="logo-text">CycleBuddy</span>
          </div>

          {/* Connect Wallet Button */}
          <button className="connect-wallet-btn" onClick={open}>
            <span>🔗</span>
            <span>Connect Wallet</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-grid">
            
            {/* Left Column - Text Content */}
            <div className="text-column">
              {/* Social Proof */}
              <div className="social-proof">
                <div className="stars">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
                <span className="social-text">Over 50,000+ users earning crypto daily¹</span>
              </div>

              {/* Main Headline */}
              <h1 className="main-headline">
                CycleBuddy, the app that helps teens & women manage their periods while earning crypto for doing so{' '}
                <span className="sparkle">💫</span>
              </h1>

              {/* Description */}
              <p className="description">
                Join thousands around the world using CycleBuddy to track their periods, ovulation, and pregnancy, 
                and earn B3TR crypto for their health journey. Your health data is valuable - get rewarded for it!
              </p>

              {/* App Store Badges */}
              <div className="app-badges">
                <button className="app-badge app-store" onClick={open}>
                  <span className="badge-icon">🍎</span>
                  <div className="badge-text">
                    <div className="badge-small">Connect Wallet &</div>
                    <div className="badge-large">Start Earning</div>
                  </div>
                </button>
                <button className="app-badge google-play" onClick={open}>
                  <span className="badge-icon">💰</span>
                  <div className="badge-text">
                    <div className="badge-small">EARN B3TR</div>
                    <div className="badge-large">CRYPTO</div>
                  </div>
                </button>
              </div>

              {/* Handwritten Note */}
              <div className="handwritten-note">
                <div className="note-content">
                  <div className="note-header">
                    <span className="trophy">🏆</span>
                    <div className="note-text">
                      <div className="note-title">#1 Crypto-Rewarded Period Tracker</div>
                      <div className="note-subtitle">Earn B3TR tokens for your health data</div>
                    </div>
                  </div>
                </div>
                <div className="note-dot"></div>
              </div>
            </div>

            {/* Right Column - Mobile App Mockups */}
            <div className="phone-column">
              {/* Main Phone Mockup */}
              <div className="phone-mockup">
                <div className="phone-screen">
                  
                  {/* Phone Header */}
                  <div className="phone-header">
                    <div className="phone-header-content">
                      <span className="phone-title">CycleBuddy</span>
                      <div className="phone-dots">
                        <div className="phone-dot"></div>
                        <div className="phone-dot"></div>
                        <div className="phone-dot"></div>
                      </div>
                    </div>
                  </div>

                  {/* Main Calendar Screen */}
                  <div className="phone-content">
                    <div className="date-section">
                      <h3 className="date-title">December 17</h3>
                      <div className="today-badge">
                        <span className="today-text">TODAY 17</span>
                      </div>
                    </div>

                    <div className="period-card">
                      <div className="period-info">
                        <div className="period-text">Period in 5 days</div>
                        <div className="period-subtext">Low chances of getting pregnant</div>
                      </div>
                      <button className="log-period-btn">Log period</button>
                    </div>

                    <div className="insights-section">
                      <h4 className="insights-title">My daily insights • Today</h4>
                      
                      <div className="insight-item">
                        <span className="insight-icon">📊</span>
                        <span className="insight-text">Log your symptoms</span>
                      </div>

                      <div className="insight-item">
                        <span className="insight-icon">🔮</span>
                        <span className="insight-text">Symptoms to expect</span>
                      </div>

                      <div className="insight-item">
                        <span className="insight-icon">📅</span>
                        <span className="insight-text">Cycle day 25</span>
                      </div>
                    </div>
                  </div>

                  {/* Crypto Rewards Section */}
                  <div className="rewards-section">
                    <div className="rewards-card">
                      <div className="rewards-content">
                        <div className="rewards-text">
                          <div className="rewards-label">B3TR Earned Today</div>
                          <div className="rewards-amount">2.5 B3TR</div>
                        </div>
                        <div className="rewards-icon">💰</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <div className="features-header">
            <h2 className="features-title">Earn Crypto for Your Health Journey</h2>
            <p className="features-subtitle">Track your cycle and get rewarded with B3TR tokens</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3 className="feature-title">Period Logging</h3>
              <p className="feature-description">Log start/end dates and earn 1 B3TR</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">😊</div>
              <h3 className="feature-title">Symptom Tracking</h3>
              <p className="feature-description">Track pain, mood, flow intensity for 1 B3TR</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💭</div>
              <h3 className="feature-title">Mood Check-ins</h3>
              <p className="feature-description">Daily emotional well-being tracking for 1 B3TR</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3 className="feature-title">Medication Reminders</h3>
              <p className="feature-description">Track birth control, pain relief for 1 B3TR</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdf2f8 0%, #ffffff 100%);
          position: relative;
          overflow-x: hidden;
        }

        .background-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(20px);
        }

        .bg-circle-1 {
          top: 80px;
          left: 40px;
          width: 128px;
          height: 128px;
          background: #fbcfe8;
          opacity: 0.3;
        }

        .bg-circle-2 {
          top: 160px;
          right: 80px;
          width: 96px;
          height: 96px;
          background: #f9a8d4;
          opacity: 0.2;
          filter: blur(16px);
        }

        .bg-circle-3 {
          bottom: 160px;
          left: 25%;
          width: 160px;
          height: 160px;
          background: #fce7f3;
          opacity: 0.25;
          filter: blur(32px);
        }

        .bg-circle-4 {
          top: 50%;
          right: 33%;
          width: 80px;
          height: 80px;
          background: #fbcfe8;
          opacity: 0.3;
          filter: blur(16px);
        }

        .header {
          position: relative;
          z-index: 10;
          padding: 16px 24px;
        }

        .header-content {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: #ec4899;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .logo-text {
          font-size: 24px;
          font-weight: bold;
          color: #db2777;
        }

        .connect-wallet-btn {
          background: #ec4899;
          color: white;
          padding: 8px 24px;
          border-radius: 25px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.3s;
        }

        .connect-wallet-btn:hover {
          background: #db2777;
        }

        .hero-section {
          position: relative;
          z-index: 10;
          padding: 48px 24px;
        }

        .hero-content {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 20px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          max-width: 100%;
          min-height: 80vh;
        }

        @media (min-width: 1200px) {
          .hero-grid {
            grid-template-columns: 1.3fr 0.7fr;
            gap: 100px;
          }
        }

        .text-column {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .social-proof {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars {
          display: flex;
          gap: 4px;
        }

        .star {
          color: #fbbf24;
          font-size: 20px;
        }

        .social-text {
          color: #6b7280;
          font-size: 14px;
        }

        .main-headline {
          font-size: 56px;
          font-weight: bold;
          color: #111827;
          line-height: 1.1;
          max-width: 100%;
        }

        @media (min-width: 1200px) {
          .main-headline {
            font-size: 64px;
          }
        }

        .sparkle {
          color: #ec4899;
        }

        .description {
          font-size: 20px;
          color: #6b7280;
          line-height: 1.6;
        }

        .app-badges {
          display: flex;
          flex-direction: row;
          gap: 20px;
        }

        @media (min-width: 1200px) {
          .app-badges {
            gap: 24px;
          }
        }

        .app-badge {
          background: black;
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: background-color 0.3s;
        }

        .app-badge:hover {
          background: #374151;
        }

        .badge-icon {
          font-size: 24px;
        }

        .badge-text {
          text-align: left;
        }

        .badge-small {
          font-size: 12px;
        }

        .badge-large {
          font-size: 18px;
          font-weight: 600;
        }

        .handwritten-note {
          position: relative;
        }

        .note-content {
          background: #fce7f3;
          border: 2px solid #f9a8d4;
          border-radius: 16px;
          padding: 16px;
          transform: rotate(2deg);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .note-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .trophy {
          color: #db2777;
          font-size: 24px;
        }

        .note-title {
          font-weight: bold;
          color: #be185d;
        }

        .note-subtitle {
          color: #db2777;
          font-size: 14px;
        }

        .note-dot {
          position: absolute;
          top: -8px;
          left: -8px;
          width: 16px;
          height: 16px;
          background: #f9a8d4;
          border-radius: 50%;
        }

        .phone-column {
          position: relative;
        }

        .phone-mockup {
          position: relative;
          margin: 0 auto;
          width: 380px;
          height: 680px;
          background: white;
          border-radius: 40px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
          padding: 10px;
        }

        @media (min-width: 1200px) {
          .phone-mockup {
            width: 420px;
            height: 750px;
          }
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: #f9fafb;
          border-radius: 34px;
          overflow: hidden;
          position: relative;
        }

        .phone-header {
          background: #ec4899;
          color: white;
          padding: 12px;
          border-radius: 34px 34px 0 0;
        }

        .phone-header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .phone-title {
          font-weight: bold;
        }

        .phone-dots {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .phone-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        }

        .phone-content {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .date-section {
          text-align: center;
        }

        .date-title {
          font-weight: bold;
          color: #1f2937;
        }

        .today-badge {
          background: #fce7f3;
          border-radius: 25px;
          padding: 8px 16px;
          margin-top: 8px;
          display: inline-block;
        }

        .today-text {
          color: #be185d;
          font-weight: 600;
        }

        .period-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #fce7f3;
        }

        .period-text {
          font-size: 14px;
          color: #6b7280;
        }

        .period-subtext {
          font-size: 12px;
          color: #9ca3af;
        }

        .log-period-btn {
          background: #ec4899;
          color: white;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          width: 100%;
          margin-top: 12px;
        }

        .insights-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .insights-title {
          font-weight: 600;
          color: #1f2937;
        }

        .insight-item {
          background: white;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .insight-icon {
          color: #ec4899;
        }

        .insight-text {
          font-size: 14px;
          font-weight: 500;
        }

        .rewards-section {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
        }

        .rewards-card {
          background: linear-gradient(90deg, #ec4899, #8b5cf6);
          border-radius: 12px;
          padding: 12px;
          color: white;
        }

        .rewards-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rewards-label {
          font-size: 12px;
          opacity: 0.9;
        }

        .rewards-amount {
          font-weight: bold;
        }

        .rewards-icon {
          font-size: 24px;
        }

        .features-section {
          position: relative;
          z-index: 10;
          padding: 64px 24px;
          background: rgba(255, 255, 255, 0.5);
        }

        .features-content {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 20px;
        }

        .features-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .features-title {
          font-size: 36px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 16px;
        }

        .features-subtitle {
          font-size: 20px;
          color: #6b7280;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }

        .feature-card {
          text-align: center;
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          background: #fce7f3;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 24px;
        }

        .feature-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .feature-description {
          color: #6b7280;
          font-size: 14px;
        }

        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .main-headline {
            font-size: 32px;
          }
          
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .phone-mockup {
            width: 240px;
            height: 420px;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 24px 16px;
          }
          
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }
          
          .main-headline {
            font-size: 24px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .app-badges {
            flex-direction: column;
          }
          
          .phone-mockup {
            width: 200px;
            height: 360px;
          }
        }

        @media (min-width: 769px) and (max-width: 1199px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
            gap: 60px;
          }
          
          .main-headline {
            font-size: 48px;
          }
          
          .phone-mockup {
            width: 320px;
            height: 580px;
          }
        }
      `}</style>
    </div>
  );
}
