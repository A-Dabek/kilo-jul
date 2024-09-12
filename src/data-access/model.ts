export interface Id {
  id: string;
}

export interface HistoryEntry {
  timestamp: number;
  amount: number;
}

export interface WaterHistory extends HistoryEntry {
}

export interface WaterState extends HistoryEntry {
  goal: number;
  history: (WaterHistory & Id)[];
}

export interface FoodHistory extends HistoryEntry {
  name: string;
}

export interface FoodState extends FoodHistory {
  history: (FoodHistory & Id)[];
}

export interface WorkoutHistory extends HistoryEntry {
  name: string;
}

export interface WorkoutState extends WorkoutHistory {
  history: (WorkoutHistory & Id)[];
}
