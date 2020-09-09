import { NgModule } from '@angular/core';
import { NotificationSettingsComponent } from './notification-settings.component';
import { CommonModule } from '@angular/common';
import { NotificationRoutes } from './notification-settings.routing';
import { Translate } from 'translate';
import { LoaderModule } from 'loader';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [NotificationSettingsComponent],
    imports: [
        CommonModule,
        Translate.localize('notification-settings'),
        NotificationRoutes,
        LoaderModule,
        ReactiveFormsModule,
    ],
})
export class NotificationSettingsModule {
}
