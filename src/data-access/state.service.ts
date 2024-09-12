import {inject, Injectable} from "@angular/core";
import {addDoc, collection, doc, docData, Firestore, setDoc, updateDoc} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {FoodHistory, FoodState, HistoryEntry, WaterState, WorkoutHistory, WorkoutState} from "./model";

@Injectable({providedIn: 'root'})
export class StateService {
  private readonly firestore: Firestore = inject(Firestore);
  private collection = collection(this.firestore, 'state');

  waterState$ = docData(this.waterDoc, {idField: 'id'}) as Observable<WaterState>;
  foodState$ = docData(this.foodDoc, {idField: 'id'}) as Observable<FoodState>;
  workoutState$ = docData(this.workoutDoc, {idField: 'id'}) as Observable<WorkoutState>;

  private get waterDoc() {
    return doc(this.collection, 'water');
  }

  private get foodDoc() {
    return doc(this.collection, 'food');
  }

  private get workoutDoc() {
    return doc(this.collection, 'workout');
  }

  private get timestamp() {
    return new Date().getTime();
  }

  onWaterGoalChange(goal: number) {
    updateDoc(this.waterDoc, {goal});
  }

  onWaterProgress(amount: number) {
    updateDoc(this.waterDoc, {amount});
  }

  onFoodEaten(name: string, amount: number) {
    updateDoc(this.foodDoc, {name, amount});
    addDoc(collection(this.collection, 'food', 'history'), {
      amount: 1,
      name,
      timestamp: this.timestamp
    } satisfies FoodHistory)
  }

  onWorkoutDone(name: string, amount: number) {
    updateDoc(this.workoutDoc, {name, amount});
    addDoc(collection(this.collection, 'workout', 'history'), {
      amount: 1,
      name,
      timestamp: this.timestamp
    } satisfies WorkoutHistory)
  }
}
