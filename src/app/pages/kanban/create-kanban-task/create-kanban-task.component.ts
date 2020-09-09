import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAssigneeComponent } from './../../../common-tasks/add-assignee/add-assignee.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormComponent } from 'components';
import { IKanbanTask } from '../project-kanban-board/project-kanban-board.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateValidators } from 'date';
import { IIdObject, IResource, TasksProvider } from 'communication';
import { NotifierService } from 'notifier';
import { ProjectId } from '../../../common-tasks/token/token';

@Component({
  selector: 'app-create-kanban-task',
  templateUrl: './create-kanban-task.component.html',
  styleUrls: ['./create-kanban-task.component.scss']
})
export class CreateKanbanTaskComponent extends FormComponent<IKanbanTask> implements OnInit {
    public loadDataOnInit = false;
    public loadDataOnQueryParamsChange = false;
    public shouldTaskBeHighlighted = TasksProvider.shouldBeHighlighted;
    public assignments: IResource[] = [];

    @Output()
    public hide = new EventEmitter<void>();

    get projectId(): string | number {
        return (this.route.snapshot.params as IIdObject).id;
    }

    constructor(
        protected _router: Router,
        protected _route: ActivatedRoute,
        protected _notifier: NotifierService,
        protected _provider: TasksProvider,
        protected _ngbModal: NgbModal,
        protected _injector: Injector,
    ) {
        super();
    }

    createForm() {
        return new FormGroup({
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(256),
            ]),
            description: new FormControl(''),
            currentStartDate: getDateControl(),
            currentEndDate: getDateControl(),
        }, {
            validators: [
                DateValidators.dateLessThan('currentStartDate', 'currentEndDate'),
            ],
        });
    }

    addAssignee() {
        const ref: AddAssigneeComponent = this._ngbModal.open(AddAssigneeComponent, {
            windowClass: 'add-assignee-dialog',
            injector: Injector.create({
                parent: this._injector,
                providers: [
                    {
                        provide: ProjectId,
                        useValue: this.projectId,
                    },
                ],
            }),
        }).componentInstance;

        ref.selectedResources = this.assignments;
        ref.onSubmit = this.onSubmit.bind(this);
    }

    public onSubmit(items: IResource[]) {
        this.assignments = items;
    }

    public hideCreateTask(): void {
        this.hide.emit();
    }
}

function getDateControl() {
    return new FormControl(null, {
        validators: [Validators.required],
    });
}
