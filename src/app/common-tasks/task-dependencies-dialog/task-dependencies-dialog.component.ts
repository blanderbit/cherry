import { Component } from '@angular/core';
import { ITaskDependency } from '../task-dependency/task-dependency.component';
import { DialogComponent } from 'src/app/ui/dialogs/dialog/dialog.component';

@Component({
    selector: 'app-task-dependencies-dialog',
    templateUrl: './task-dependencies-dialog.component.html',
    styleUrls: ['./task-dependencies-dialog.component.scss']
})
export class TaskDependenciesDialogComponent extends DialogComponent<ITaskDependency[]> {
}
