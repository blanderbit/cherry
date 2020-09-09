import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toHours',
})
export class HoursPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const minutesTime = parseInt(value, 10);

        if (isNaN(minutesTime)) {
            return null;
        }
        return Math.round(minutesTime / 60);
    }

}
