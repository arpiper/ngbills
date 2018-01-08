import { Component, OnInit, Input, Output, ElementRef, ViewChild, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'date-picker',
  template: `
    <div class="date-picker-container">
      <input 
        autocomplete="off"
        #datePicker 
        class="date-picker" 
        [ngClass]="extraClass"
        name="name"
        type="text" 
        (focus)="showCalendar()"
        [value]="today.toLocaleDateString()">
      <div class="date-picker-calendar" *ngIf="show" [ngStyle]="position">
        <div class="date-picker-header">
          <span class="date-picker-prev" (mousedown)="prevMonth(month.index - 1)"><</span>
          <span>{{ month.name }}</span>
          <span class="date-picker-next" (mousedown)="nextMonth(month.index + 1)">></span>
        </div>
        <div 
          *ngFor="let d of days"
          class="date-picker-day" 
          [ngStyle]="setDayStyles(d)"
          [ngClass]="d.classes"
          (mousedown)="chooseDate($event, d)">
          {{ d.date.getDate() }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .date-picker-container,
    .date-picker-calendar,
    .date-picker-header,
    .date-picker-day,
    .date-picker-next,
    .date-picker-prev {
      box-sizing: border-box;
    }
    .date-picker-container {
      position: relative;
    }
    .date-picker {
      width: 100%;
    }
    .date-picker-calendar {
      position: absolute;
      left: 0;
      z-index: 100;
      background-color: #ddd;
      width: 100%;
      height: auto;
    }
    .date-picker-header,
    .date-picker-day {
      text-align: center;
      background-color: #ddd;
      height: 20px;
      padding: 2px;
    }
    .date-picker-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .date-picker-day {
      position: absolute;
      width: 14.28%;
    }
    .date-picker-day.extra {
      color: #888;
    }
    .date-picker-day.today {
      color: #a33;
    }
    .date-picker-next,
    .date-picker-prev {
      width: 10%;
    }
    .date-picker-day:hover,
    .date-picker-next:hover,
    .date-picker-prev:hover {
      cursor: pointer;
      background-color: rgba(76, 175, 80, 1);
    }
  `],
})

export class DatePicker implements OnInit {
  today: Date;
  days: Date[];
  month: object = {name: '', index: 0};
  position: object = {};
  names: string[] = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  show: boolean = false;

  @Input() extraClass: string;
  @Input() name: string;
  @ViewChild('datePicker') private datePickerInput: ElementRef;
  @Output() datePicked: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.today = new Date();
    this.days = this.getMonthArray(this.today);
    this.month = {
      name: this.names[this.today.getUTCMonth()],
      index: this.today.getUTCMonth(), 
    };
    this.position = {
      top: `${this.datePickerInput.nativeElement.offsetHeight}px`,
      width: `${this.datePickerInput.nativeElement.offsetWidth}px`
    };
  }

  showCalendar(): void {
    this.show = true;
  }

  hideCalendar(evt): void {
    this.show = false;
  }

  setDayStyles(d): object {
    let styles = {
      left: `${(100 / 7) * d.date.getDay()}%`,
      top: `${d.rowValue * 20}px`,
    };
    return styles;
  }

  chooseDate(evt, d): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.datePickerInput.nativeElement.value = d.date.toLocaleDateString();
    this.datePicked.emit(d.date);
    this.hideCalendar(evt);
  }

  nextMonth(month_index): void {
    let d = new Date(this.today.getUTCFullYear(), month_index, 1);
    this.days = this.getMonthArray(d);
    this.month = {
      name: this.names[d.getUTCMonth()],
      index: month_index,
    };
  }

  prevMonth(month_index): void {
    let d = new Date(this.today.getUTCFullYear(), month_index, 1);
    this.days = this.getMonthArray(d);
    this.month = {
      name: this.names[d.getUTCMonth()],
      index: month_index,
    };
  }

  getMonthArray(d: Date): Date[] {
    let l = new Date(d.getUTCFullYear(), d.getUTCMonth() + 1, 0);
    let s = new Date(d.getUTCFullYear(), d.getUTCMonth(), 1);
    let lastRow = 1;
    let a = [];
    if (s.getDay() !== 0) {
      for (let i = 1; i <= s.getDay(); i++) {
        a.push({
          date: new Date(s.getUTCFullYear(), s.getUTCMonth(), i - s.getDay()), 
          rowValue: lastRow,
          classes: 'extra',
        });
      }
    }
    let m = Array(l.getDate())
      .fill(1,0,l.getDate())
      .map(
        (v,i) => {
          let day = new Date(d.getUTCFullYear(), d.getUTCMonth(), i + 1);
          lastRow = Math.abs(Math.floor((day.getDay() - day.getDate()) / 7)) + 1;
          if (day.toDateString() === this.today.toDateString()) {
            return {date: day, rowValue: lastRow, classes: 'today'};
          }
          return {date: day, rowValue: lastRow, classes: ''};
        }
      );
    let b = [];
    if (l.getDay() !== 6) {
      for (let i = 1; i < 7 - l.getDay(); i++) {
        b.push({
          date: new Date(l.getUTCFullYear(), l.getUTCMonth() + 1, i), 
          rowValue: lastRow,
          classes: 'extra',
        });
      }
    }
    return a.concat(m, b);
  }
}
