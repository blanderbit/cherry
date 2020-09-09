import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class NgbDateMillisecondsAdapter extends NgbDateAdapter<number> {
    fromModel(value: number): NgbDateStruct {
        if (value) {
            const date = new Date(value);
            return date ? {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()} : null;
        }
    }

    toModel(date: NgbDateStruct): number {
        return date ? new Date(date.year, date.month - 1, date.day).getTime() : null;
    }
}
