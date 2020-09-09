import { RouterModule, Routes } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';
import { ProjectsComponent } from './projects/projects.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ProjectDetailsContainerComponent } from './details-wrapper/project-details-container.component';
import { TeamComponent } from './team/team.component';
import { ProjectDetailsComponent } from './details/project-details.component';
import { GanttComponent } from './gantt/gantt.component';
import { TaskDetailsComponent } from '../../common-tasks/task-details/task-details.component';
import { ProjectTasksComponent } from './project-tasks/project-tasks.component';
import { FilesComponent } from './files/files.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [MetaGuard],
        children: [
            {
                path: '',
                component: ProjectsComponent,
            },
            {
                path: 'gantt',
                component: GanttComponent,
            },
            {
                path: ':id',
                component: ProjectDetailsContainerComponent,
                children: [
                    {
                        path: '',
                        component: ProjectDetailsComponent,
                    },
                    {
                        path: 'tasks',
                        component: ProjectTasksComponent,
                    },
                    {
                        path: 'tasks/:id',
                        component: TaskDetailsComponent,
                    },
                    {
                        path: 'team',
                        component: TeamComponent,
                    },
                    {
                        path: 'files',
                        component: FilesComponent,
                    },
                ]
            },
        ],
    },
    {
        path: '',
        // pathMatch: 'prefix',
        component: SideMenuComponent,
        outlet: 'sideBar',
    },
];

export const ProjectsRoutes = RouterModule.forChild(routes);
