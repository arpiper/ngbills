import { Component, OnInit, Input, Output, ElementRef, ViewChild, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'date-picker',
  template: `
    <div class="date-picker-container">
      <input 
        #datePicker 
        class="date-picker" 
        [ngClass]="classes"
        type="text" 
        (focus)="showCalendar()" 
        (focusout)="hideCalendar()">
      <div class="date-picker-calendar" *ngIf="show" [ngStyle]="position">
        <div class="date-picker-header">{{ month }}</div>
        <div 
          *ngFor="let d of days"
          class="date-picker-day" 
          [ngStyle]="setDayStyles(d)"
          (click)="chooseDate(d)">
          {{ d.date.getDate() }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .date-picker-container,
    .date-picker-calendar,
    .date-picker-header,
    .date-picker-day {
      box-sizing: border-box;
    }
    .date-picker-container {
      position: relative;
    }
    .date-picker-calendar {
      position: absolute;
      left: 0;
      z-index: 100;
      background-color: #ddd;
      width: 100%;
      height: auto;
    }
    .date-picker-header {
      width: 100%;
      text-align: center;
    }
    .date-picker-day {
      position: absolute;
      width: 14.28%;
      height: 20px;
      text-align: center;
      background-color: #ddd;
    }
  `],
})

export class DatePicker implements OnInit {
  private today: Date;
  private days: Date[];
  private month: string;
  private position: object = {};
  private names: string[] = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  private show: boolean = false;
  @Input() classes: string;
  @ViewChild('datePicker') private datePickerInput: ElementRef;
  @Output() datePicked: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.today = new Date();
    this.days = this.getMonthArray(this.today);
    console.log(this.days);
    this.month = this.names[this.today.getUTCMonth()];
    this.position = {
      top: `${this.datePickerInput.nativeElement.offsetHeight}px`,
      width: `${this.datePickerInput.nativeElement.offsetWidth}px`
    };
  }

  showCalendar(): void {
    console.log("show Calendar");
    console.log(this.datePickerInput);
    this.show = true;
  }

  hideCalendar(): void {
    console.log("hide calendar");
    // this.show = false;
  }

  setDayStyles(d): object {
    let styles = {
      left: `${(100 / 7) * d.date.getDay()}%`,
      top: `${d.rowValue * 20}px`,
    };
    return styles;
  }

  chooseDate(d: Date): void {
    this.datePickerInput.nativeElement.value = d.date.toLocaleDateString();
    this.hideCalendar();
    this.datePicked.emit(d);
  }

  getMonthArray(d: Date): Date[] {
    let l = new Date(d.getUTCFullYear(), d.getUTCMonth() + 1, 0);
    let s = new Date(d.getUTCFullYear(), d.getUTCMonth(), 1);
    let a = [];
    if (s.getDay() !== 0) {
      for (let i = 1; i <= s.getDay(); i++) {
        a.push({date: new Date(s.getUTCFullYear(), s.getUTCMonth(), i - s.getDay()), rowValue: 1});
      }
    }
    let lastRow = 0;
    let m = Array(l.getDate())
      .fill(1,0,l.getDate())
      .map(
        (v,i) => {
          let day = new Date(d.getUTCFullYear(), d.getUTCMonth(), i + 1);
          lastRow = Math.floor(((day.getDate() - day.getDay()) / 7) + 2);
          return {date: day, rowValue: lastRow};
        }
      );
    let b = [];
    if (l.getDay() !== 6) {
      for (let i = 1; i < 7 - l.getDay(); i++) {
        b.push({date: new Date(l.getUTCFullYear(), l.getUTCMonth() + 1, i), rowValue: lastRow});
      }
    }
    return a.concat(m, b);
  }
}
