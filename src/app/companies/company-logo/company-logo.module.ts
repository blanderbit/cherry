import { NgModule } from '@angular/core';
import { CompanyLogoComponent } from './company-logo.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [CompanyLogoComponent],
  imports: [CommonModule],
    exports: [CompanyLogoComponent]
})
export class CompanyLogoModule {
}
