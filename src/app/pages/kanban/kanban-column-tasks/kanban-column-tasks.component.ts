import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ItemsComponent } from 'components';
import { IKanbanTask } from '../project-kanban-board/project-kanban-board.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'notifier';
import { IBasicTask, Provider, TasksProvider } from 'communication';

@Component({
    selector: 'app-kanban-column-tasks',
    templateUrl: './kanban-column-tasks.component.html',
    styleUrls: ['./kanban-column-tasks.component.scss']
})
export class KanbanColumnTasksComponent extends ItemsComponent<IBasicTask> implements OnInit {
    public loadDataOnInit = false;
    public loadDataOnParamsChange = false;
    public addTaskInProgress = false;

    @Input()
    public items: IKanbanTask[];

    @Input()
    public itemTemplate: TemplateRef<HTMLElement>;

    // get provider(): Provider<IKanbanTask> {
    //     return this._provider as unknown as Provider<IKanbanTask>;
    // }

    constructor(
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _notifier: NotifierService,
        protected _provider: TasksProvider,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
