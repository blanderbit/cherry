import { Component, Input } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { Translate } from 'translate';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
  providers: Translate.localizeComponent('info-dialog'),


})
export class InfoDialogComponent extends DialogComponent {
  @Input() image: string;
  @Input() text: string;

}
