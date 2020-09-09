import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment_ from 'moment';

const moment = moment_;

type DateFormatFunction = (date: Date) => string;

function getMonday(d) {
    d = new Date(d);
    const day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

@Component({
    selector: 'cerri-datepicker',
    templateUrl: './cerri-datepicker.component.html',
    styleUrls: ['./cerri-datepicker.component.scss'],
})
export class AppCerriDatepickerComponent implements OnInit {
    private readonly DEFAULT_FORMAT = 'ddd, MMM YY';
    private inputText = '';
    selectedDate: Date;

    @Input() maxDate;
    @Input() canNavigateMonth;

    @Input() get date(): Date {
        return this.selectedDate;
    }

    set date(val: Date) {
        this.selectedDate = val;
        this.setInputText(this.selectedDate);
    }

    @Input() disabled: boolean;
    @Input() dateFormat: string | DateFormatFunction;
    @Input() placeholder = 'Select a date';
    @Input() selectWeekMode = false;

    @Output() dateChange = new EventEmitter<Date>();

    constructor() {
    }

    ngOnInit() {
        this.selectedDate = new Date();
        this.setInputText(this.selectedDate);
    }

    onSelectDay(value: any) {
        this.selectedDate = value.toDate();
        this.setInputText(this.selectedDate);
        if (this.selectWeekMode) {
            this.dateChange.emit(getMonday(value));
        } else {
            this.dateChange.emit(value);
        }
    }

    setInputText(date: Date): void {
        let inputText = '';
        const dateFormat: string | DateFormatFunction = this.dateFormat;
        if (dateFormat === undefined || dateFormat === null) {
            inputText = moment(date).format(this.DEFAULT_FORMAT);
        } else if (typeof dateFormat === 'string') {
            inputText = moment(date).format(dateFormat);
        } else if (typeof dateFormat === 'function') {
            inputText = dateFormat(date);
        }
        this.inputText = inputText;
    }

}
