import {AsyncPipe, NgStyle} from "@angular/common";
import {ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild} from "@angular/core";
import {collection, collectionData, doc, Firestore, updateDoc} from "@angular/fire/firestore";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {map, Observable, tap} from "rxjs";
import {WaterProgressComponent} from "./water-progress.component";

interface WaterItem {
  timestamp: number;
  goal: number;
  progress: number;
}

interface Id {
  id: string;
}

type WaterItemId = WaterItem & Id;

@Component({
  selector: "app-water-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgStyle,
    WaterProgressComponent
  ],
  template:
    `
      <div class="card w-100">
        <div class="card-body">
          @if (waterItem$ | async; as waterItem) {
            <div class="card-title d-flex justify-content-between">
              <h1 class="mb-0">Woda</h1>
              <div>
                <button class="btn btn-dark btn-sm px-1 py-0 my-0" (click)="onReset(waterItem.id)">
                  <i class="fas fa-arrows-rotate fa-xs"></i>
                </button>
              </div>
            </div>
            <h6 class="card-subtitle mb-2 text-muted">{{ timePassed$ | async }}</h6>


            <div class="d-flex align-items-center justify-content-between">
              <div>
                <button
                  class="btn btn-dark btn-sm me-2"
                  (click)="onProgress(waterItem.id, waterItem.progress + 250)"
                >
                  <i class="fas fa-glass-water"></i>
                  250ml
                </button>
                <button
                  class="btn btn-dark btn-sm"
                  (click)="onProgress(waterItem.id, waterItem.progress + 1000)"
                >
                  <i class="fas fa-bottle-water"></i>
                  1l
                </button>
              </div>
              <app-water-progress [progress]="waterItem.progress" [goal]="waterItem.goal"/>

            </div>

            <div class="text-center">
              <input
                (change)="onLimitChange(waterItem.id)"
                [formControl]="goalControl"
                class="form-range"
                type="range"
                min="1000"
                max="5000"
                step="100"
              />
              <div>{{ waterItem.progress }}/{{ waterItem.goal }} ml</div>
            </div>
          }
        </div>
      </div>
    `
})
export class WaterCardComponent {

  private readonly firestore: Firestore = inject(Firestore);
  private waterCollection = collection(this.firestore, 'water');
  readonly waterItem$ = (
    collectionData(this.waterCollection, {
      idField: 'id',
    }) as Observable<WaterItemId[]>
  ).pipe(
    map((items) => items[0]),
    tap((item: WaterItemId) => this.goalControl.setValue(item.goal))
  );

  readonly timePassed$ = this.waterItem$.pipe(
    map(({progress}) => {
      const now = new Date().getTime();
      const daysPassed = (progress - now) / 1000 / 60 / 60 / 24;
      if (daysPassed < 1) return 'Dzisiaj';
      if (daysPassed < 2) return 'Wczoraj';
      if (daysPassed < 3) return 'Przedwczoraj';
      return `${Math.floor(daysPassed)} dni temu`;
    })
  );

  readonly goalControl = new FormControl(0);

  onReset(id: string) {
    const timestamp = new Date().getTime();
    updateDoc(doc(this.waterCollection, id), {timestamp, progress: 0});
  }

  onLimitChange(id: string) {
    const goal = this.goalControl.value;
    updateDoc(doc(this.waterCollection, id), {goal});
  }

  onProgress(id: string, amount: number) {
    updateDoc(doc(this.waterCollection, id), {progress: amount});
  }
}
