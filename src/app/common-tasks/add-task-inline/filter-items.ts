import { InjectionToken, Provider } from '@angular/core';
import { ListPermissionsFactory } from '../../permissions/list-permissions-factory';
import { PermissionAction, TaskType } from 'communication';
import { PermissionsService } from 'permissions';

const TASK_TYPES_ITEMS = [
    { title: 'task', value: TaskType.Task, permissionAction: PermissionAction.CreateTask },
    { title: 'delivery', value: TaskType.Deliverable, permissionAction: PermissionAction.CreateDeliverable },
];

export const TaskTypesItems = new InjectionToken('Tasks filter items');

export const TASK_TYPES_PROVIDER: Provider = {
        provide: TaskTypesItems,
        useFactory: ListPermissionsFactory(TASK_TYPES_ITEMS),
        deps: [PermissionsService],
};

