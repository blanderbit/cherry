import { NgModule } from '@angular/core';
import { FormControlComponent } from './form-control.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FormControlComponent],
    imports: [
        TranslateModule
    ],
  exports: [FormControlComponent]
})
export class FormControlModule { }
