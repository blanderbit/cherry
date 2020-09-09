import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormComponent, TranslateErrorHandler } from 'components';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IProject, ITask, ProjectStatus, ProjectType, TaskType } from 'communication';
import { filter } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NotifierService } from 'notifier';
import { DateValidators } from 'date';
import { CreateComponentConfig, CreateProvider, ICreateComponentConfig, ModuleAlias } from '../providers';
import { ALIAS } from 'src/app/create/alias';
import { TranslateService } from '@ngx-translate/core';
import { ProjectId } from '../../common-tasks/token/token';

enum Fields {
    EndDate = 'endDate',
    StartDate = 'startDate',
}

const TypeKey = 'type';
const ProjectStatusKey: keyof Pick<IProject, 'status'> = 'status';

const ProjectStatusOptions: ProjectStatus[] = [ProjectStatus.Draft, ProjectStatus.InProgress];

const TypeTransleteEnum = {
    [TaskType.Deliverable]: 'deliverable',
    [TaskType.Task]: 'task',
};

// create component expects object with 'startDate' and 'endDate' fields
// after issue #136 on task interface those fields was renamed to currentStartDate and currentEndDate
export type TaskWithFakeDateFields = ITask & Pick<IProject, 'startDate' | 'endDate'>;

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers: [
        NotifierService
    ]
})
export class CreateComponent extends FormComponent<TaskWithFakeDateFields | IProject> implements OnInit {
    TaskType = TaskType;
    ProjectType = ProjectType;
    TypeKey = TypeKey;
    ALIAS = ALIAS;
    autoSave = false;
    loadDataOnParamsChange = false;
    loadDataOnInit = true;
    errorHandler = new TranslateErrorHandler('errors');
    projectStatusOptions = ProjectStatusOptions;

    get newItemTranslate() {
        return this.translateNewItem(this.type);
    }

    get typeTranslateKey() {
        return this.typeTranslationKey(this.type);
    }

    get type() {
        return this.alias == ALIAS.Tasks ? this.form.get(TypeKey).value : null;
    }

    get requestParamsHandler(): (item) => ITask | IProject {
        return (this.config && this.config.handleRequestParams) || ((item) => item);
    }

    get hideTypeCheckboxes() {
        return this.config && this.config.hideTypeCheckboxes;
    }

    constructor(private modalService: NgbModal,
                protected _router: Router,
                protected _route: ActivatedRoute,
                protected _translateService: TranslateService,
                _provider: CreateProvider,
                @Optional() @Inject(CreateComponentConfig) protected config: ICreateComponentConfig,
                @Optional() @Inject(ProjectId) protected _projectId: number,
                @Inject(ModuleAlias) public readonly alias: ALIAS,
                protected _notifier: NotifierService) {
        super();
        this._provider = _provider as any;
    }

    ngOnInit() {
        super.ngOnInit();

        this._router.events
            .pipe(untilDestroyed(this), filter(e => e instanceof NavigationStart))
            .subscribe(() => this.modalService.dismissAll());
    }

    translateNewItem(type) {
        return getTranslateKey(this.typeTranslationKey(type), 'new-item');
    }

    typeTranslationKey(type) {
        return type != null && TypeTransleteEnum[type].toLowerCase();
    }

    submit(event) {
        this.valueChanged = true;
        this.apply(event);
    }

    protected _getItem(id?: any): Observable<ITask> {
        return of(null);
    }

    getDto(): ITask | IProject {
        const value = super.getDto();
        const dto = this._projectId ? {...value, projectId: this._projectId} : value;

        return this.requestParamsHandler(dto);
    }

    protected handleValueChange(value: any) {
        super.handleValueChange(value);
        if (this.alias === ALIAS.Projects || !value)
            return;

        const {form} = this;
        const type = value[TypeKey];
        const controlExist = form.get(Fields.StartDate);

        if (type === TaskType.Deliverable && controlExist) {
            form.removeControl(Fields.StartDate);
        } else if (type === TaskType.Task && !controlExist) {
            form.addControl(Fields.StartDate, getDateControl());
        }
    }

    createForm(): FormGroup {
        const formGroup = new FormGroup({
                name: new FormControl('', [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(256),
                ]),
                description: new FormControl(''),
                [Fields.StartDate]: getDateControl(),
                [Fields.EndDate]: getDateControl(),
            },
            {
                validators: [
                    DateValidators.dateLessThan(Fields.StartDate, Fields.EndDate),
                ],
            },
        );

        if (this.alias === ALIAS.Tasks)
            formGroup.addControl(TypeKey, new FormControl(TaskType.Task));

        if (this.alias === ALIAS.Projects) {
            formGroup.addControl(TypeKey, new FormControl(ProjectType.Agile));
            formGroup.addControl(ProjectStatusKey, new FormControl(ProjectStatus.Draft));
        }

        return formGroup;
    }

    close() {
        this.modalService.dismissAll();
    }

    protected _handleSuccessCreate(item) {
        super._handleSuccessCreate();

        if (this.config && this.config.onSuccessCreate) {
            this.config.onSuccessCreate(item);
        } else {
            this._onSuccessCreate(item);
        }

        this.close();
    }

    protected _onSuccessCreate(item) {
        /**
         * Relative work dont work here
         * And we need custom flow for different pages
         * For example:
         * we are on /projects/123
         * and when we created some project we need redirect to /projects/NEW_PROJECT_ID
         *
         * If you need more scalable solution you can pass onCreateSuccess callback to create method
         * */

        const [url] = this.router.url.split('?');
        const segments = url.split('/');
        const navigateSegments = segments.slice(0, segments.lastIndexOf(this.alias) + 1);

        this._router.navigate([...navigateSegments, item.id]);
    }

    protected _getTranslateKey(key): any | string {
        // check if key is not object(error object)
        return typeof key === 'string' ? getTranslateKey(this.typeTranslateKey, key) : super._getTranslateKey(key);
    }
}

function getDateControl() {
    return new FormControl(null, {
        validators: [Validators.required],
    });
}

function getTranslateKey(...args) {
    return args.filter(Boolean).join('.');
}
