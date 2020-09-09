import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeToString',
})
export class TimeToStringPipe implements PipeTransform {


  static timeToString(time: number, showMinutesIfEmpty = true, showNegativeValue = false): string {

    if (isNaN(time) || (time < 0 && !showNegativeValue)) time = 0;

    const minutes = Math.abs(time % 60);

    const hours = Math.floor(time / 60);

    return `${hours || 0}h ${(minutes || showMinutesIfEmpty) ? `${minutes}m` : ''}`;
  }

  transform(value: number, showMinutesIfEmpty = true, showNegativeValue = false): string {
    return TimeToStringPipe.timeToString(value, showMinutesIfEmpty, showNegativeValue);
  }

}
