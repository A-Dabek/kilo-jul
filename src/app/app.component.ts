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
import {MainComponent} from "../main/main.view";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, ReactiveFormsModule, NgStyle, MainComponent],
  template: `
    <main class="container">
      <app-main/>
    </main>
  `,
})
export class AppComponent {
}
