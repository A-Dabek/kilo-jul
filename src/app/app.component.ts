import { AsyncPipe, NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

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
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, ReactiveFormsModule, NgStyle],
  template: `
    <div class="container text-center">
      @if (waterItem$ | async; as waterItem) {
      <div class="row">
        <h1 class="col">{{ timePassed$ | async }}</h1>
        <div class="col">
          <button class="btn btn-dark " (click)="onReset(waterItem.id)">
            <i class="fas fa-arrows-rotate"></i>
            Reset
          </button>
        </div>
      </div>

      <div class="row">
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

        <div class="position-relative">
          <div class="position-relative" #originalElement>
            <i
              class="fa-solid fa-person-dress text-primary"
              style="height: 500px;"
            >
            </i>
          </div>
          <div
            class="position-absolute"
            [ngStyle]="{ 'max-height': progressMaxHeight() + 'px' }"
            style="overflow: hidden; left: 0; right: 0; margin: auto; top: 0"
          >
            <i class="fa-solid fa-person-dress" style="height: 500px;"></i>
          </div>
        </div>
      </div>

      <div class="row">
        <button
          class="col btn btn-dark"
          (click)="onProgress(waterItem.id, waterItem.progress + 250)"
        >
          <i class="fas fa-glass-water"></i>
          250 ml
        </button>
        <button
          class="col btn btn-dark"
          (click)="onProgress(waterItem.id, waterItem.progress + 1000)"
        >
          <i class="fas fa-bottle-water"></i>
          1 l
        </button>
      </div>
      }
    </div>
  `,
})
export class AppComponent {
  private readonly firestore: Firestore = inject(Firestore);
  private waterCollection = collection(this.firestore, 'water');
  readonly waterItem$ = (
    collectionData(this.waterCollection, {
      idField: 'id',
    }) as Observable<WaterItemId[]>
  ).pipe(
    map((items) => items[0]),
    tap((item: WaterItemId) => this.goalControl.setValue(item.goal)),
    tap((item) => this.calculateProgress(item.progress, item.goal))
  );

  readonly timePassed$ = this.waterItem$.pipe(
    map(({ progress }) => {
      const now = new Date().getTime();
      const daysPassed = (progress - now) / 1000 / 60 / 60 / 24;
      if (daysPassed < 1) return 'Dzisiaj';
      if (daysPassed < 2) return 'Wczoraj';
      if (daysPassed < 3) return 'Przedwczoraj';
      return `${Math.floor(daysPassed)} dni temu`;
    })
  );

  readonly goalControl = new FormControl(0);

  readonly progressMaxHeight = signal(0);

  readonly drunkElement = viewChild<ElementRef>('originalElement');

  onReset(id: string) {
    const timestamp = new Date().getTime();
    updateDoc(doc(this.waterCollection, id), { timestamp, progress: 0 });
  }

  onLimitChange(id: string) {
    const goal = this.goalControl.value;
    updateDoc(doc(this.waterCollection, id), { goal });
  }

  calculateProgress(progress: number, goal: number) {
    if (progress >= goal) {
      this.progressMaxHeight.set(0);
      return;
    }

    const nativeElement = this.drunkElement()?.nativeElement as HTMLDivElement;
    if (!nativeElement) return;

    const percentProgress = 1.0 - progress / goal;
    const desiredHeight = Math.floor(
      percentProgress * nativeElement.offsetHeight
    );
    this.progressMaxHeight.set(desiredHeight);
  }

  onProgress(id: string, amount: number) {
    updateDoc(doc(this.waterCollection, id), { progress: amount });
  }
}
