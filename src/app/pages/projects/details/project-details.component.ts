import { Component, Inject, OnInit } from '@angular/core';
import { FormComponent } from 'components';
import { HumanResourcesProvider, ProjectsProvider, ProjectStatus } from 'communication';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'notifier';
import {
    IProjectMenuItemsContainer,
    IProjectWithCreator,
    MenuItemsContainer,
    ProjectDetailsContainerComponent,
} from '../details-wrapper/project-details-container.component';
import { DateValidators } from 'date';
import { MetaService } from '@ngx-meta/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent extends FormComponent<IProjectWithCreator> implements OnInit {
    loadDataOnInit = false;
    loadDataOnParamsChange = true;
    autoSave = true;
    revertChangesOnError = true;

    get project(): IProjectWithCreator {
        return <any>this._parent.item;
    }

    get isProjectActive() {
        return ProjectsProvider.isProjectActive(this.project);
    }

    get isProjectInProgress() {
        return this.project && this.project.status === ProjectStatus.InProgress;
    }

    constructor(protected _route: ActivatedRoute,
                protected _provider: ProjectsProvider,
                protected _usersProvider: HumanResourcesProvider,
                protected _metaService: MetaService,
                protected _ngbModal: NgbModal,
                protected _notifier: NotifierService,
                protected _projectDetailsContainerComponent: ProjectDetailsContainerComponent,
                @Inject(ProjectDetailsContainerComponent) private _parent: ProjectDetailsContainerComponent,
                @Inject(MenuItemsContainer) private _menuItemsContainer: IProjectMenuItemsContainer,
                protected _router: Router) {
        super();

        this.loadingHandler = _parent;
    }

    showLoading(initializing: boolean = false): () => void {
        const hide = super.showLoading(initializing);
        const parentHide = this._projectDetailsContainerComponent.showLoading(initializing);

        return () => {
            hide();
            parentHide();
        };
    }

    setStatus(status: ProjectStatus, emitEvent = true) {
        this.controls.status.setValue(status, {emitEvent});
    }

    protected _getItem() {
        const {params = {}} = this._route.snapshot || {};

        return super._getItem(+params.id).pipe();
    }

    protected handleItem(item: IProjectWithCreator): void {
        this.form.reset();
        super.handleItem(item);

        this._menuItemsContainer.setItems([
            this._menuItemsContainer.getDeleteMenuItem(),
        ]);
    }

    createForm(): FormGroup {
        return new FormGroup({
            description: new FormControl(null, {
                updateOn: 'blur',
            }),
            startDate: new FormControl(null, [
                Validators.required,
                // DateValidators.dateSequence('endDate'),
            ]),
            endDate: new FormControl(null, [Validators.required]),
        }, {
            validators: DateValidators.dateLessThan('startDate', 'endDate'),
        });
    }

    protected _handleFormInvalidError(errors: any) {
        this.notifier.showError(errors.date);
    }

    protected _navigateOnSuccessAction() {
        this._router.navigate(['/projects']);
    }
}
