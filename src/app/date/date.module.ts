import { NgModule } from '@angular/core';
import {
    DaysAgoPipe,
    HoursPipe,
    LocalDatePipe,
    LocaleDateStringPipe,
    MomentPipe,
    TimeToStringPipe,
    WeekdayPipe
} from './pipes';
import { HighlightOverdueDateDirective } from './directives';
import { WeekAgoPipe } from './pipes/week-ago.pipe';
import { WeekRangePipe } from './pipes/week-range.pipe';

const DIRECTIVES = [
    HighlightOverdueDateDirective,
];

const PIPES = [
    LocalDatePipe,
    TimeToStringPipe,
    DaysAgoPipe,
    HoursPipe,
    LocaleDateStringPipe,
    MomentPipe,
    WeekdayPipe,
    WeekAgoPipe,
    WeekRangePipe,
];

const COMMON = [
    ...DIRECTIVES,
    ...PIPES,
];

@NgModule({
    declarations: [
        ...COMMON,

    ],
    exports: [
        ...COMMON,
    ],
    imports: [],
})
export class DateModule {
}
