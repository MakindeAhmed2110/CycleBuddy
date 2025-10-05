'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar, Plus, TrendingUp, Target, Award, Activity } from 'lucide-react';
import { PeriodData, SymptomData, UserProfile, CyclePrediction } from '../types/period';
import { PeriodCalculator } from '../utils/periodCalculator';
import { StorageManager } from '../utils/storage';

interface PeriodTrackerProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

interface PeriodFormData {
  startDate: string;
  endDate: string;
  flow: string;
  pain: string;
  mood: string;
  energy: string;
  notes: string;
}

interface SymptomFormData {
  date: string;
  type: string;
  severity: string;
  notes: string;
}

export const PeriodTracker: React.FC<PeriodTrackerProps> = ({ userProfile, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'log-period' | 'log-symptoms' | 'predictions'>('overview');
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null);
  const [currentPhase, setCurrentPhase] = useState<any>(null);
  const [rewards, setRewards] = useState<any>(null);

  const periodForm = useForm<PeriodFormData>();
  const symptomForm = useForm<SymptomFormData>();

  useEffect(() => {
    if (userProfile.periods.length > 0) {
      const pred = PeriodCalculator.predictNextCycle(userProfile);
      setPrediction(pred);
      
      const phase = PeriodCalculator.getCurrentCyclePhase(
        new Date(),
        userProfile.lastPeriodStart || userProfile.periods[userProfile.periods.length - 1].startDate,
        pred
      );
      setCurrentPhase(phase);
    }

    const rewardData = PeriodCalculator.calculateRewards(userProfile);
    setRewards(rewardData);
  }, [userProfile]);

  const handlePeriodSubmit = (data: PeriodFormData) => {
    const newPeriod: PeriodData = {
      id: Date.now().toString(),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      cycleLength: userProfile.periods.length > 0 
        ? differenceInDays(new Date(data.startDate), userProfile.periods[userProfile.periods.length - 1].startDate)
        : 28,
      symptoms: [],
      flow: data.flow as any,
      pain: data.pain as any,
      mood: data.mood as any,
      energy: data.energy as any,
    };

    const updatedProfile: UserProfile = {
      ...userProfile,
      periods: [...userProfile.periods, newPeriod],
      lastPeriodStart: new Date(data.startDate),
    };

    StorageManager.saveUserProfile(updatedProfile);
    onProfileUpdate(updatedProfile);
    periodForm.reset();
    setActiveTab('overview');
  };

  const handleSymptomSubmit = (data: SymptomFormData) => {
    const newSymptom: SymptomData = {
      id: Date.now().toString(),
      date: new Date(data.date),
      type: data.type as any,
      severity: data.severity as any,
      notes: data.notes,
    };

    const updatedProfile: UserProfile = {
      ...userProfile,
      symptoms: [...userProfile.symptoms, newSymptom],
    };

    StorageManager.saveUserProfile(updatedProfile);
    onProfileUpdate(updatedProfile);
    symptomForm.reset();
    setActiveTab('overview');
  };

  const getPhaseColor = (phase: string) => {
    const colors = {
      menstrual: 'from-red-400 to-pink-500',
      follicular: 'from-green-400 to-emerald-500',
      ovulation: 'from-yellow-400 to-orange-500',
      luteal: 'from-purple-400 to-indigo-500',
    };
    return colors[phase as keyof typeof colors] || 'from-gray-400 to-gray-500';
  };

  const getPhaseIcon = (phase: string) => {
    const icons = {
      menstrual: '🩸',
      follicular: '🌱',
      ovulation: '🥚',
      luteal: '🌙',
    };
    return icons[phase as keyof typeof icons] || '📅';
  };

  return (
    <div className="period-tracker-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Period Tracker</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('log-period')}
            className="period-tracker-button period-tracker-button-primary"
          >
            <Plus size={16} />
            Log Period
          </button>
          <button
            onClick={() => setActiveTab('log-symptoms')}
            className="period-tracker-button period-tracker-button-primary"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
          >
            <Activity size={16} />
            Log Symptoms
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="period-tracker-tabs">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'log-period', label: 'Log Period', icon: Calendar },
          { id: 'log-symptoms', label: 'Log Symptoms', icon: Activity },
          { id: 'predictions', label: 'Predictions', icon: Target },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`period-tracker-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Current Phase Card */}
            {currentPhase && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="period-tracker-phase-card"
              >
                <div className="period-tracker-phase-content">
                  <div className="period-tracker-phase-title">
                    <span className="period-tracker-phase-emoji">{getPhaseIcon(currentPhase.phase)}</span>
                    <span className="capitalize">{currentPhase.phase} Phase</span>
                  </div>
                  <div className="period-tracker-phase-description">
                    Day {currentPhase.dayInCycle} of cycle - {currentPhase.description}
                  </div>
                  <div className="period-tracker-phase-stats">
                    <div className="period-tracker-phase-day">
                      Day {currentPhase.dayInCycle}
                    </div>
                    <div className="period-tracker-phase-days-until">
                      <div className="period-tracker-phase-days-until-value">
                        {currentPhase.daysUntilNext}
                      </div>
                      <div className="period-tracker-phase-days-until-label">
                        days until next period
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats Grid */}
            <div className="period-tracker-stats-grid">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="period-tracker-stat-card"
              >
                <div className="period-tracker-stat-icon">
                  <Calendar className="w-5 h-5 text-pink-600" />
                </div>
                <div className="period-tracker-stat-value">
                  {userProfile.periods.length}
                </div>
                <div className="period-tracker-stat-label">Cycles Tracked</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="period-tracker-stat-card"
              >
                <div className="period-tracker-stat-icon">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div className="period-tracker-stat-value">
                  {userProfile.averageCycleLength}
                </div>
                <div className="period-tracker-stat-label">Avg Cycle Length</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="period-tracker-stat-card"
              >
                <div className="period-tracker-stat-icon">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="period-tracker-stat-value">
                  {userProfile.symptoms.length}
                </div>
                <div className="period-tracker-stat-label">Symptoms Logged</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="period-tracker-stat-card"
              >
                <div className="period-tracker-stat-icon">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="period-tracker-stat-value">
                  {rewards?.totalEarned || 0}
                </div>
                <div className="period-tracker-stat-label">VET Earned</div>
              </motion.div>
            </div>

            {/* Recent Periods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="period-tracker-recent-periods"
            >
              <h3 className="period-tracker-recent-periods-title">Recent Periods</h3>
              <div className="period-tracker-recent-periods-list">
                {userProfile.periods.slice(-5).reverse().map((period) => (
                  <div key={period.id} className="period-tracker-recent-period-item">
                    <div>
                      <div className="period-tracker-recent-period-date">
                        {format(period.startDate, 'MMM dd, yyyy')}
                      </div>
                      <div className="period-tracker-recent-period-duration">
                        {differenceInDays(period.endDate, period.startDate) + 1} days
                      </div>
                    </div>
                    <div className="period-tracker-recent-period-cycle">
                      {period.cycleLength} day cycle
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'log-period' && (
          <motion.div
            key="log-period"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="period-tracker-content"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Log New Period</h3>
            <form onSubmit={periodForm.handleSubmit(handlePeriodSubmit)} className="period-tracker-form">
              <div className="period-tracker-form-grid">
                <div className="period-tracker-form-group">
                  <label className="period-tracker-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...periodForm.register('startDate', { required: true })}
                    className="period-tracker-input"
                  />
                </div>
                <div className="period-tracker-form-group">
                  <label className="period-tracker-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...periodForm.register('endDate', { required: true })}
                    className="period-tracker-input"
                  />
                </div>
              </div>

              <div className="period-tracker-form-grid">
                <div className="period-tracker-form-group">
                  <label className="period-tracker-label">
                    Flow Level
                  </label>
                  <select
                    {...periodForm.register('flow')}
                    className="period-tracker-input"
                  >
                    <option value="spotting">Spotting</option>
                    <option value="light">Light</option>
                    <option value="normal">Normal</option>
                    <option value="heavy">Heavy</option>
                    <option value="very_heavy">Very Heavy</option>
                  </select>
                </div>
                <div className="period-tracker-form-group">
                  <label className="period-tracker-label">
                    Pain Level
                  </label>
                  <select
                    {...periodForm.register('pain')}
                    className="period-tracker-input"
                  >
                    <option value="none">None</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="very_severe">Very Severe</option>
                  </select>
                </div>
              </div>

              <div className="period-tracker-form-grid">
                <div className="period-tracker-form-group">
                  <label className="period-tracker-label">
                    Mood
                  </label>
                  <select
                    {...periodForm.register('mood')}
                    className="period-tracker-input"
                  >
                    <option value="happy">Happy</option>
                    <option value="sad">Sad</option>
                    <option value="anxious">Anxious</option>
                    <option value="irritable">Irritable</option>
                    <option value="calm">Calm</option>
                    <option value="energetic">Energetic</option>
                    <option value="depressed">Depressed</option>
                    <option value="confident">Confident</option>
                  </select>
                </div>
                <div className="period-tracker-form-group">
                  <label className="period-tracker-label">
                    Energy Level
                  </label>
                  <select
                    {...periodForm.register('energy')}
                    className="period-tracker-input"
                  >
                    <option value="very_low">Very Low</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="very_high">Very High</option>
                  </select>
                </div>
              </div>

              <div className="period-tracker-form-group">
                <label className="period-tracker-label">
                  Notes (Optional)
                </label>
                <textarea
                  {...periodForm.register('notes')}
                  rows={3}
                  className="period-tracker-textarea"
                  placeholder="Any additional notes about your period..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="period-tracker-button period-tracker-button-primary"
                >
                  Save Period
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="period-tracker-button period-tracker-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {activeTab === 'log-symptoms' && (
          <motion.div
            key="log-symptoms"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="period-tracker-content"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Log Symptoms</h3>
            <form onSubmit={symptomForm.handleSubmit(handleSymptomSubmit)} className="period-tracker-form">
              <div className="period-tracker-form-grid">
                <div className="period-tracker-form-group">
                  <label className="period-tracker-label">
                    Date
                  </label>
                  <input
                    type="date"
                    {...symptomForm.register('date', { required: true })}
                    defaultValue={format(new Date(), 'yyyy-MM-dd')}
                    className="period-tracker-input"
                  />
                </div>
                <div className="period-tracker-form-group">
                  <label className="period-tracker-label">
                    Symptom Type
                  </label>
                  <select
                    {...symptomForm.register('type', { required: true })}
                    className="period-tracker-input"
                  >
                    <option value="cramps">Cramps</option>
                    <option value="headache">Headache</option>
                    <option value="bloating">Bloating</option>
                    <option value="mood_swings">Mood Swings</option>
                    <option value="fatigue">Fatigue</option>
                    <option value="breast_tenderness">Breast Tenderness</option>
                    <option value="acne">Acne</option>
                    <option value="food_cravings">Food Cravings</option>
                    <option value="sleep_issues">Sleep Issues</option>
                    <option value="nausea">Nausea</option>
                    <option value="back_pain">Back Pain</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="period-tracker-form-group">
                <label className="period-tracker-label">
                  Severity
                </label>
                <select
                  {...symptomForm.register('severity', { required: true })}
                  className="period-tracker-input"
                >
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div className="period-tracker-form-group">
                <label className="period-tracker-label">
                  Notes (Optional)
                </label>
                <textarea
                  {...symptomForm.register('notes')}
                  rows={3}
                  className="period-tracker-textarea"
                  placeholder="Describe your symptoms in more detail..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="period-tracker-button period-tracker-button-primary"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
                >
                  Save Symptom
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="period-tracker-button period-tracker-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {activeTab === 'predictions' && prediction && (
          <motion.div
            key="predictions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cycle Predictions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Next Period</h4>
                  <div className="text-2xl font-bold text-pink-600">
                    {format(prediction.nextPeriodStart, 'MMM dd, yyyy')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {differenceInDays(prediction.nextPeriodStart, new Date())} days from now
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Ovulation</h4>
                  <div className="text-2xl font-bold text-orange-600">
                    {format(prediction.ovulationDate, 'MMM dd, yyyy')}
                  </div>
                  <div className="text-sm text-gray-600">
                    Peak fertility window
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">Fertile Window</h4>
                <div className="text-lg text-green-600">
                  {format(prediction.fertileWindow.start, 'MMM dd')} - {format(prediction.fertileWindow.end, 'MMM dd, yyyy')}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Prediction Confidence</span>
                  <span className="text-sm font-medium text-gray-800">
                    {Math.round(prediction.confidence * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
