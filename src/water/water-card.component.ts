import {AsyncPipe, NgStyle} from "@angular/common";
import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {tap} from "rxjs";
import {WaterState} from "../data-access/model";
import {StateService} from "../data-access/state.service";
import {WaterProgressComponent} from "./water-progress.component";


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
          @if (waterState$ | async; as state) {
            <h1 class="card-title d-flex justify-content-between">
              Woda
            </h1>
            <h6 class="card-subtitle mb-2 text-muted">Wypito {{state.amount}}/{{ state.goal }} ml </h6>

            <div class="d-flex align-items-center justify-content-between">
              <div>
                <button
                  class="btn btn-dark btn-sm me-2"
                  (click)="onProgress(state.amount + 250)"
                >
                  <i class="fas fa-glass-water"></i>
                  250ml
                </button>
                <button
                  class="btn btn-dark btn-sm"
                  (click)="onProgress(state.amount + 1000)"
                >
                  <i class="fas fa-bottle-water"></i>
                  1l
                </button>
              </div>
              <app-water-progress [progress]="state.amount" [goal]="state.goal"/>
            </div>

            <input
              (change)="onLimitChange()"
              [formControl]="goalControl"
              class="form-range"
              type="range"
              min="1000"
              max="5000"
              step="100"
            />
          }
        </div>
      </div>
    `
})
export class WaterCardComponent {

  private readonly stateService = inject(StateService);
  readonly waterState$ = this.stateService.waterState$.pipe(
    tap((item: WaterState) => this.goalControl.setValue(item.goal))
  );

  readonly goalControl = new FormControl(0, {nonNullable: true});

  onLimitChange() {
    const goal = this.goalControl.value;
    this.stateService.onWaterGoalChange(goal);
  }

  onProgress(amount: number) {
    this.stateService.onWaterProgress(amount);
  }
}
