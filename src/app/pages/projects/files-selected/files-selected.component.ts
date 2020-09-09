import { Component, forwardRef, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttachmentsService } from '../../../common-tasks/service/attachment.service';
import { IPermissionsDirectiveData, PERMISSIONS_DIRECTIVE_DATA } from 'permissions';
import { PermissionAction, ProjectsProvider } from 'communication';
import { ProjectDetailsContainerComponent } from '../details-wrapper/project-details-container.component';
import { DashboardRoutes } from '../../dashboard/dashboard.routes';

@Component({
    selector: 'app-files-selected',
    templateUrl: './files-selected.component.html',
    styleUrls: ['./files-selected.component.scss'],
    providers: [
        {
            provide: PERMISSIONS_DIRECTIVE_DATA,
            useExisting: forwardRef(() => FilesSelectedComponent),
        },
    ],
})
export class FilesSelectedComponent implements IPermissionsDirectiveData {
    permissionAction = PermissionAction;

    get pageName() {
        return this._route.snapshot.children[0].routeConfig.path;
    }

    get selectedFiles() {
        if (this.pageName === DashboardRoutes.Files) {
            return this.attachmentsService.selectedFiles.getValue();
        } else {
            this.attachmentsService.selectedFiles.next([]);
        }
    }

    get project() {
        return this._parent.item;
    }

    get membersIds() {
        return this.project.members.map(member => member.id);
    }

    get creatorId() {
        return this.project.creatorId;
    }

    get isProjectActive() {
        return ProjectsProvider.isProjectActive(this.project);
    }

    constructor(
        protected _route: ActivatedRoute,
        private attachmentsService: AttachmentsService,
        @Inject(ProjectDetailsContainerComponent) private _parent: ProjectDetailsContainerComponent,
    ) {
    }

    deleteAllSelectedFiles() {
        this.attachmentsService.deleteSelectedFiles(this.selectedFiles);
    }

    downloadAllSelectedFiles() {
        this.selectedFiles.forEach(file => {
            this.attachmentsService.download(file);
            file.selected = false;
        });
        this.attachmentsService.selectedFiles.next([]);
    }
}
