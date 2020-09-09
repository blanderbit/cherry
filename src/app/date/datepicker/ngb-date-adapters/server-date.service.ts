import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Injectable()
export class NgbServerDateAdapter extends NgbDateAdapter<string> {
    fromModel(value: string): NgbDateStruct {
        if (value) {
            // console.log('FROM MODEL', value);
            const date = moment(value);
            return date ? {year: date.year(), month: date.month() + 1, day: date.date()} : null;
        }
    }

    toModel(date: NgbDateStruct): string {
        if (date) {
            // console.log(date, moment({...date, month: date.month - 1}).format('YYYY-MM-DD'));
            return moment({...date, month: date.month - 1}).format('YYYY-MM-DD');
        }
    }
}
