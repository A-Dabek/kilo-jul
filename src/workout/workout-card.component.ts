import {ChangeDetectionStrategy, Component} from "@angular/core";


@Component({
  selector: "app-workout-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
  ],
  template:
    `
      <div class="card w-100">
        <div class="card-body">
          <div class="card-title d-flex justify-content-between">
            <h1 class="mb-0">Aktywność</h1>
          </div>
          <h6 class="card-subtitle mb-2 text-muted">TBD</h6>
        </div>
      </div>
    `
})
export class WorkoutCardComponent {

}
