import { IBasicProject } from '../../../../projects/communication/src/lib/models/projects/project';
import { Component, Input, OnInit } from '@angular/core';
import { IProject } from '../../../../projects/communication/src/lib/models/projects/project';
import { DialogComponent } from '../../ui/dialogs/dialog/dialog.component';

@Component({
    selector: 'app-archive-project',
    templateUrl: './archive-project.component.html',
    styleUrls: ['./archive-project.component.scss'],
})
export class ArchiveProjectComponent extends DialogComponent {
    @Input() public project: Partial<IProject>;
    @Input() public onSubmit = () => {};
    @Input() public onCancel = () => {};
}
