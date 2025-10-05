export interface PeriodData {
  id: string;
  startDate: Date;
  endDate: Date;
  cycleLength: number;
  symptoms: SymptomData[];
  bbt?: number; // Basal Body Temperature
  cervicalMucus?: CervicalMucusType;
  mood?: MoodType;
  energy?: EnergyLevel;
  pain?: PainLevel;
  flow?: FlowLevel;
}

export interface SymptomData {
  id: string;
  date: Date;
  type: SymptomType;
  severity: SeverityLevel;
  notes?: string;
}

export interface CyclePrediction {
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  ovulationDate: Date;
  fertileWindow: {
    start: Date;
    end: Date;
  };
  lutealPhase: number;
  cycleLength: number;
  confidence: number;
}

export interface UserProfile {
  id: string;
  averageCycleLength: number;
  averagePeriodLength: number;
  averageLutealPhase: number;
  lastPeriodStart?: Date;
  periods: PeriodData[];
  symptoms: SymptomData[];
}

export type SymptomType = 
  | 'cramps' 
  | 'headache' 
  | 'bloating' 
  | 'mood_swings' 
  | 'fatigue' 
  | 'breast_tenderness' 
  | 'acne' 
  | 'food_cravings' 
  | 'sleep_issues' 
  | 'nausea' 
  | 'back_pain' 
  | 'other';

export type CervicalMucusType = 
  | 'dry' 
  | 'sticky' 
  | 'creamy' 
  | 'watery' 
  | 'egg_white' 
  | 'none';

export type MoodType = 
  | 'happy' 
  | 'sad' 
  | 'anxious' 
  | 'irritable' 
  | 'calm' 
  | 'energetic' 
  | 'depressed' 
  | 'confident';

export type EnergyLevel = 
  | 'very_low' 
  | 'low' 
  | 'moderate' 
  | 'high' 
  | 'very_high';

export type PainLevel = 
  | 'none' 
  | 'mild' 
  | 'moderate' 
  | 'severe' 
  | 'very_severe';

export type FlowLevel = 
  | 'spotting' 
  | 'light' 
  | 'normal' 
  | 'heavy' 
  | 'very_heavy';

export type SeverityLevel = 
  | 'none' 
  | 'mild' 
  | 'moderate' 
  | 'severe';

export interface RewardData {
  id: string;
  type: 'daily_log' | 'cycle_complete' | 'symptom_log' | 'prediction_accuracy' | 'streak';
  amount: number; // VET tokens
  description: string;
  earned: boolean;
  earnedDate?: Date;
  icon: string;
}

