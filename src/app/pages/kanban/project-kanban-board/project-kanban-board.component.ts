import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IBasicTask, IIdObject, IProjectMember, ProjectStatus, ProjectType } from 'communication';
import { IProjectPermissionsManagerParams, PERMISSIONS_DIRECTIVE_DATA } from 'permissions';
import { Observable } from 'rxjs';
import { ProjectDetailsComponent } from 'src/app/common-projects/project-details.component';
import { ITypedFormGroup } from './../../settings/modules/company-settings/forms/holidays-policy-form/holidays-policy-form.component';

export interface IKanbanBoard extends IIdObject {
    id: number;
    name: string;
    columns: IKanbanColumn[];

    creatorId: number;
    members: IProjectMember[];
    status: ProjectStatus;
    type: ProjectType;
}

export interface IKanbanColumn extends IIdObject {
    name: string;
    plannedTime: number;
    trackedTime: number;
    taskCards: IKanbanTask[];
}

export interface IKanbanTask extends IIdObject, IBasicTask {
    id: number;
    name: string;
    priorityId: number;
    currentStartDate: string;
    currentEndDate: string;
    actualTime: number;
    status: number;
    plannedTime: number;
}

export interface IKanbanMember {
    projectId: number;
    removed: boolean;
    resourceId: number;
    roleId: number;
}

@Component({
    selector: 'app-project-kanban-board',
    templateUrl: './project-kanban-board.component.html',
    styleUrls: ['./project-kanban-board.component.scss', '../kanban.component.scss'],
    providers: [
        {
            provide: PERMISSIONS_DIRECTIVE_DATA,
            useExisting: forwardRef(() => ProjectKanbanBoardComponent),
        },
    ]
})
export class ProjectKanbanBoardComponent extends ProjectDetailsComponent<IKanbanBoard> {
    public menuItems = [this.getDeleteMenuItem()];
    public addColumnInProgress = false;
    addNewColumnForm = new FormGroup({
        name: new FormControl(null, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(256)
        ]),
    } as ITypedFormGroup<Partial<IKanbanBoard>>);

    @ViewChild('newColumnNameInput', {static: false})
    public set newColumnNameInput(value: ElementRef<HTMLInputElement>) {
        console.log('VALUE', value);
        if (value) {
            value.nativeElement.focus();
        }
    }

    get membersIds(): number[] {
        return this.item && this.item.members.map(member => member.id);
    }

    _getItem(params: IIdObject): Observable<IKanbanBoard> {
        return this._kanbanProvider.getItemById(params.id);
    }

    protected getPermissionsData(): IProjectPermissionsManagerParams {
        return {
            projectId: this.projectId,
            loadPermissions: true,
            setProjectContext: true,
        };
    }

    protected _navigateOnSuccessAction() {
        super._navigateOnSuccessAction();
    }

    protected _canActivateComponent(): void {
        // this._permissionsGuard.canActivateByPermissionsData(this.permissionAction.ViewProjectById, {
        //     membersIds: this.membersIds,
        //     creatorId: this.creatorId,
        // });
        return;
    }
}
