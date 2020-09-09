import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DateValidators} from 'date';
import {ITask, ProjectStatus, TasksProvider} from 'communication';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {FormComponent, TranslateErrorHandler} from 'components';
import {NotifierService} from 'notifier';
import {ProfileService} from '../../../../../identify/profile.service';
import {SearchProjectProvider} from '../../../../../../../projects/communication/src/lib/services/http/http.project-search.provider';
import {IProjectPermissionsManagerParams, ProjectsPermissionsManager} from 'permissions';

/**
 * Adapter for ProjectsProvider to pass to AutocompleteComponent
 * Use after creatorId is added to basic project model
 * **/


@Component({
    selector: 'app-add-task-dialog',
    templateUrl: './add-task-dialog.component.html',
    styleUrls: ['./add-task-dialog.component.scss'],

})
export class AddTaskDialogComponent extends FormComponent<ITask> {
    public loadDataOnInit = false;
    public loadDataOnParamsChange = false;
    public errorHandler = new TranslateErrorHandler('errors');
    public Project = ProjectStatus;

    projectProviderParamsFormatter = (params) => {
        return {
            ...params,
            status: ProjectStatus.InProgress,
        };
    }

    constructor(
        @Inject(NgbActiveModal) protected activeModal: NgbActiveModal,
        @Inject(Router) protected _router: Router,
        private modalService: NgbModal,
        protected _route: ActivatedRoute,
        protected _provider: TasksProvider,
        protected _notifier: NotifierService,
        protected _profile: ProfileService,
        public projectsProvider: SearchProjectProvider,
        protected _permissionsManager: ProjectsPermissionsManager,
    ) {
        super();
    }

    loadData(params?: any) {
        super.loadData(params);
    }

    submit(event?) {
        this.valueChanged = true;
        this.apply(event);
    }

    createForm(): FormGroup {
        return new FormGroup({
                name: new FormControl('', [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(256),
                ]),
                projectId: new FormControl(null, [
                    Validators.required,
                ]),
                assignment: new FormControl(true),
                currentStartDate: new FormControl(null, [Validators.required]),
                currentEndDate: new FormControl(null, [Validators.required]),
            },
            {
                validators: [
                    DateValidators.dateLessThan('currentStartDate', 'currentEndDate'),
                ],
            },
        );
    }


    protected _handleSuccessCreate(item) {
        super._handleSuccessCreate();
        this.close(item);
    }

    close(value?) {
        this.activeModal.close(value);
    }

    protected getPermissionsData(): IProjectPermissionsManagerParams {
        return {
            projectId: this.formValue.projectId,
        };
    }
}
