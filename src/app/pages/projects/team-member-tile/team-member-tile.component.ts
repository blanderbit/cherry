import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import {
    IProject,
    IProjectMember,
    IResource,
    PermissionAction,
    ProjectsProvider,
    ProjectStatus,
    ResourceKind,
    ResourcesProvider,
} from 'communication';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'notifier';
import { IRole } from 'communication';
import { MatMenuItem } from '@angular/material/menu';
import {Translate} from "translate";

@Component({
    selector: 'app-team-member-tile',
    templateUrl: './team-member-tile.component.html',
    styleUrls: ['./team-member-tile.component.scss'],
})
export class TeamMemberTileComponent {
    permissionAction = PermissionAction;
    @Input() member?: IResource;
    @Input() project: IProject;
    @Input() role: IRole;
    @Input() roles: IRole[];
    // hide menu if no items
    @ViewChildren(MatMenuItem) menuItemsList: QueryList<MatMenuItem>;

    @Input()
    get showMenu() {
        return this.project && this.project.status !== ProjectStatus.Archived;
    }

    get showPhoto() {
        return this.member && this.member.kind !== ResourceKind.Generic;
    }

    get isDeletedResource() {
        return this.project.members.some(({id, removed}: IProjectMember): boolean => {
            return removed && id === this.member.id;
        })
    }

    constructor(private _notifier: NotifierService,
                private _projectProvider: ProjectsProvider,
                protected _translateService: TranslateService) {
    }

    deleteMember() {
        this._projectProvider.removeMember(this.project.id, {id: this.member.id, roleId: null} as IProjectMember)
            .subscribe(
            () => {
                this._notifier.showSuccess('action.successfully-moved'),
                    (err) => this._notifier.showError(err, 'action.delete-error')
            },
        );
    }

    updateMember(role) {
        this._projectProvider.updateMember(this.project.id, this.member.id, role)
            .subscribe(() => {
                this.role = role;
                this._notifier.showSuccess('teamMemberAction.roleChangeSuccess');
            }, (err) => {
                this._notifier.showError(err, 'teamMemberAction.roleChangeError');
            });
    }

    isHumanResource() {
        return ResourcesProvider.isHumanResource(this.member);
    }
}
