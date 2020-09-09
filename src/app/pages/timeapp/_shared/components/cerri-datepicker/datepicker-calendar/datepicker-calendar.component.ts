import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment_ from 'moment';
import { Moment } from 'moment';

const moment = moment_;

@Component({
    selector: 'cerri-datepicker-calendar',
    templateUrl: './datepicker-calendar.component.html',
    styleUrls: ['./datepicker-calendar.component.scss'],
})
export class CerriDatepickerCalendarComponent implements OnInit {

    @Input() locale: string = 'en';
    @Input() canChangeNavMonthLogic: any;
    @Input() isAvailableLogic: any;
    @Input() selectWeekMode = true;
    @Input() initialDate: Date;
    @Input() maxDate;
    @Output() emitSelectedDate = new EventEmitter<any>();

    @Input() get date(): Date {
        return this.selectedDate.toDate();
    }

    set date(val: Date) {
        this.selectedDate = moment(val);
    }

    navDate: any;
    weekDaysHeaderArr: Array<string> = [];
    gridArr: Array<any> = [];
    selectedDate: Moment;
    today = new Date();
    viewMode: 'month' | 'year' | 'yearRange' = 'month';

    monthsArr: any[] = [];

    // weekStart = 'sunday';
    weekStart = 'monday';

    constructor() {
    }

    ngOnInit() {
        moment.locale('en', {
            week: {
                dow: 1,
            } as any,
        });
        this.navDate = moment();
        this.monthsArr = moment.months().map((month, index) => {
            const clonedDate = moment(this.navDate);
            clonedDate.set('month', index);

            return {
                value: month,
                date: clonedDate,
            };
        });

        this.makeHeader();
        this.makeGrid();
        this.selectedDate = moment(this.initialDate);
    }

    getNavTitle() {
        switch (this.viewMode) {
            case 'month':
                return this.navDate.format('MMMM YYYY');
            case 'year':
                return this.navDate.format('YYYY');
            case 'yearRange':
                return this.navDate.format('MMMM YYYY');
            default:
                return this.navDate.format('MMMM YYYY');
        }
    }

    changeNavMode() {
        if (this.viewMode === 'month') {
            return this.viewMode = 'year';
        } else {
            return this.viewMode = 'month';
        }
    }

    changeNavMonth(num: number) {
        if (this.canChangeNavMonth(num)) {
            this.navDate.add(num, 'month');
            this.makeGrid();
        }
    }

    canChangeNavMonth(num: number) {
        if (this.canChangeNavMonthLogic) {
            const clonedDate = moment(this.navDate);
            return this.canChangeNavMonthLogic( clonedDate, num);
        } else {
            return true;
        }
    }

