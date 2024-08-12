import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  imports: [RouterOutlet, AsyncPipe, ReactiveFormsModule],
  template: `
    @if (waterItem$ | async; as waterItem) {
    <h1>{{ timePassed$ | async }}</h1>
    <button (click)="onReset(waterItem.id)">Reset</button>
    <div class="slidecontainer">
      <input
        (change)="onLimitChange(waterItem.id)"
        [formControl]="goalControl"
        type="range"
        min="1000"
        max="5000"
        step="100"
      />
    </div>
    <div>{{ waterItem.progress }}/{{ waterItem.goal }}</div>
    <button (click)="onProgress(waterItem.id, waterItem.progress + 250)">
      250 ml
    </button>
    <button (click)="onProgress(waterItem.id, waterItem.progress + 1000)">
      1 l
    </button>
    }
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
    tap((item: WaterItemId) => this.goalControl.setValue(item.goal))
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

  onReset(id: string) {
    const timestamp = new Date().getTime();
    updateDoc(doc(this.waterCollection, id), { timestamp, progress: 0 });
  }

  onLimitChange(id: string) {
    const goal = this.goalControl.value;
    updateDoc(doc(this.waterCollection, id), { goal });
  }

  onProgress(id: string, amount: number) {
    updateDoc(doc(this.waterCollection, id), { progress: amount });
  }
}
