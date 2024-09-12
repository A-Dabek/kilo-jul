import {inject, Injectable} from "@angular/core";
import {addDoc, collection, collectionData, doc, docData, Firestore, setDoc, updateDoc} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {FoodHistory, FoodState, HistoryEntry, WaterHistory, WaterState, WorkoutHistory, WorkoutState} from "./model";

@Injectable({providedIn: 'root'})
export class StateService {
  private readonly firestore: Firestore = inject(Firestore);
  private collection = collection(this.firestore, 'state');

  readonly waterState$ = docData(this.waterDoc, {idField: 'id'}) as Observable<WaterState>;
  readonly foodState$ = docData(this.foodDoc, {idField: 'id'}) as Observable<FoodState>;
  readonly workoutState$ = docData(this.workoutDoc, {idField: 'id'}) as Observable<WorkoutState>;

  readonly waterHistoryCollection$ = collectionData(collection(this.waterDoc, 'history')) as Observable<HistoryEntry[]>;
  readonly foodHistoryCollection$ = collectionData(collection(this.foodDoc, 'history')) as Observable<HistoryEntry[]>;
  readonly workoutHistoryCollection$ = collectionData(collection(this.workoutDoc, 'history')) as Observable<HistoryEntry[]>;

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

  onWaterProgress(current: number, increment: number) {
    updateDoc(doc(this.collection, 'water'), {amount: current + increment});
    addDoc(collection(this.collection, 'water', 'history'), {
      amount: increment,
      timestamp: this.timestamp,
    } satisfies WaterHistory);
  }

  onFoodEaten(name: string, amount: number) {
    this.logHistory('food', name, amount);
  }

  onWorkoutDone(name: string, amount: number) {
    this.logHistory('workout', name, amount);
  }

  private logHistory(collectionName: string, name: string, amount: number) {
    updateDoc(doc(this.collection, collectionName), {name, amount});
    addDoc(collection(this.collection, collectionName, 'history'), {
      amount: 1,
      name,
      timestamp: this.timestamp,
    });
  }
}


