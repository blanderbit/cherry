import { Component } from '@angular/core';
import { ItemsComponent } from 'components';
import { ProjectsProvider } from 'communication';
import { IProject } from '../../../../../projects/communication/src/lib/models/projects/project';
import { NotifierService } from '../../../notifier/notifier.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-gantt',
    templateUrl: './gantt.component.html',
    styleUrls: ['./gantt.component.scss']
})
export class GanttComponent extends ItemsComponent<IProject> {
    constructor(protected _provider: ProjectsProvider,
                protected _router: Router,
                protected _route: ActivatedRoute,
                protected _notifier: NotifierService) {
        super();
    }
}
