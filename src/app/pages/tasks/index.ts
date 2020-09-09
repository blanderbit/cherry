import { InjectionToken } from '@angular/core';

export const TasksList = new InjectionToken('Tasks List');

export const TasksRoutes = {
    My: 'my',
    All: 'all',
    ByProject: 'by-project'
};
