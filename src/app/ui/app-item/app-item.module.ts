import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppItemComponent } from './app-item.component';
import { Translate } from 'translate';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [AppItemComponent],
  imports: [
    CommonModule,
    Translate,
    RouterModule,
  ],
    exports: [AppItemComponent]
})
export class AppItemModule {
}
