import { UserProfile, PeriodData, SymptomData } from '../types/period';

const STORAGE_KEYS = {
  USER_PROFILE: 'cyclebuddy_user_profile',
  PERIODS: 'cyclebuddy_periods',
  SYMPTOMS: 'cyclebuddy_symptoms',
} as const;

export class StorageManager {
  /**
   * Save user profile to localStorage
   */
  static saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify({
        ...profile,
        periods: profile.periods.map(period => ({
          ...period,
          startDate: period.startDate.toISOString(),
          endDate: period.endDate.toISOString(),
        })),
        lastPeriodStart: profile.lastPeriodStart?.toISOString(),
      }));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  }

  /**
   * Load user profile from localStorage
   */
  static loadUserProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        periods: parsed.periods.map((period: any) => ({
          ...period,
          startDate: new Date(period.startDate),
          endDate: new Date(period.endDate),
        })),
        lastPeriodStart: parsed.lastPeriodStart ? new Date(parsed.lastPeriodStart) : undefined,
      };
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  }

  /**
   * Save periods data
   */
  static savePeriods(periods: PeriodData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(
        periods.map(period => ({
          ...period,
          startDate: period.startDate.toISOString(),
          endDate: period.endDate.toISOString(),
          symptoms: period.symptoms.map(symptom => ({
            ...symptom,
            date: symptom.date.toISOString(),
          })),
        }))
      ));
    } catch (error) {
      console.error('Failed to save periods:', error);
    }
  }

  /**
   * Load periods data
   */
  static loadPeriods(): PeriodData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PERIODS);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return parsed.map((period: any) => ({
        ...period,
        startDate: new Date(period.startDate),
        endDate: new Date(period.endDate),
        symptoms: period.symptoms.map((symptom: any) => ({
          ...symptom,
          date: new Date(symptom.date),
        })),
      }));
    } catch (error) {
      console.error('Failed to load periods:', error);
      return [];
    }
  }

  /**
   * Save symptoms data
   */
  static saveSymptoms(symptoms: SymptomData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(
        symptoms.map(symptom => ({
          ...symptom,
          date: symptom.date.toISOString(),
        }))
      ));
    } catch (error) {
      console.error('Failed to save symptoms:', error);
    }
  }

  /**
   * Load symptoms data
   */
  static loadSymptoms(): SymptomData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SYMPTOMS);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return parsed.map((symptom: any) => ({
        ...symptom,
        date: new Date(symptom.date),
      }));
    } catch (error) {
      console.error('Failed to load symptoms:', error);
      return [];
    }
  }

  /**
   * Clear all data
   */
  static clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.PERIODS);
      localStorage.removeItem(STORAGE_KEYS.SYMPTOMS);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  /**
   * Export data for backup
   */
  static exportData(): string {
    try {
      const profile = this.loadUserProfile();
      const periods = this.loadPeriods();
      const symptoms = this.loadSymptoms();

      return JSON.stringify({
        profile,
        periods,
        symptoms,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      }, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return '';
    }
  }

  /**
   * Import data from backup
   */
  static importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.profile) {
        this.saveUserProfile(parsed.profile);
      }
      if (parsed.periods) {
        this.savePeriods(parsed.periods);
      }
      if (parsed.symptoms) {
        this.saveSymptoms(parsed.symptoms);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Get storage usage info
   */
  static getStorageInfo(): {
    used: number;
    available: number;
    percentage: number;
  } {
    try {
      let used = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          used += item.length;
        }
      });

      // Estimate available space (most browsers have 5-10MB limit)
      const available = 5 * 1024 * 1024; // 5MB estimate
      const percentage = (used / available) * 100;

      return {
        used,
        available,
        percentage: Math.min(percentage, 100),
      };
    } catch (error) {
      return {
        used: 0,
        available: 0,
        percentage: 0,
      };
    }
  }
}

