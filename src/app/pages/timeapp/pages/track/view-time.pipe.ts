import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'viewTime'
})
export class ViewTimePipe implements PipeTransform {
    static secondToText(minutes: number): string {
        let hours: number | string = Math.floor(minutes / 60);
        let minutesStr: number | string = Math.floor(minutes - (hours * 60));

        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutesStr < 10) {
            minutesStr = '0' + minutesStr;
        }

        return hours + ':' + minutesStr;
    }

    static textToSeconds(viewString: string): number {
        const timeStrArr = viewString.split(':'); // split it at the colons

        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        return ((+timeStrArr[0]) * 60) + ((+timeStrArr[1]) || 0);
    }

    transform(value: number, args?: any): any {
        return ViewTimePipe.secondToText(value || 0);
    }

}
