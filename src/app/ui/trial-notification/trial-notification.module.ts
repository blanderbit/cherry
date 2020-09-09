import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrialNotificationComponent } from './trial-notification.component';
import { Translate } from 'translate';
import { DateModule } from 'date';

@NgModule({
    imports: [CommonModule, Translate, DateModule],
    declarations: [TrialNotificationComponent],
    exports: [TrialNotificationComponent]
})
export class TrialNotificationModule {
}
