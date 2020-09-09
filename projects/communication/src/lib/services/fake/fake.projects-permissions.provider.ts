import { PermissionsProvider } from '../common/permissions.provider';
import { Observable, of } from 'rxjs';
import { FakePermissionsProvider } from './fake.permissions.provider';
import { IPermission } from '../../models/permissions/permission.interface';
import { PermissionValue } from '../../models/permissions/permission-value.enum';
import { PermissionAction } from '../../models/permissions/permission-action';


const PROJECT_PERMISSIONS: IPermission[] = [
    {
        id: 1,
        actionId: 'CreateProject',
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: 'ViewAssignments',
        value: PermissionValue.Deny,
    },
    {
        id: 1,
        actionId: 'DeleteTask',
        value: PermissionValue.NotSet,
    },
    {
        id: 1,
        actionId: 'UpdateTask',
        value: PermissionValue.Own,
    },
    {
        id: 1,
        actionId: 'UpdateActualTime',
        value: PermissionValue.Own,
    },
    {
        id: 1,
        actionId: PermissionAction.AddMember,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionAction.DeleteMember,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionAction.UpdateMemberRole,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionAction.ViewMembers,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionAction.UpdateProjectStatus,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionAction.UpdateProject,
        value: PermissionValue.Own,
    },
    {
        id: 1,
        actionId: PermissionAction.ReviewGanttPlan,
        value: PermissionValue.Allow,
    },
];

export class FakeProjectsPermissionsProvider extends FakePermissionsProvider implements PermissionsProvider {
    getItems(params?): Observable<IPermission[]> {
        return of(PROJECT_PERMISSIONS);
    }
}
