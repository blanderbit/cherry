import { BasicProject } from './models/basic-project.interface';
import { IMembersModalComponentParams, MembersModalComponent } from './members-modal/members-modal.component';
import { CloudConfigure } from '../common-tasks/service/cloud.configure';
import { PermissionsGuard } from '../identify/permissions.guard';
import { IMenuItemsContainer, IItemWithPermissionAction } from '../pages/projects/details-wrapper/project-details-container.component';
import { Injector, OnDestroy, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    HumanResourcesProvider, IIdObject,
    ProjectFields,
    ProjectsProvider,
    ProjectStatus, ProjectType,
    redirectTo404, ResourceKind,
} from 'communication';
import { IItem } from 'menu';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
    IPermissionsDirectiveData,
    IProjectPermissionsManagerParams,

    PermissionsService,
    ProjectsPermissionsManager
} from 'permissions';
import { throwError } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { ProjectId } from 'src/app/common-tasks/token/token';
import { NotifierService } from 'src/app/notifier/notifier.service';
import { numbersFromEnum } from '../components/numbers-from-enum';
import { DashboardRoutes } from 'src/app/pages/dashboard/dashboard.routes';
import { FormComponent } from '../components/form.component';
import { DeleteProjectComponent } from 'src/app/common-projects/delete-project/delete-project.component';
import { KanbanProvider } from 'projects/communication/src/lib/services/common/kanban.provider';

const ALL_STATUSES = numbersFromEnum(ProjectStatus);

// type ProjectDetailsComponent = IIdObject & IStatusProvider;

