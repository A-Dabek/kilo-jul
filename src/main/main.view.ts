import {AsyncPipe, NgClass} from "@angular/common";
import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {StateService} from "../data-access/state.service";
import {FoodCardComponent} from "../food/food-card.component";
import {HistoryComponent} from "../history.component";
import {WaterCardComponent} from "../water/water-card.component";
import {WorkoutCardComponent} from "../workout/workout-card.component";

@Component({
  selector: "app-main",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FoodCardComponent,
    WaterCardComponent,
    WorkoutCardComponent,
    HistoryComponent,
    AsyncPipe,
    NgClass
  ],
  template:
    `
      <nav class="navbar navbar-expand navbar-light bg-light">
        <div class="container-fluid">
          <ul class="navbar-nav">
            <li class="nav-item">
              <span class="nav-link" [ngClass]="{active: showCardsSection}" (click)="showCards()">Dzisiaj</span>
            </li>
            <li class="nav-item">
              <span class="nav-link" [ngClass]="{active: !showCardsSection}" (click)="showHistory()">Historia</span>
            </li>
          </ul>
        </div>
      </nav>
      @if (showCardsSection) {
        <app-water-card/>
        <app-food-card/>
        <app-workout-card/>
      } @else {
        <app-history title="Woda" [entries]="(waterHistory$ | async) || []"/>
        <app-history title="Jedzenie" [entries]="(foodHistory$ | async) || []"/>
        <app-history title="Aktywność" [entries]="(workoutHistory$ | async) || []"/>
      }
    `,
  host: {
    class: 'd-flex flex-column gap-1'
  }
})
export class MainComponent implements OnInit {

  private stateService = inject(StateService);
  readonly foodHistory$ = this.stateService.foodHistoryCollection$;
  readonly workoutHistory$ = this.stateService.workoutHistoryCollection$;
  readonly waterHistory$ = this.stateService.waterHistoryCollection$;

  showCardsSection = true;

  ngOnInit() {
    this.stateService.resetWhnOutDated('water');
    this.stateService.resetWhnOutDated('workout');
    this.stateService.resetWhnOutDated('food');
  }

  showCards() {
    this.showCardsSection = true;
  }

  showHistory() {
    this.showCardsSection = false;
  }
}
