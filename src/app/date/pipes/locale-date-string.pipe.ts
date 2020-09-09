import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'localeDateString',
})
export class LocaleDateStringPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value == null || value === '') {
            return null;
        }

        const numericValue = Number(value);
        return isNaN(numericValue) ? '' : (new Date(value)).toLocaleDateString();
    }

}
