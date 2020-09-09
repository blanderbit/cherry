import { NgModule } from '@angular/core';
import { AccessSettingComponent } from './access-setting.component';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from '../../../ui/checkbox/checkbox.module';
import { Translate } from 'translate';
import { RadioButtonModule } from '../../../ui/radio-button/radio-button.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppItemModule } from '../../../ui/app-item/app-item.module';


@NgModule(
    {
      imports: [CommonModule, CheckboxModule, Translate, RadioButtonModule, ReactiveFormsModule, AppItemModule],
        declarations: [
            AccessSettingComponent,
        ],
        exports: [
            AccessSettingComponent,
        ],
    },
)
export class AccessSettingModule {

}
