import {ChangeDetectionStrategy, Component} from "@angular/core";
import {FoodCardComponent} from "../food/food-card.component";
import {WaterCardComponent} from "../water/water-card.component";

@Component({
  selector: "app-main",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FoodCardComponent,
    WaterCardComponent
  ],
  template:
    `
      <app-water-card/>
    `
}) export class MainComponent {

}
