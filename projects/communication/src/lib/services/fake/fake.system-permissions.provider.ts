import { IPermission, PermissionValue } from '../../models';
import { PermissionsProvider } from '../common/permissions.provider';
import { Observable, of } from 'rxjs';
import { FakePermissionsProvider } from './fake.permissions.provider';
import { PermissionsSystemLevelAction } from '../../models/permissions/system-permissions-actions';

// system permissions can have only two values - Allow or Deny
const SYSTEM_PERMISSIONS: IPermission[] = [
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.CreateSkill,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.DeleteSkill,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.UpdateSkill,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ReviewGenericResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ReviewMaterialResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ReviewHumanResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ViewLocations,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ViewHolidayPolicies,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ViewResourceType,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ViewSkills,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.CreateLocation,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.UpdateLocation,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.DeleteLocation,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.CreateHolidayPolicy,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.DeleteHolidayPolicy,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.UpdateHolidayPolicy,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.CreateHoliday,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.DeleteHoliday,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.UpdateHoliday,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.CreateResourceType,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.DeleteResourceType,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.UpdateResourceType,
        value: PermissionValue.Allow,
    },

    {
        id: 1,
        actionId: PermissionsSystemLevelAction.UpdateGenericResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.DeleteGenericResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.CreateGenericResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.SearchGenericResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.UpdateMaterialResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.DeleteMaterialResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.CreateMaterialResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.SearchMaterialResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.UpdateHumanResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.CreateHumanResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.SearchHumanResource,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ChangePhoto,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.UpdateProfile,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ViewProfile,
        value: PermissionValue.Allow,
    },

    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ViewSettingsApp,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ViewTaskApp,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ViewProjectApp,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ViewTimeApp,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.kanban,
        value: PermissionValue.Allow,
    },
    {
        id: 1,
        actionId: PermissionsSystemLevelAction.ViewResourceApp,
        value: PermissionValue.Allow,
    },
];

export class FakeSystemPermissionsProvider extends FakePermissionsProvider implements PermissionsProvider {
    getItems(params?): Observable<IPermission[]> {
        return of(SYSTEM_PERMISSIONS);
    }
}

