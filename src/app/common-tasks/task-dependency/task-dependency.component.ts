import { Component, Input } from '@angular/core';
import { IDependency, TaskOrDeliverable, TaskType } from 'communication';

export interface ITaskDependency extends IDependency {
    task: TaskOrDeliverable;
}

@Component({
    selector: 'app-task-dependency',
    templateUrl: './task-dependency.component.html',
    styleUrls: ['./task-dependency.component.scss']
})
export class TaskDependencyComponent {
    private _dependency: ITaskDependency;
    public description: string;
    public taskName: string;
    public taskType: TaskType;

    @Input() set dependency(value: ITaskDependency) {
        this._dependency = value;
        this.taskName = value.task.name;
        this.taskType = value.task.type;
    }

    get dependency() {
        return this._dependency;
    }
}
