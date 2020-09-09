import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormItemComponent } from './form-item.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        FormItemComponent,
    ],
    exports: [
        FormItemComponent
    ],
})
export class FormItemModule {

}
