import { Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { TaskDetailsComponent } from '../../../common-tasks/task-details/task-details.component';
import { IProject } from 'communication';
import { LoadingComponent } from 'components';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    providers: [
        {
            provide: LoadingComponent,
            useValue: forwardRef(() => DetailsComponent),
        },
    ],
})
export class DetailsComponent {
    @ViewChild(TaskDetailsComponent, { static: true })
    public taskDetails: TaskDetailsComponent;

    get project(): IProject {
        if (this.taskDetails && this.taskDetails.item) {
            return this.taskDetails.item.project;
        }
    }

    get loading() {
        return this.taskDetails && this.taskDetails.loading;
    }
}
