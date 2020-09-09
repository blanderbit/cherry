import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiredLinkComponent } from './expired-link.component';
import { Translate } from 'translate';

@NgModule({
  imports: [CommonModule, Translate],
    declarations: [ExpiredLinkComponent],
    exports: [ExpiredLinkComponent]
})
export class ExpiredLinkModule {
}
