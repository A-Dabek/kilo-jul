import {NgForOf} from '@angular/common';
import {Component, computed, input, Input, OnInit} from '@angular/core';
import {HistoryEntry} from "./data-access/model";

@Component({
  selector: 'app-history',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-body">
        <h2 class="card-title">{{ title() }}</h2>
        <h6 class="card-subtitle mb-2 text-muted">
          Średnia: {{ avg() }} / tydzień
        </h6>
        <table class="table">
          <thead>
          <tr>
            <th scope="col">Mo</th>
            <th scope="col">Tu</th>
            <th scope="col">We</th>
            <th scope="col">Th</th>
            <th scope="col">Fr</th>
            <th scope="col">Sa</th>
            <th scope="col">Su</th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let week of weeks(); let i = index">
            <td>{{ week[0] }}</td>
            <td>{{ week[1] }}</td>
            <td>{{ week[2] }}</td>
            <td>{{ week[3] }}</td>
            <td>{{ week[4] }}</td>
            <td>{{ week[5] }}</td>
            <td>{{ week[6] }}</td>
            <td>{{ week[7] }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  imports: [
    NgForOf
  ]
})
export class HistoryComponent {
  title = input('');
  entries = input<HistoryEntry[]>([]);
  weeks = computed(() => this.organizeEntriesByWeek(this.entries()));
  avg = computed(() => this.weeks().flatMap(v => v).reduce((a, b) => (a + b) / 4).toFixed(2));

  private organizeEntriesByWeek(entries: HistoryEntry[]): number[][] {
    const now = new Date();
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(now.getDate() - 28);

    const weeks = Array(4).fill(undefined).map(() => Array(7).fill(0));

    entries.forEach(entry => {
      const entryDate = new Date(entry.timestamp);
      const entryDayOfTheWeek = (entryDate.getDate() - 1) % 7;
      const msInAWeek = 7 * 24 * 60 * 60 * 1000;
      const weeksAgo = Math.floor((now.getTime() - entryDate.getTime()) / msInAWeek);
      if (weeksAgo >= 4) return;
      weeks[3 - weeksAgo][entryDayOfTheWeek] += entry.amount;
    });

    return weeks.map(week => [
      ...week,
      week.reduce((acc, day) => acc + day, 0)
    ]);
  }
}
