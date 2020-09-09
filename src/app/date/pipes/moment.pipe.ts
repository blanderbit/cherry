import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from 'translate';

@Pipe({
    name: 'moment'
})
export class MomentPipe implements PipeTransform {

    constructor(private translateService: TranslateService) {
    }

    transform(value: any, format?: string): any {
        return moment(value).locale(this.translateService.language).format(format || '');
    }

}
