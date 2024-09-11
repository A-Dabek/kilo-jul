import {NgStyle} from "@angular/common";
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild
} from "@angular/core";

@Component({
  selector: "app-water-progress",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgStyle
  ],
  template:
    `
      <div class="position-relative">
        <div class="position-relative" #originalElement>
          <i
            class="fa-solid fa-person-dress text-primary"
            style="height: 50px;"
          >
          </i>
        </div>
        <div
          class="position-absolute"
          [ngStyle]="{ 'max-height': progressMaxHeight() + 'px' }"
          style="overflow: hidden; left: 0; right: 0; margin: auto; top: 0"
        >
          <i class="fa-solid fa-person-dress" style="height: 50px;"></i>
        </div>
      </div>
    `
})
export class WaterProgressComponent implements AfterContentChecked {
  progress = input(0);
  goal = input(0);

  readonly drunkElement = viewChild<ElementRef>('originalElement');
  private readonly drunkElementHeight = signal(0);

  readonly progressMaxHeight = computed(() => {
    if (this.progress() >= this.goal()) {
      return 0;
    }

    const percentProgress = 1.0 - this.progress() / this.goal();
    return Math.floor(
      percentProgress * this.drunkElementHeight()
    );
  });

  ngAfterContentChecked() {
    this.drunkElementHeight.set(this.drunkElement()?.nativeElement.offsetHeight);
  }
}