@Injectable()
export abstract class ProjectDetailsComponent<T extends BasicProject> extends FormComponent<T>
    implements OnInit, OnDestroy, IMenuItemsContainer, IPermissionsDirectiveData {
    Status = ProjectStatus;
    Type = ProjectType;
    // helpers = Helpers;
    isEditMode = false;
    loadDataOnInit = false;
    autoSave = true;
    loadDataOnParamsChange = true;
    patchFields = [ProjectFields.Status, ProjectFields.Name];
    statuses = ALL_STATUSES;
    menuItems: IItem[] = [];
    // acceptFile: string[] = acceptFile;
    routes = DashboardRoutes;

    get projectId() {
        return +this.route.snapshot.paramMap.get('id');
    }

    get isProjectActive() {
        return ProjectsProvider.isProjectActive(this.item);
    }

    get creatorId() {
        return this.item && this.item.creatorId;
    }

    get membersIds(): number[] {
        return (this.item && this.item.members) ? this.item.members.map(item => item.id).getUnique() : [];
    }

    constructor(
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _provider: ProjectsProvider,
        protected _notifier: NotifierService,
        protected _ngbModal: NgbModal,
        protected _injector: Injector,
        protected _userProvider: HumanResourcesProvider,
        protected _permissionsGuard: PermissionsGuard,
        protected _permissionsService: PermissionsService,
        // Do not remove
        protected _permissionsManager: ProjectsPermissionsManager,
        protected _kanbanProvider: KanbanProvider,
        protected _cdr: ChangeDetectorRef,
        private _cloudConfigure: CloudConfigure,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

        this._provider.memberAdded
            .pipe(untilDestroyed(this))
            .subscribe(
                res => {
                    if (res.id !== this.projectId)
                        return;
                    const projectMembers = this.item.members;
                    this.item.members = [...res.members, ...projectMembers].getUnique();
                },
            );

        this._provider.memberRemoved
            .pipe(untilDestroyed(this))
            .subscribe(
                res => {
                    if (res.id !== this.projectId)
                        return;

                    const projectMembers = this.item.members;
                    this.item.members = projectMembers.filter(item => item.id !== res.resourceId);
                },
            );

        this._provider.memberUpdated
            .pipe(untilDestroyed(this))
            .subscribe(
                res => {
                    const index = this.item.members.findIndex(t => t.id === res.id);

                    if (index !== -1) {
                        this.item.members.splice(index, 1, { ...this.item.members[index], ...res });
                    }
                },
            );
    }

    delete(): void {
        if (this.item) {
            const instance = this._ngbModal.open(DeleteProjectComponent);
            (<DeleteProjectComponent>instance.componentInstance).project = this.item;
            instance.result.then(() => this.deleteItem(this.item)).catch(() => {});
        }
    }

    getDeleteMenuItem(): IItemWithPermissionAction {
        return {
            title: 'details.delete',
            icon: 'delete',
            action: () => {
                this.delete();
            },
            permissionAction: this.permissionAction.DeleteProject,
        };
    }

    setStatus(status: ProjectStatus, emitEvent = true) {
        this.controls.status.setValue(status, { emitEvent });
    }

    protected _handleUpdateItem(item: T): boolean {
        const result = super._handleUpdateItem(item);
        this.setOptionsForStatus(this.getDto().status);
        return result;
    }

    _handleUpdateError(error) {
        super._handleUpdateError(error);
        this.controls.status.setValue(this.item.status);
    }

    public handleUpdateStatusSuccess(status: ProjectStatus) {
        if (status != null) {
            this.onStatusChanged(status);
        }
    }

    public handleUpdateStatusError(status, err) {
        this._notifier.showError(err);
        this.onStatusChanged(status);
    }

    public onStatusChanged(status: ProjectStatus) {
        this.item = { ...this.item, status };
        this.setStatus(status, false);
        this.setOptionsForStatus(status);
    }

    public setOptionsForStatus(status: ProjectStatus) {
        this.statuses = ProjectsProvider.PROJECT_STATUSES_MAP[status] || ALL_STATUSES;
    }

    protected _handleSuccessUpdate() {
        super._handleSuccessUpdate();
    }

    public setItems(items: IItemWithPermissionAction[]): void {
        this.menuItems = (items || []).filter(item =>
            item.permissionAction ? this._permissionsService.hasPermissions(item.permissionAction) : true);
    }

    public apply() {
        super.apply();
        this.isEditMode = false;
    }

    protected _getItem(params: IIdObject) {
        return super._getItem(+params.id)
            .pipe(
                catchError(err => redirectTo404(err, this.router)),
                catchError(err => {
                    this._canActivateComponent();
                    return throwError(err);
                }),
                flatMap((project) => this._userProvider.getBaseItemsByIds([project.creatorId]).pipe(
                    map(users => users[0]),
                    map((creator) => ({ ...project, creator })),
                )),
            );
    }

    protected handleItem(item: T): void {
        super.handleItem(item);
        this._canActivateComponent();
        this.setOptionsForStatus(item.status);
    }

    createForm(): FormGroup {
        return new FormGroup({
            name: new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(256)],
                updateOn: 'blur',
            }),
            status: new FormControl(null, [
                Validators.required,
            ]),
        });
    }

    protected _handleFormInvalidError(errors: any) {
        this.notifier.showError(errors.name);
    }

    addMember() {
        const params = this._route.snapshot.params;
        const ref = this._ngbModal.open(MembersModalComponent, {
            size: 'lg',
            windowClass: 'members-dialog',
            injector: Injector.create({
                parent: this._injector,
                providers: [
                    {
                        provide: ProjectId,
                        useValue: params && +params.id,
                    },
                ],
            }),
        }).componentInstance as IMembersModalComponentParams;

        ref.resourceKind = [ResourceKind.Human];
    }

    protected getPermissionsData(): IProjectPermissionsManagerParams {
        return {
            projectId: this.projectId,
        };
    }

    protected _navigateOnSuccessAction(item?) {
        this._router.navigate(['/projects']);
    }

    protected _canActivateComponent(): void {
        this._permissionsGuard.canActivateByPermissionsData(this.permissionAction.ViewProjectById, {
            membersIds: this.membersIds,
            creatorId: this.creatorId,
        });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this._permissionsManager.clearProjectContext();
    }
}
