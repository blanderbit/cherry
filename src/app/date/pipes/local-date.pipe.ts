import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from 'translate';
import { DatePipe } from '@angular/common';
import { LocalizationService } from '../../localization.service';

@Pipe({
    name: 'localDate'
})
export class LocalDatePipe implements PipeTransform {
    constructor() {
    }

    transform(date: string | number | Date, format?: string) {
        const datePipe = new DatePipe(LocalizationService.locale);
        return datePipe.transform(date, format);
    }
}
