import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualTimeInputComponent } from './manual-time-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ManualTimeInputService } from './manual-time-input.service';

@NgModule({
    declarations: [
        ManualTimeInputComponent
    ],
    exports: [
        ManualTimeInputComponent
    ],
    imports: [
        ReactiveFormsModule
    ],
    providers: [
        ManualTimeInputService,
    ]
})
export class ManualTimeInputModule {
}
