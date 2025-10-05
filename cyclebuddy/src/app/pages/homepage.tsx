'use client';
import { type ReactElement, useState, useEffect } from 'react';
import {
    useWallet,
    useWalletModal,
} from '@vechain/dapp-kit-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PeriodTracker } from '../../components/PeriodTracker';
import { UserProfile } from '../../types/period';
import { StorageManager } from '../../utils/storage';

// Landing Page Component
const LandingPage = (): ReactElement => {
    const { open } = useWalletModal();

    return (
        <div className="landing-container">
            <h1 className="landing-logo">CycleBuddy 💫</h1>
            <p className="landing-tagline">Track Your Period, Earn Crypto</p>
            <p className="landing-description">
                The first period tracking app that rewards women and teens with cryptocurrency 
                for taking care of their health on VeChain.
            </p>
            
            <div className="landing-features">
                <div className="landing-feature">
                    <div className="landing-feature-icon">📅</div>
                    <div className="landing-feature-text">Smart Period Tracking</div>
                </div>
                <div className="landing-feature">
                    <div className="landing-feature-icon">💰</div>
                    <div className="landing-feature-text">Earn VET Tokens</div>
                </div>
                <div className="landing-feature">
                    <div className="landing-feature-icon">🤖</div>
                    <div className="landing-feature-text">AI Health Assistant</div>
                </div>
                <div className="landing-feature">
                    <div className="landing-feature-icon">🔒</div>
                    <div className="landing-feature-text">Privacy First</div>
                </div>
            </div>
            
            <button className="connect-button" onClick={open}>
                Connect Wallet & Start Earning
            </button>
        </div>
    );
};

