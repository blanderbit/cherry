import { MembersModalComponent } from 'src/app/common-projects/members-modal/members-modal.component';
import { Component, Injector, Input } from '@angular/core';
import { IProject, PermissionAction, ProjectStatus } from 'communication';
import { LoadingComponent } from 'components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectId } from '../../common-tasks/token/token';
import { Helpers } from '../../helpers';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],

})
export class ProjectCardComponent extends LoadingComponent<any> {
    private _project: IProject;
    // TODO: Remove after project progress implemented on the backend
    public progress: number;
    public projectStatus = ProjectStatus;
    public isFavorite = false;
    public color: string;
    public projectShortName: string;
    permissionActions = PermissionAction;

    get membersIds() {
        return this.project.members.map(item => item.id);
    }

    constructor(protected _ngbModal: NgbModal,
        protected _injector: Injector,
        protected _route: ActivatedRoute,

    ) {
        super();
    }

    @Input() set project(value: IProject) {
        this._project = value;
        this.projectShortName = value.name.acronym().toUpperCase();
        this.progress = Helpers.getRandomInteger(0, 100);
    }

    get project() {
        return this._project;
    }

    getPermissionsData() {
        return {
            projectId: this._project.id,
            loadPermissions: false,
        };
    }

    addMember() {
        this._ngbModal.open(MembersModalComponent, {
            size: 'lg',
            windowClass: 'members-dialog',
            injector: Injector.create({
                parent: this._injector,
                providers: [
                    {
                        provide: ProjectId,
                        useValue: this.project.id,
                    },
                ],
            }),
        });
    }
}
