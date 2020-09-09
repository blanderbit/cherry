import { RouterModule, Routes } from '@angular/router';
import { KanbanComponent } from './kanban.component';
import { ProjectKanbanBoardComponent } from './project-kanban-board/project-kanban-board.component';
import { KanbanSideMenuComponent } from './kanban-side-menu/kanban-side-menu.component';
import { KanbanProjectsComponent } from './kanban-projects/kanban-projects.component';
import { PermissionsGuard } from '../../identify/permissions.guard';

export const routes: Routes = [
    {
        path: '',
        component: KanbanComponent,
        canActivateChild: [PermissionsGuard],
        children: [
            {
                path: '',
                component: KanbanProjectsComponent,
            },
            {
                path: ':id',
                component: ProjectKanbanBoardComponent,
            },
        ],
    },
    {
        path: '',
        component: KanbanSideMenuComponent,
        outlet: 'sideBar',
    },
];

export const KanbanRoutingModule = RouterModule.forChild(routes);
