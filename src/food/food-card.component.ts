import {AsyncPipe} from "@angular/common";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {WaterProgressComponent} from "../water/water-progress.component";


@Component({
  selector: "app-food-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    WaterProgressComponent
  ],
  template:
    `
      <div class="card w-100">
        <div class="card-body">
          <div class="card-title d-flex justify-content-between">
            <h1 class="mb-0">Posiłki</h1>
          </div>
          <h6 class="card-subtitle mb-2 text-muted">TBD</h6>
        </div>
      </div>
    `
})
export class FoodCardComponent {

}
