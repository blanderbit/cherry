import {Component, Inject, Input, Optional} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AssignmentsProvider, IBaseTask, TasksProvider, TaskType} from 'communication';
import {NotifierService} from 'notifier';
import {FormComponent, ILoadingHandler} from 'components';
import {IProjectPermissionsManagerParams, ProjectsPermissionsManager} from 'permissions';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchProjectProvider} from '../../../../projects/communication/src/lib/services/http/http.project-search.provider';
import {Translate} from 'translate';
import {Observable} from 'rxjs';
import {ProfileService} from '../../identify/profile.service';
import {TASK_TYPES_PROVIDER} from './filter-items';
import {TasksList} from '../../pages/tasks';

@Component({
    selector: 'app-add-task-inline',
    templateUrl: './add-task-inline.component.html',
    styleUrls: ['./add-task-inline.component.scss'],
    providers: [
        Translate.localizeComponent('add-inline-task'),
        TASK_TYPES_PROVIDER,
    ],
})
export class AddTaskInlineComponent extends FormComponent<IBaseTask> {
    private defaultValue;
    private _projectId: number;
    public showCreateNew = false;
    public loadDataOnInit = true;
    public loadDataOnParamsChange = false;
    public loadDataOnQueryParamsChange = false;

    public menuOptions = [
        {
            title: 'task',
            value: TaskType.Task,
        },
        {
            title: 'delivery',
            value: TaskType.Deliverable,
        },
    ];

    @Input() set projectId(value) {
        this._projectId = value;
        if (this.controls && this.controls.projectId) {
            this.controls.projectId.patchValue(value);
        }
    }

    @Input() autoAssign = false;

    get isDeliverable() {
        return this.formValue.type === TaskType.Deliverable;
    }

    constructor(public projectsProvider: SearchProjectProvider,
                public _provider: TasksProvider,
                public _notifier: NotifierService,
                public router: Router,
                public assignmentsProvider: AssignmentsProvider,
                public profile: ProfileService,
                public route: ActivatedRoute,
                protected _permissionsManager: ProjectsPermissionsManager,
                @Optional() @Inject(TasksList) public taskListParent: ILoadingHandler,
    ) {
        super();
        this.loadingHandler = taskListParent;
    }

    public show() {
        this.showCreateNew = true;
    }

    public hide() {
        this.showCreateNew = false;
    }

    protected getPermissionsData(): IProjectPermissionsManagerParams {
        return {
            projectId: this.formValue.projectId,
            loadPermissions: false,
        };
    }

    protected createForm(): FormGroup {
        this.defaultValue = {
            currentStartDate: new Date(),
            currentEndDate: new Date(),
            projectId: this._projectId,
            type: this.menuOptions[0].value,
        };

        return new FormGroup({
                name: new FormControl('', [Validators.required]),
                currentStartDate: new FormControl(new Date(), [Validators.required]),
                currentEndDate: new FormControl(new Date(), [Validators.required]),
                type: new FormControl(this.menuOptions[0].value, [Validators.required]),
                projectId: new FormControl(this._projectId, Validators.required),
            },
        );
    }

    public cancel($event) {
        $event.stopPropagation();
        this.hide();
        this.reset();
    }

    protected _handleCreateItem(item: any[] | any) {
        super._handleCreateItem(item);
        this.reset();
    }

    protected _handleSuccessCreate(response?) {
        super._handleSuccessCreate(response);
        this.hide();
    }

    private reset() {
        this.form.reset(this.defaultValue);
    }

    protected _create(obj: IBaseTask): Observable<any> {
        obj.assignment = this.autoAssign;
        return super._create(obj);

    }

    onBlur(input: HTMLInputElement) {
        setTimeout(() => {
            input.setSelectionRange(0, 0);
        });
    }
}