// Calendar Component
const CalendarComponent = (): ReactElement => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const getDayType = (day: number) => {
        // Mock logic for period tracking
        const dayOfMonth = day;
        if (dayOfMonth >= 1 && dayOfMonth <= 5) return 'period';
        if (dayOfMonth >= 12 && dayOfMonth <= 16) return 'ovulation';
        if (dayOfMonth >= 10 && dayOfMonth <= 18) return 'fertile';
        return 'normal';
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Previous month days
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push(
                <div key={`prev-${i}`} className="calendar-day other-month">
                    {daysInPrevMonth - i}
                </div>
            );
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayType = getDayType(day);
            const isSelected = selectedDate && 
                selectedDate.getDate() === day && 
                selectedDate.getMonth() === currentDate.getMonth();
            
            days.push(
                <div 
                    key={day} 
                    className={`calendar-day ${dayType} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                >
                    {day}
                </div>
            );
        }

        // Next month days
        const remainingDays = 42 - days.length; // 6 weeks * 7 days
        for (let day = 1; day <= remainingDays; day++) {
            days.push(
                <div key={`next-${day}`} className="calendar-day other-month">
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="calendar-nav">
                    <button onClick={() => navigateMonth('prev')}>‹</button>
                    <div className="calendar-month">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                    <button onClick={() => navigateMonth('next')}>›</button>
                </div>
            </div>

            <div className="calendar-grid">
                {dayNames.map(day => (
                    <div key={day} className="calendar-day-header">
                        {day}
                    </div>
                ))}
                {renderCalendarDays()}
            </div>
        </div>
    );
};

// AI Chat Component
const AIChatComponent = (): ReactElement => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: "Hi! I'm your AI health assistant. I can help you with period tracking, cycle predictions, and general health questions. How can I help you today?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                content: "I understand your question about " + inputValue + ". Based on your cycle data, I can provide personalized insights. Would you like me to explain more about your current cycle phase?"
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="ai-chat-container">
            <div className="chat-header">
                <div className="chat-avatar">🤖</div>
                <div className="chat-title">Health Assistant</div>
                <div className="chat-status">● Online</div>
            </div>
            
            <div className="chat-messages">
                {messages.map(message => (
                    <div key={message.id} className={`message ${message.type}`}>
                        <div className="message-avatar">
                            {message.type === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className="message-content">
                            {message.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="message ai">
                        <div className="message-avatar">🤖</div>
                        <div className="message-content">
                            <div className="loading"></div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="chat-input">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about your cycle, symptoms, or health..."
                />
                <button className="send-button" onClick={sendMessage}>
                    ➤
                </button>
            </div>
        </div>
    );
};

// Rewards Component
const RewardsComponent = (): ReactElement => {
    const rewards = [
        {
            id: 1,
            title: "Daily Logging",
            description: "Log your period symptoms",
            amount: "5 VET",
            status: "earned",
            icon: "📝"
        },
        {
            id: 2,
            title: "Cycle Completion",
            description: "Complete a full cycle",
            amount: "25 VET",
            status: "earned",
            icon: "🔄"
        },
        {
            id: 3,
            title: "Health Insights",
            description: "Share health data",
            amount: "10 VET",
            status: "pending",
            icon: "📊"
        },
        {
            id: 4,
            title: "Community Help",
            description: "Help other users",
            amount: "15 VET",
            status: "pending",
            icon: "🤝"
        }
    ];

    const totalEarned = rewards
        .filter(r => r.status === 'earned')
        .reduce((sum, r) => sum + parseInt(r.amount), 0);

    return (
        <div className="rewards-container">
            <div className="rewards-header">
                <h3 className="card-title">Rewards</h3>
                <button className="card-action">View All</button>
            </div>

            <div className="rewards-balance">
                <div className="balance-amount">{totalEarned} VET</div>
                <div className="balance-label">Total Earned</div>
            </div>

            <div className="rewards-list">
                {rewards.map(reward => (
                    <div key={reward.id} className="reward-item">
                        <div className={`reward-icon ${reward.status}`}>
                            {reward.icon}
                        </div>
                        <div className="reward-details">
                            <div className="reward-title">{reward.title}</div>
                            <div className="reward-description">{reward.description}</div>
                        </div>
                        <div className="reward-amount">{reward.amount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Dashboard Component
const Dashboard = (): ReactElement => {
    const { account, disconnect } = useWallet();
    const [activeSection, setActiveSection] = useState<'tracker' | 'calendar' | 'ai' | 'rewards'>('tracker');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile>({
        id: account || 'default',
        averageCycleLength: 28,
        averagePeriodLength: 5,
        averageLutealPhase: 14,
        periods: [],
        symptoms: [],
    });

    // Load user profile on mount
    useEffect(() => {
        if (account) {
            const savedProfile = StorageManager.loadUserProfile();
            if (savedProfile) {
                setUserProfile(savedProfile);
            } else {
                // Create new profile for this wallet
                const newProfile: UserProfile = {
                    id: account,
                    averageCycleLength: 28,
                    averagePeriodLength: 5,
                    averageLutealPhase: 14,
                    periods: [],
                    symptoms: [],
                };
                setUserProfile(newProfile);
                StorageManager.saveUserProfile(newProfile);
            }
        }
    }, [account]);

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const handleProfileUpdate = (updatedProfile: UserProfile) => {
        setUserProfile(updatedProfile);
    };

    const periodHistory = [
        { month: 'Jul', days: 3 },
        { month: 'Aug', days: 2 },
        { month: 'Sep', days: 4 },
        { month: 'Oct', days: 3 },
        { month: 'Nov', days: 2 },
        { month: 'Dec', days: 5, current: true }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'tracker':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="dashboard-main"
                    >
                        <PeriodTracker 
                            userProfile={userProfile} 
                            onProfileUpdate={handleProfileUpdate}
                        />
                    </motion.div>
                );
            case 'calendar':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <CalendarComponent />
                    </motion.div>
                );
            case 'ai':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AIChatComponent />
                    </motion.div>
                );
            case 'rewards':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <RewardsComponent />
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">CycleBuddy 💫</div>
                    <div className="logo-subtitle">Period Tracking & Crypto Rewards</div>
                </div>
                
                <nav className="nav-menu">
                    <div className="nav-item">
                        <button 
                            className={`nav-link ${activeSection === 'tracker' ? 'active' : ''}`}
                            onClick={() => setActiveSection('tracker')}
                        >
                            <span className="nav-icon">📊</span>
                            <span className="nav-text">Period Tracker</span>
                        </button>
                    </div>
                    <div className="nav-item">
                        <button 
                            className={`nav-link ${activeSection === 'calendar' ? 'active' : ''}`}
                            onClick={() => setActiveSection('calendar')}
                        >
                            <span className="nav-icon">📅</span>
                            <span className="nav-text">Calendar</span>
                        </button>
                    </div>
                    <div className="nav-item">
                        <button 
                            className={`nav-link ${activeSection === 'ai' ? 'active' : ''}`}
                            onClick={() => setActiveSection('ai')}
                        >
                            <span className="nav-icon">🤖</span>
                            <span className="nav-text">Health AI</span>
                        </button>
                    </div>
                    <div className="nav-item">
                        <button 
                            className={`nav-link ${activeSection === 'rewards' ? 'active' : ''}`}
                            onClick={() => setActiveSection('rewards')}
                        >
                            <span className="nav-icon">💰</span>
                            <span className="nav-text">Rewards</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Header */}
                <div className="top-header">
                    <div className="header-left">
                        <h1>
                            {activeSection === 'tracker' && 'Period Tracker'}
                            {activeSection === 'calendar' && 'Calendar'}
                            {activeSection === 'ai' && 'AI Health Assistant'}
                            {activeSection === 'rewards' && 'Rewards & Earnings'}
                        </h1>
                        <p>{getCurrentDate()}</p>
                    </div>
                    <div className="wallet-info">
                        <div className="wallet-address">
                            {account ? formatAddress(account) : 'Not connected'}
                        </div>
                        {account && (
                            <button className="disconnect-btn" onClick={disconnect}>
                                Disconnect
            </button>
                        )}
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="dashboard-grid">
                    {renderContent()}
                    <div className="dashboard-sidebar">
                        {activeSection === 'tracker' && <RewardsComponent />}
                        {activeSection === 'calendar' && <AIChatComponent />}
                        {activeSection === 'ai' && <RewardsComponent />}
                        {activeSection === 'rewards' && <CalendarComponent />}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main HomePage Component
const HomePage = (): ReactElement => {
    const { account } = useWallet();

    // Show landing page if not connected, dashboard if connected
    return account ? <Dashboard /> : <LandingPage />;
};

export default HomePage;