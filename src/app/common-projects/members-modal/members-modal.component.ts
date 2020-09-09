import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IHumanResource, IProjectMember, IResource, ProjectsProvider, ResourceKind, ResourcesProvider, IRole } from 'communication';
import { forkJoin, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';
import { ProjectId } from 'src/app/common-tasks/token/token';
import { NotifierService } from 'notifier';
import { InfoDialogComponent } from '../../ui/dialogs/info-dialog/info-dialog.component';
import { ProjectRolesProvider } from '../../../../projects/communication/src/lib/services/common/project-roles.provider';
import { IItem } from 'menu';
import { ItemsComponent } from '../../components/items.component';

export interface IMembersModalComponentParams {
    resourceKind: ResourceKind[];
}

@Component({
    selector: 'app-members-modal',
    templateUrl: './members-modal.component.html',
    styleUrls: ['./members-modal.component.scss'],
})
export class MembersModalComponent extends ItemsComponent<IResource, any> implements OnInit {
    searchControl = new FormControl();
    selectedUsers: IProjectMember[] = [];
    ResourceKind = ResourceKind;
    roles: IRole[];

    @Input()
    public resourceKind: ResourceKind;

    get roleOptions(): IItem[] {
        return this.roles ? this.roles.map(role => ({title: role.name, value: role.id})) : [];
    }

    constructor(protected _provider: ResourcesProvider,
                protected _projectsProvider: ProjectsProvider,
                protected _roleProvider: ProjectRolesProvider,
                protected _notifier: NotifierService,
                protected _route: ActivatedRoute,
                protected _router: Router,
                protected _ngbModal: NgbModal,
                private modalService: NgbModal,
                @Inject(ProjectId) protected _projectId: number) {

        super();
    }

    ngOnInit(): void {
        super.ngOnInit();

        this._roleProvider.getItems({projectId: this._projectId})
            .subscribe((roles) => {
                this.roles = roles;
            });

        this.searchControl.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
        ).subscribe((search) => this.loadData({search}));
    }

    getParams(params?: any): any {
        if (this.resourceKind) {
            params = {...params, kind: this.resourceKind};
        }

        return super.getParams({params});
    }

    protected _getItems(params): Observable<IHumanResource[]> {
        return forkJoin([
            this._provider.getItems(params),
            this._projectsProvider.getMembers(+this._projectId),
        ]).pipe(map(getItems));
    }

    onUserSelect(user: IHumanResource, value) {
        if (this.selectedUsers.map(item => item.id).indexOf(user.id) !== -1) {
            this.selectedUsers = this.selectedUsers.filter((item) => item.id !== user.id);
        } else {
            const data = {
                id: user.id,
                roleId: this.isHumanResource(user) ? value : undefined,
                removed: false,
            };
            this.selectedUsers.push(data);
        }
    }

    inviteUsers() {
        const hide = this.showLoading();
        this._projectsProvider
            .addMembers(this._projectId, this.selectedUsers)
            .pipe(finalize(hide))
            .subscribe(() => {
                    this.close();
                    const instance = this._ngbModal.open(InfoDialogComponent);
                    instance.componentInstance.text = 'invitedUser';
                    instance.componentInstance.image = 'user-invited.png';
                }
                , err => this._notifier.showError(err, ''));
    }

    triggerSearch(param) {
        this.loadData({param});
    }

    close() {
        this.modalService.dismissAll();
    }

    isUserSelected(id: number) {
        return this.selectedUsers.map(item => item.id).includes(id);
    }

    onRoleSelect($event: any, user: IHumanResource) {
        user.systemRoleId = $event;
        const selectedUser = this.selectedUsers.find(item => user.id == item.id);
        if (selectedUser && this.isHumanResource(user)) {
            selectedUser.roleId = $event;
        }
        return false;
    }

    isHumanResource(user) {
        return ResourcesProvider.isHumanResource(user);
    }
}

function getItems([users, members]) {
    return users
        .filter(({id: userId}) => members.every(member => member.id !== userId))
        .map(user => ({
            ...user,
            roleId: members.filter(id => user.id === id).roleId,
            added: members.some(id => user.id === id)
        }));
}
