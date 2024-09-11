import {ChangeDetectionStrategy, Component} from "@angular/core";
import {FoodCardComponent} from "../food/food-card.component";
import {WaterCardComponent} from "../water/water-card.component";
import {WorkoutCardComponent} from "../workout/workout-card.component";

@Component({
  selector: "app-main",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FoodCardComponent,
    WaterCardComponent,
    WorkoutCardComponent
  ],
  template:
    `
      <app-water-card/>
      <app-food-card/>
      <app-workout-card/>
    `,
  host: {
    class: 'd-flex flex-column gap-1'
  }
}) export class MainComponent {

}
