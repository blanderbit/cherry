import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeInputComponent } from './time-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DateModule } from 'date';


@NgModule({
    declarations: [TimeInputComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DateModule,
    ],
    exports: [
        TimeInputComponent,
    ],
})
export class TimeInputModule {
}
