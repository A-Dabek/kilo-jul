import {AsyncPipe, NgStyle} from "@angular/common";
import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StateService} from "../data-access/state.service";


@Component({
  selector: "app-workout-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgStyle,
    FormsModule
  ],
  template:
    `
      <div class="card w-100">
        <div class="card-body">
          @if (state$ | async; as state) {
            <h1 class="card-title d-flex justify-content-between">
              Jedzenie
            </h1>
            <h6 class="card-subtitle mb-2 text-muted">Zjedzone posiłki: {{ state.amount }}
              @if (state.name) {
                ostatni: {{ state.name }}
              }
            </h6>
            <form class="d-flex gap-1" (ngSubmit)="onSubmitWorkout(state.amount)">
              <input type="email" class="form-control" placeholder="Posiłek" [formControl]="nameControl">
              <button type="submit" class="btn btn-primary">
                <i class="bi-check"></i>
              </button>
            </form>
          }
        </div>
      </div>
    `
})
export class WorkoutCardComponent {

  private readonly stateService = inject(StateService);
  readonly state$ = this.stateService.workoutState$;

  readonly nameControl = new FormControl('', {nonNullable: true});

  onSubmitWorkout(currentAmount: number) {
    const name = this.nameControl.value;
    this.stateService.onWorkoutDone(name, currentAmount + 1);
    this.nameControl.reset();
  }
}
