import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentionsInputComponent } from './mentions-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModule } from '../../user/user.module';
import { Translate } from 'translate';
import { AutosizeModule } from 'ngx-autosize';
import { CustomDirectivesModule } from '../../custom-directives/custom-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserModule,
    Translate,
    AutosizeModule,
    CustomDirectivesModule,
  ],
    declarations: [
        MentionsInputComponent
    ],
    exports: [
        MentionsInputComponent,
    ],
})
export class MentionsInputModule {
}
