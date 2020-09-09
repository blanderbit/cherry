import { Pipe, PipeTransform } from '@angular/core';
import { MomentPipe } from './moment.pipe';

@Pipe({
    name: 'weekday'
})
export class WeekdayPipe extends MomentPipe implements PipeTransform {
    transform(value: any): any {
        return super.transform(value, 'ddd');
    }
}
