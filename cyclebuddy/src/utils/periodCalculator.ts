import { addDays, differenceInDays, format, isWithinInterval, startOfDay } from 'date-fns';
import { PeriodData, CyclePrediction, UserProfile, SymptomData } from '../types/period';

export class PeriodCalculator {
  private static readonly DEFAULT_CYCLE_LENGTH = 28;
  private static readonly DEFAULT_LUTEAL_PHASE = 14;
  private static readonly MIN_CYCLE_LENGTH = 21;
  private static readonly MAX_CYCLE_LENGTH = 35;
  private static readonly MIN_PERIOD_LENGTH = 3;
  private static readonly MAX_PERIOD_LENGTH = 7;

  /**
   * Calculate cycle statistics from historical data
   */
  static calculateCycleStats(periods: PeriodData[]): {
    averageCycleLength: number;
    averagePeriodLength: number;
    averageLutealPhase: number;
    cycleVariability: number;
  } {
    if (periods.length < 2) {
      return {
        averageCycleLength: this.DEFAULT_CYCLE_LENGTH,
        averagePeriodLength: 5,
        averageLutealPhase: this.DEFAULT_LUTEAL_PHASE,
        cycleVariability: 0,
      };
    }

    // Calculate cycle lengths
    const cycleLengths: number[] = [];
    for (let i = 1; i < periods.length; i++) {
      const cycleLength = differenceInDays(periods[i].startDate, periods[i - 1].startDate);
      if (cycleLength >= this.MIN_CYCLE_LENGTH && cycleLength <= this.MAX_CYCLE_LENGTH) {
        cycleLengths.push(cycleLength);
      }
    }

    // Calculate period lengths
    const periodLengths = periods.map(period => 
      differenceInDays(period.endDate, period.startDate) + 1
    );

    // Calculate luteal phases (assuming ovulation is 14 days before next period)
    const lutealPhases = cycleLengths.map(cycleLength => 
      Math.min(cycleLength - 14, this.DEFAULT_LUTEAL_PHASE)
    );

    const averageCycleLength = cycleLengths.length > 0 
      ? Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)
      : this.DEFAULT_CYCLE_LENGTH;

    const averagePeriodLength = Math.round(
      periodLengths.reduce((sum, length) => sum + length, 0) / periodLengths.length
    );

    const averageLutealPhase = lutealPhases.length > 0
      ? Math.round(lutealPhases.reduce((sum, phase) => sum + phase, 0) / lutealPhases.length)
      : this.DEFAULT_LUTEAL_PHASE;

    // Calculate cycle variability (standard deviation)
    const cycleVariability = cycleLengths.length > 1
      ? Math.round(Math.sqrt(
          cycleLengths.reduce((sum, length) => sum + Math.pow(length - averageCycleLength, 2), 0) / 
          (cycleLengths.length - 1)
        ))
      : 0;

