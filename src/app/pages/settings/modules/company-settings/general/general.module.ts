import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './general.component';
import { GeneralRouting } from './general.routing';
import { Translate } from 'translate';
import { CompanyLogoModule } from '../../../../../companies/company-logo/company-logo.module';
import { FormControlModule } from 'form-control';

@NgModule({
  imports: [
    CommonModule,
    GeneralRouting,
    Translate.localize('general-company-settings'),
    CompanyLogoModule,
    FormControlModule,
  ],
    declarations: [GeneralComponent]
})
export class GeneralModule {
}

