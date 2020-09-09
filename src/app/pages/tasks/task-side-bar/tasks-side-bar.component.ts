import { Component, OnDestroy } from '@angular/core';
import { IProject, PermissionAction, ProjectStatus } from 'communication';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'src/app/notifier/notifier.service';
import { ISidebarNavigationData } from '../../../ui/sidebar/sidebar/sidebar.component';
import { getLastSegmentFromUrl } from '../../../components/router-redirect.component';
import { TasksRoutes } from '../index';
import { untilDestroyed } from 'ngx-take-until-destroy';

export interface TasksSideBarQueryParams {
    projectId?: string | number;
}

@Component({
    selector: 'app-task-side-bar',
    templateUrl: './tasks-side-bar.component.html',
    styleUrls: ['./tasks-side-bar.component.scss'],
})
export class TasksSideBarComponent implements OnDestroy {
    private _projects: IProject[] = [];
    private _lastProjectId: number | string;
    data = {
        titleUrl: `/tasks`,
        navigation: [
            {
                icon: 'icon-my-task',
                title: 'side.my-tasks',
                url: TasksRoutes.My,
                permissionAction: PermissionAction.ViewMyTasks,
            },
            {
                icon: 'icon-all-tasks',
                title: 'headers.allTasks',
                url: TasksRoutes.All,
                permissionAction: PermissionAction.ViewAllTasks,
            },
            {
                icon: 'icon-projects',
                title: 'side.by-project',
                url: TasksRoutes.ByProject,
                skipLocationChange: true,
                permissionAction: PermissionAction.ViewTasksByProject,
            },
        ],
    } as ISidebarNavigationData;

    public projectStatus = ProjectStatus;

    public projectsListParams = {
        status: ProjectStatus.InProgress,
        member: true,
    };

    public getQueryParams = (item: IProject) => (<TasksSideBarQueryParams>{projectId: item.id});

    public getRouterLink = (item: IProject) => TasksRoutes.ByProject;

    get isProjectsListShown() {
        return getLastSegmentFromUrl(this._router) === TasksRoutes.ByProject;
    }

    constructor(protected _route: ActivatedRoute,
                protected _notifier: NotifierService,
                protected _router: Router) {
        this._route.queryParams.pipe(
            untilDestroyed(this),
        )
            .subscribe((params: TasksSideBarQueryParams) => {
                if (this.isProjectsListShown) {
                    this._navigateToProject();
                }
            });
    }

    public projectsLoaded(projects: IProject[]) {
        this._projects = projects;
        this._navigateToProject();
    }

    private _navigateToProject(): void {
        const queryParams = <TasksSideBarQueryParams>this._route.snapshot.queryParams;
        const projectId = queryParams && queryParams.projectId;
        const project = this._projects[0];

        if (projectId) {
            this._lastProjectId = projectId;
        }

        if (!projectId && project) {
            this._router.navigate([TasksRoutes.ByProject], {
                relativeTo: this._route,
                queryParams: {projectId: this._lastProjectId || project.id},
                queryParamsHandling: 'merge',
            }).then();
        }
    }

    ngOnDestroy() {
        // need for untilDestroy operator
    }
}