    return {
      averageCycleLength,
      averagePeriodLength,
      averageLutealPhase,
      cycleVariability,
    };
  }

  /**
   * Predict next cycle based on historical data
   */
  static predictNextCycle(userProfile: UserProfile): CyclePrediction {
    const stats = this.calculateCycleStats(userProfile.periods);
    const lastPeriod = userProfile.periods[userProfile.periods.length - 1];
    
    if (!lastPeriod) {
      // No historical data, use defaults
      const nextPeriodStart = addDays(new Date(), 28);
      const nextPeriodEnd = addDays(nextPeriodStart, stats.averagePeriodLength - 1);
      const ovulationDate = addDays(nextPeriodStart, -stats.averageLutealPhase);
      
      return {
        nextPeriodStart,
        nextPeriodEnd,
        ovulationDate,
        fertileWindow: {
          start: addDays(ovulationDate, -5),
          end: addDays(ovulationDate, 1),
        },
        lutealPhase: stats.averageLutealPhase,
        cycleLength: stats.averageCycleLength,
        confidence: 0.3, // Low confidence with no data
      };
    }

    // Calculate next period start
    const nextPeriodStart = addDays(lastPeriod.startDate, stats.averageCycleLength);
    const nextPeriodEnd = addDays(nextPeriodStart, stats.averagePeriodLength - 1);
    
    // Calculate ovulation (typically 14 days before next period)
    const ovulationDate = addDays(nextPeriodStart, -stats.averageLutealPhase);
    
    // Fertile window (5 days before ovulation + ovulation day + 1 day after)
    const fertileWindow = {
      start: addDays(ovulationDate, -5),
      end: addDays(ovulationDate, 1),
    };

    // Calculate confidence based on data quality
    const confidence = this.calculateConfidence(userProfile.periods, stats);

    return {
      nextPeriodStart,
      nextPeriodEnd,
      ovulationDate,
      fertileWindow,
      lutealPhase: stats.averageLutealPhase,
      cycleLength: stats.averageCycleLength,
      confidence,
    };
  }

  /**
   * Calculate prediction confidence based on data quality
   */
  private static calculateConfidence(periods: PeriodData[], stats: any): number {
    if (periods.length < 3) return 0.3;
    if (periods.length < 6) return 0.6;
    if (periods.length < 12) return 0.8;
    
    // High confidence if cycle variability is low
    if (stats.cycleVariability <= 2) return 0.95;
    if (stats.cycleVariability <= 4) return 0.85;
    return 0.75;
  }

  /**
   * Get current cycle phase
   */
  static getCurrentCyclePhase(
    currentDate: Date, 
    lastPeriodStart: Date, 
    prediction: CyclePrediction
  ): {
    phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
    dayInCycle: number;
    daysUntilNext: number;
    description: string;
  } {
    const daysSinceLastPeriod = differenceInDays(currentDate, lastPeriodStart);
    const daysUntilNext = differenceInDays(prediction.nextPeriodStart, currentDate);
    
    // Menstrual phase (first 3-7 days)
    if (daysSinceLastPeriod <= 7) {
      return {
        phase: 'menstrual',
        dayInCycle: daysSinceLastPeriod,
        daysUntilNext,
        description: 'Menstrual phase - period is active',
      };
    }
    
    // Ovulation phase (around day 14, ±2 days)
    const ovulationDay = differenceInDays(prediction.ovulationDate, lastPeriodStart);
    if (Math.abs(daysSinceLastPeriod - ovulationDay) <= 2) {
      return {
        phase: 'ovulation',
        dayInCycle: daysSinceLastPeriod,
        daysUntilNext,
        description: 'Ovulation phase - peak fertility',
      };
    }
    
    // Luteal phase (after ovulation until next period)
    if (daysSinceLastPeriod > ovulationDay + 2) {
      return {
        phase: 'luteal',
        dayInCycle: daysSinceLastPeriod,
        daysUntilNext,
        description: 'Luteal phase - preparing for next cycle',
      };
    }
    
    // Follicular phase (between menstrual and ovulation)
    return {
      phase: 'follicular',
      dayInCycle: daysSinceLastPeriod,
      daysUntilNext,
      description: 'Follicular phase - egg development',
    };
  }

  /**
   * Analyze symptoms for cycle phase correlation
   */
  static analyzeSymptoms(symptoms: SymptomData[], cyclePhase: string): {
    commonSymptoms: string[];
    severityTrend: 'increasing' | 'decreasing' | 'stable';
    recommendations: string[];
  } {
    const phaseSymptoms = symptoms.filter(symptom => 
      this.getSymptomPhase(symptom.type) === cyclePhase
    );

    const symptomCounts = phaseSymptoms.reduce((acc, symptom) => {
      acc[symptom.type] = (acc[symptom.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const commonSymptoms = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([symptom]) => symptom);

    // Simple severity trend analysis
    const recentSymptoms = phaseSymptoms.slice(-5);
    const olderSymptoms = phaseSymptoms.slice(-10, -5);
    
    const recentAvgSeverity = recentSymptoms.length > 0 
      ? recentSymptoms.reduce((sum, s) => sum + this.getSeverityValue(s.severity), 0) / recentSymptoms.length
      : 0;
    
    const olderAvgSeverity = olderSymptoms.length > 0
      ? olderSymptoms.reduce((sum, s) => sum + this.getSeverityValue(s.severity), 0) / olderSymptoms.length
      : 0;

    let severityTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recentAvgSeverity > olderAvgSeverity + 0.5) severityTrend = 'increasing';
    else if (recentAvgSeverity < olderAvgSeverity - 0.5) severityTrend = 'decreasing';

    const recommendations = this.getPhaseRecommendations(cyclePhase, commonSymptoms);

    return {
      commonSymptoms,
      severityTrend,
      recommendations,
    };
  }

  private static getSymptomPhase(symptomType: string): string {
    const phaseMap: Record<string, string> = {
      'cramps': 'menstrual',
      'bloating': 'menstrual',
      'mood_swings': 'luteal',
      'breast_tenderness': 'luteal',
      'fatigue': 'menstrual',
      'headache': 'menstrual',
    };
    return phaseMap[symptomType] || 'follicular';
  }

  private static getSeverityValue(severity: string): number {
    const severityMap: Record<string, number> = {
      'none': 0,
      'mild': 1,
      'moderate': 2,
      'severe': 3,
    };
    return severityMap[severity] || 0;
  }

  private static getPhaseRecommendations(phase: string, symptoms: string[]): string[] {
    const recommendations: Record<string, string[]> = {
      'menstrual': [
        'Stay hydrated and get plenty of rest',
        'Consider gentle exercise like yoga or walking',
        'Use heating pads for cramps',
      ],
      'follicular': [
        'Great time for intense workouts',
        'Focus on protein-rich foods',
        'Plan important tasks and projects',
      ],
      'ovulation': [
        'Peak energy and confidence',
        'Ideal time for social activities',
        'Stay hydrated and maintain balanced diet',
      ],
      'luteal': [
        'Focus on stress management',
        'Include magnesium-rich foods',
        'Practice relaxation techniques',
      ],
    };
    return recommendations[phase] || [];
  }

  /**
   * Calculate rewards based on logging activity
   */
  static calculateRewards(userProfile: UserProfile): {
    dailyLoggingReward: number;
    cycleCompletionReward: number;
    symptomLoggingReward: number;
    accuracyReward: number;
    totalEarned: number;
  } {
    const dailyLoggingReward = userProfile.symptoms.length * 2; // 2 VET per symptom logged
    const cycleCompletionReward = userProfile.periods.length * 25; // 25 VET per completed cycle
    const symptomLoggingReward = userProfile.symptoms.filter(s => s.severity !== 'none').length * 3; // 3 VET per symptom with severity
    const accuracyReward = Math.min(userProfile.periods.length * 5, 100); // Up to 100 VET for accuracy
    
    const totalEarned = dailyLoggingReward + cycleCompletionReward + symptomLoggingReward + accuracyReward;

    return {
      dailyLoggingReward,
      cycleCompletionReward,
      symptomLoggingReward,
      accuracyReward,
      totalEarned,
    };
  }
}

