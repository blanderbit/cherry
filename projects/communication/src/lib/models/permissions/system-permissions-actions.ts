
export const AppPermissionsActions = {
    task: 'task',
    time: 'time',
    gantt: 'gantt',
    project: 'project',
    calendar: 'calendar',
    resource: 'resource',
    kanban: 'kanban'
};

export const PermissionsSystemProjectAction = {
    ViewProjectApp: AppPermissionsActions.project,
    CreateProject: 'CreateProject',
};

export const PermissionsSystemTasksAction = {
    ViewTaskApp: AppPermissionsActions.task,
    ViewMyTasks: 'ViewMyTasks',
    ViewAllTasks: 'ViewAllTasks',
    ViewTasksByProject: 'ViewTasksByProject',
};

export const PermissionsProfileAction = {
    ViewProfile: 'ViewProfile',
    UpdateProfile: 'UpdateProfile',
    ChangePhoto: 'ChangePhoto',
};

export const PermissionsHumanResourcesAction = {
    SearchHumanResource: 'SearchHumanResource',
    ReviewHumanResource: 'ReviewHumanResource',
    CreateHumanResource: 'CreateHumanResource',
    UpdateHumanResource: 'UpdateHumanResource',
};

export const PermissionsMaterialResourcesAction = {
    SearchMaterialResource: 'SearchMaterialResource',
    ReviewMaterialResource: 'ReviewMaterialResource',
    CreateMaterialResource: 'CreateMaterialResource',
    UpdateMaterialResource: 'UpdateMaterialResource',
    DeleteMaterialResource: 'DeleteMaterialResource',
};

export const PermissionsGenericResourcesAction = {
    SearchGenericResource: 'SearchGenericResource',
    ReviewGenericResource: 'ReviewGenericResource',
    CreateGenericResource: 'CreateGenericResource',
    UpdateGenericResource: 'UpdateGenericResource',
    DeleteGenericResource: 'DeleteGenericResource',
};

export const PermissionsResourcesAction = {
    ViewResourceApp: AppPermissionsActions.resource,
    ...PermissionsHumanResourcesAction,
    ...PermissionsMaterialResourcesAction,
    ...PermissionsGenericResourcesAction,
};

export const PermissionsSkillsAction = {
    ViewSkills: 'ViewSkills',
    CreateSkill: 'CreateSkill',
    UpdateSkill: 'UpdateSkill',
    DeleteSkill: 'DeleteSkill',
};

export const PermissionsResourceTypesAction = {
    ViewResourceType: 'ViewResourceType',
    CreateResourceType: 'CreateResourceType',
    UpdateResourceType: 'UpdateResourceType',
    DeleteResourceType: 'DeleteResourceType',
};

export const PermissionsHolidaysPolicyAction = {
    ViewHolidayPolicies: 'ViewHolidayPolicies',
    CreateHolidayPolicy: 'CreateHolidayPolicy',
    UpdateHolidayPolicy: 'UpdateHolidayPolicy',
    DeleteHolidayPolicy: 'DeleteHolidayPolicy',
};

export const PermissionsHolidayAction = {
    ViewHolidays: 'ViewHolidays',
    CreateHoliday: 'CreateHoliday',
    CopyHolidays: 'CopyHolidays',
    UpdateHoliday: 'UpdateHoliday',
    DeleteHoliday: 'DeleteHoliday',
};

export const PermissionsLocationsAction = {
    ViewLocations: 'ViewLocations',
    CreateLocation: 'CreateLocation',
    UpdateLocation: 'UpdateLocation',
    DeleteLocation: 'DeleteLocation',
};

export const PermissionsCurrenciesAction = {
    ViewCurrencies: 'ViewCurrencies',
};

export const PermissionsCountriesAction = {
    ViewCountries: 'ViewCountries',
};

export const PermissionsSettingsAppAction = {
    ViewSettingsApp: 'ViewSettingsApp',
};

export const PermissionsTimeAppAction = {
    ViewTimeApp: AppPermissionsActions.time,
};

export const PermissionsKanbanAction = {
    ViewKanban: AppPermissionsActions.kanban,
};

export const PermissionsResourcesAppAction = {

};

export const PermissionsRolesAction = {
    ViewRoles: 'ViewRoles',
    CreateRole: 'CreateRole',
    UpdateRole: 'UpdateRole',
    DeleteRole: 'DeleteRole',
};

export const PermissionsAction = {
    ViewPermissions: 'ViewPermissions',
    CreatePermission: 'CreatePermission',
    UpdatePermissionValue: 'UpdatePermissionValue',
    DeletePermission: 'DeletePermission',
};

export const CustomPermissionsAction = {
  ViewGeneralCompanySettings: 'ViewGeneralCompanySettings'
};

export const PermissionsSystemLevelAction = {
    ...PermissionsAction,
    ...PermissionsRolesAction,
    ...PermissionsCountriesAction,
    ...PermissionsCurrenciesAction,
    ...PermissionsLocationsAction,
    ...PermissionsHolidayAction,
    ...PermissionsHolidaysPolicyAction,
    ...PermissionsResourceTypesAction,
    ...PermissionsSkillsAction,
    ...PermissionsResourcesAction,
    ...PermissionsSystemProjectAction,
    ...PermissionsProfileAction,
    ...PermissionsSystemTasksAction,
    ...PermissionsSettingsAppAction,
    ...PermissionsTimeAppAction,
    ...PermissionsKanbanAction,
    ...PermissionsResourcesAppAction,
    ...AppPermissionsActions,
    ...CustomPermissionsAction
};

export type SystemPermissionsAction = (typeof PermissionsSystemLevelAction)[keyof typeof PermissionsSystemLevelAction];
export type AppPermissionsAction = keyof typeof AppPermissionsActions;
