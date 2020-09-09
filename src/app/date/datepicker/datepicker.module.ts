import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker.component';
import { NgbDateAdapter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Translate } from 'translate';
import { FormControlModule } from '../../form-control/form-control.module';
import { NgbServerDateAdapter } from './ngb-date-adapters';
import { DateModule } from '../date.module';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
    declarations: [
        DatepickerComponent,
    ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    Translate,
    FormControlModule,
    DateModule,
    A11yModule,
  ],
    exports: [
        DatepickerComponent,
    ],
    providers: [
        {
            provide: NgbDateAdapter,
            useClass: NgbServerDateAdapter
        }
    ]
})
export class DatepickerModule {
}
