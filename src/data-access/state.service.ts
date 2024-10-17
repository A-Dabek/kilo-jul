import {inject, Injectable} from "@angular/core";
import {addDoc, collection, collectionData, doc, docData, Firestore, updateDoc} from "@angular/fire/firestore";
import {map, Observable, take} from "rxjs";
import {FoodState, HistoryEntry, WaterHistory, WaterState, WorkoutState} from "./model";

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

  resetWhnOutDated(resource: 'water' | 'food' | 'workout') {
    docData(doc(this.collection, resource)).pipe(take(1)).subscribe((item: HistoryEntry) => {
        const today = new Date();
        const dateOfState = new Date();
        dateOfState.setTime(item.timestamp);
        if (today.getDate() !== dateOfState.getDate()) {
          console.log('reset', resource, item);
          this.reset(resource);
        }
      }
    );
  }

  private reset(resource: 'water' | 'food' | 'workout') {
    updateDoc(doc(this.collection, resource), {amount: 0, timestamp: this.timestamp});
  }

  onWaterGoalChange(goal: number) {
    updateDoc(this.waterDoc, {goal});
  }

  onWaterProgress(current: number, increment: number) {
    updateDoc(doc(this.collection, 'water'), {amount: current + increment, timestamp: this.timestamp});
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
    updateDoc(doc(this.collection, collectionName), {name, amount, timestamp: this.timestamp});
    addDoc(collection(this.collection, collectionName, 'history'), {
      amount: 1,
      name,
      timestamp: this.timestamp,
    });
  }

  private squashHistoryFromSameDayAndAddAmounts() {
    this.waterHistoryCollection$.pipe(
      map(history => {
        const historyByDay = new Map<number, HistoryEntry[]>();
        history.forEach(entry => {
          const miliseconds = entry.timestamp;
          const date = new Date(miliseconds).setHours(0, 0, 0, 0);
          if (historyByDay.has(date)) {
            historyByDay.get(date)?.push(entry);
          } else {
            historyByDay.set(date, [entry]);
          }
          return Array.from(historyByDay.values()).map(entries => {
            const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
            return {
              ...entries[0],
              amount: totalAmount
            };
          });
        })
      }));
  }
}


