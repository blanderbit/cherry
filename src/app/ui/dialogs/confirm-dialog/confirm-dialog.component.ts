import { Component, Input } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { IConfirmDialogParams } from '../dialogs';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent extends DialogComponent<IConfirmDialogParams> implements IConfirmDialogParams {

    year: number;
    destinationYear: number = new Date().getUTCFullYear();

    @Input()
    title = 'confirm-dialog.title';

    @Input()
    description = 'confirm-dialog.description';

    @Input()
    confirm = 'confirm-dialog.confirm';

    @Input()
    reject = 'confirm-dialog.reject';
}