    makeHeader() {
        const weekDaysArr: Array<number> = this.weekStart === 'sunday' ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 7];
        weekDaysArr.forEach(day => this.weekDaysHeaderArr.push(moment().isoWeekday(day).format('ddd')));
    }

    makeGrid() {
        if (this.weekStart === 'sunday') {
            this.gridArr = [];

            const firstDayDate = moment(this.navDate).startOf('month');
            const initialEmptyCells = firstDayDate.weekday();
            const lastDayDate = moment(this.navDate).endOf('month');
            const lastEmptyCells = 6 - lastDayDate.weekday();

            const begin = moment(firstDayDate).utc().startOf('week');

            const daysInMonth = this.navDate.daysInMonth();
            const arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth;

            for (let i = 0; i < arrayLength; i++) {
                const obj: any = {};
                if (i > initialEmptyCells + daysInMonth - 1) {
                    const clonedDate = moment(this.navDate);
                    clonedDate.add(1, 'month');
                    obj.date = this.dateFromNum(i - initialEmptyCells - daysInMonth + 1, clonedDate);
                    obj.value = i - initialEmptyCells - daysInMonth + 1;
                    obj.available = false;
                    // obj.available = this.isAvailable(i - initialEmptyCells - daysInMonth + 1, clonedDate);
                } else if (i < initialEmptyCells) {
                    const clonedDate = moment(this.navDate);
                    clonedDate.add(-1, 'month');

                    obj.date = this.dateFromNum(moment(begin).date() + i, clonedDate);
                    obj.value = moment(begin).date() + i;
                    obj.available = false;
                    // obj.available = this.isAvailable(moment(begin).date() + i, clonedDate);
                } else {
                    obj.value = i - initialEmptyCells + 1;
                    obj.date = this.dateFromNum(i - initialEmptyCells + 1, this.navDate);
                    obj.available = this.isAvailable(i - initialEmptyCells + 1);
                }
                this.gridArr.push(obj);
            }
        } else {
            this.makeISOGrid();
        }
    }

    makeISOGrid() {
        this.gridArr = [];

        const firstDayDate = moment(this.navDate).startOf('month');
        const initialEmptyCells = firstDayDate.weekday();
        const lastDayDate = moment(this.navDate).endOf('month');
        const lastEmptyCells = 7 - lastDayDate.isoWeekday();

        const begin = moment(firstDayDate).utc().startOf('week');

        const daysInMonth = this.navDate.daysInMonth();
        const arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth;

        for (let i = 0; i < arrayLength; i++) {
            const obj: any = {};
            if (i > initialEmptyCells + daysInMonth - 1) {
                const clonedDate = moment(this.navDate);
                clonedDate.add(1, 'month');

                obj.date = this.dateFromNum(i - initialEmptyCells - daysInMonth + 1, clonedDate);
                obj.value = i - initialEmptyCells - daysInMonth + 1;
                obj.available = false;
                // obj.available = this.isAvailable(i - initialEmptyCells - daysInMonth + 1, clonedDate);
            } else if (i < initialEmptyCells) {
                const clonedDate = moment(this.navDate);
                clonedDate.add(-1, 'month');

                obj.date = this.dateFromNum(moment(begin).date() + i, clonedDate);
                obj.value = moment(begin).date() + i;
                obj.available = false;
                // obj.available = this.isAvailable(moment(begin).date() + i, clonedDate);
            } else {
                obj.value = i - initialEmptyCells + 1;
                obj.date = this.dateFromNum(i - initialEmptyCells + 1, this.navDate);
                obj.available = this.isAvailable(i - initialEmptyCells + 1);
            }
            this.gridArr.push(obj);
        }
    }

    isAvailable(num: number, date?: any): boolean {
        if (this.isAvailableLogic) {
            const dateToCheck = this.dateFromNum(num, date || this.navDate);
            return this.isAvailableLogic(dateToCheck);
        } else {
            return true;
        }
    }

    dateFromNum(num: number, referenceDate: any): any {
        const returnDate = moment(referenceDate);
        return returnDate.date(num);
    }

    isToday(day) {
        if (!day.date) {
            return false;
        }

        const today = moment(this.today);

        return today.isSame(day.date, 'day');
    }

    isSelectedMonth(month) {
        if (!this.selectedDate || !month) {
            return false;
        }

        return this.selectedDate.isSame(month.date, 'month');
    }

    isSelected(day) {
        if (!this.selectedDate || !day.date) {
            return false;
        }

        if (this.selectWeekMode) {
            return this.selectedDate.isSame(day.date, 'week');
        }

        return day.date.isSame(this.selectedDate, 'day');
    }

    selectDay(day: any) {
        if (day.available) {
            this.selectedDate = this.dateFromNum(day.value, this.navDate);
            this.emitSelectedDate.emit(this.selectedDate);
        }
    }

    selectMonth(month: string) {
        this.navDate.set('month', this.monthsArr.indexOf(month));
        this.viewMode = 'month';
        this.makeGrid();
    }

    isAfterMaxDay(day) {
        if (this.maxDate) {
            return moment(day.date).isAfter(this.maxDate);
        }
    }

    isNextMonth() {
        if (this.selectedDate) {
            console.log(this.selectedDate);
            return this.selectedDate.isAfter(this.selectedDate, 'month');

        }

    }
}
