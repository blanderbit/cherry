import { Component, Inject, Injector, OnInit } from '@angular/core';
import { IMemberRemoved, IMembersAdded, IResource, IRole, ProjectsProvider, ResourceKind, ResourcesProvider } from 'communication';
import { ActivatedRoute } from '@angular/router';
import { Observable, pipe, of } from 'rxjs';
import { ItemsComponent } from 'components';
import { NotifierService } from 'notifier';
import { TasksCreateService } from 'create';
import { filter, flatMap, switchMap, catchError } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MembersModalComponent } from '../../../common-projects/members-modal/members-modal.component';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
    IProjectMenuItemsContainer,
    MenuItemsContainer,
    ProjectDetailsContainerComponent,
} from '../details-wrapper/project-details-container.component';
import { ProjectId } from 'src/app/common-tasks/token/token';
import { ProfileService } from '../../../identify/profile.service';
import { ProjectRolesProvider } from '../../../../../projects/communication/src/lib/services/common/project-roles.provider';

@Component({
    selector: 'app-project-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss'],
})
export class TeamComponent extends ItemsComponent<IResource> implements OnInit {
    roles: IRole[];
    resourceKind = ResourceKind;
    loadDataOnParamsChange = false;
    loadDataOnQueryParamsChange = false;

    get projectId() {
        return this.project && this.project.id;
    }

    get project() {
        return this._parent.item;
    }

    constructor(protected _provider: ResourcesProvider,
        protected _projectsProvider: ProjectsProvider,
        protected _roleProvider: ProjectRolesProvider,
        protected _createService: TasksCreateService,
        protected _notifier: NotifierService,
        protected _ngbModal: NgbModal,
        protected _injector: Injector,
        protected _profile: ProfileService,
        @Inject(MenuItemsContainer) private _menuItemsContainer: IProjectMenuItemsContainer,
        @Inject(ProjectDetailsContainerComponent) private _parent: ProjectDetailsContainerComponent,
        protected _route: ActivatedRoute) {
        super();

        this.loadingHandler = _parent;

        _menuItemsContainer.setItems([_menuItemsContainer.getDeleteMenuItem()]);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this._projectsProvider.memberRemoved
            .pipe(
                untilDestroyed(this),
                filter(this.filterOnMemberChange()),
            ).subscribe(({ resourceId, id }: IMemberRemoved) => {
                this._handleDeleteItem({ id: resourceId });
                this.project.members = this.project.members.filter(item => item.id !== id);
            });

        this._projectsProvider.memberUpdated
            .pipe(
                untilDestroyed(this),
                filter(this.filterOnMemberChange()),
            ).subscribe(({ resourceId, id }: IMemberRemoved) => {
                debugger
                // this._handleDeleteItem({ id: resourceId });
                // this.project.members = this.project.members.filter(item => item.id !== id);
            });

        this._projectsProvider.memberRemovedDisabled
            .pipe(
                untilDestroyed(this),
                filter(this.filterOnMemberChange()),
            ).subscribe(({ resourceId, id }: IMemberRemoved) => {
                debugger
                // this._handleDeleteItem({ id: resourceId });
                // this.project.members = this.project.members.filter(item => item.id !== id);
            });

        const params = this._route.parent.snapshot.params;
        this._roleProvider.getItems({ projectId: params.id })
            .subscribe((roles) => {
                this.roles = roles;
            });

        this._projectsProvider.memberAdded
            .pipe(
                untilDestroyed(this),
                filter(this.filterOnMemberChange()),
                flatMap(({ members }: IMembersAdded) => {
                    this.project.members = this.project.members.concat(members);
                    return this._provider.getItemsByIds(members.map(item => item.id));
                },
                ),
            ).subscribe(resources => {
                this._handleCreateItem(resources);
            });
    }
    get isProjectActive() {
        return this.project && ProjectsProvider.isProjectActive(this.project);
    }

    addMember() {
        this._ngbModal.open(MembersModalComponent, {
            size: 'xl',
            windowClass: 'members-dialog',
            injector: Injector.create({
                parent: this._injector,
                providers: [
                    {
                        provide: ProjectId,
                        useValue: this.projectId,
                    },
                ],
            }),
        });

    }

    protected _getItems(): Observable<any> {
        return this._route.parent.params.pipe(
            switchMap(() => this._projectsProvider.getMembers(+this._route.snapshot.parent.params.id)),
            switchMap((members) => this._provider.getItemsByIds(members.map(item => item.id))),
        );
    }

    filterOnMemberChange() {
        return (change: any) => this.projectId === change.id;
    }

    protected _handleLoadingError(error: any) {
        this.showError(error, 'action.load-items-error');

    }

    getResourcesByKind(kind: ResourceKind) {
        return this.items.filter(item => {
            return item.kind === kind;
        });
    }
}
