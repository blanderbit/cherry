export const ProjectGanttAction = {
    ReviewGanttPlan: 'ReviewGanttPlan',
    EditGanttPlan: 'EditGanttPlan',
};

export const PermissionsProjectAction = {
    UpdateProject: 'UpdateProject',
    UpdateProjectStatus: 'UpdateProjectStatus',
    DeleteProject: 'DeleteProject',
    ViewProjects: 'ViewProjects',
    ViewProjectById: 'ViewProjectById',
};

export const PermissionsProjectMembersAction = {
    AddMember: 'AddMember',
    UpdateMemberRole: 'UpdateMemberRole',
    DeleteMember: 'DeleteMember',
    ViewMembers: 'ViewMembers',
};

export const PermissionsTasksAction = {
    CreateTask: 'CreateTask',
    UpdateTask: 'UpdateTask',
    UpdateTaskStatus: 'UpdateTaskStatus',
    UpdateTaskDates: 'UpdateTaskDates',
    DeleteTask: 'DeleteTask',
    SetTaskWorkCompleted: 'SetTaskWorkCompleted',
    ViewTaskById: 'ViewTaskById',
    ViewActiveTasks: 'ViewActiveTasks',
    ViewTaskProgress: 'ViewTaskProgress',
    ViewTaskCardActualTime: 'ViewTaskCardActualTime',
    ViewTaskCardPlannedTime: 'ViewTaskCardPlannedTime',
    ViewTaskDates: 'ViewTaskDates',
    ViewTaskPhases: 'ViewTaskPhases',
    ViewTaskDependencies: 'ViewTaskDependencies',
    ViewTaskWBS: 'ViewTaskWBS'
};

export const PermissionsTasksGridAction = {
    ViewTaskGridActualTime: 'ViewTaskGridActualTime',
    ViewTaskGridPlannedTime: 'ViewTaskGridPlannedTime',
};

export const PermissionsDeliverableActions = {
    CreateDeliverable: 'CreateDeliverable',
    UpdateDeliverable: 'UpdateDeliverable',
    UpdateDeliverableStatus: 'UpdateDeliverableStatus',
    UpdateDeliverableDate: 'UpdateDeliverableDate',
    DeleteDeliverable: 'DeleteDeliverable',
};

export const PermissionsAssignmentsAction = {
    CreateAssignments: 'CreateAssignments',
    UpdateAssignmentPlanEffort: 'UpdateAssignmentPlanEffort',
    UpdateAssignmentStatus: 'UpdateAssignmentStatus',
    DeleteAssignment: 'DeleteAssignment',
    ViewAssignments: 'ViewAssignments',
    GetAssignmentsCount: 'GetAssignmentsCount',
    ViewAssignmentActualTime: 'ViewAssignmentPlannedTime',
    ViewAssignmentPlannedTime: 'ViewAssignmentPlannedTime'
};

export const PermissionsActualTimeAction = {
    CreateActualTime: 'CreateActualTime',
    UpdateActualTime: 'UpdateActualTime',
    DeleteActualTime: 'DeleteActualTime',
    ViewActualTimes: 'ViewActualTimes',
};

export const PermissionsCommentsAction = {
    CreateComment: 'CreateComment',
    UpdateComment: 'UpdateComment',
    DeleteComment: 'DeleteComment',
    ViewComments: 'ViewComments',
};

export const PermissionsTaskActivityTypeAction = {
    CreateActivityType: 'CreateActivityType',
    UpdateActivityType: 'UpdateActivityType',
    DeleteActivityType: 'DeleteActivityType',
    ViewActivityType: 'ViewActivityType',
    ChangeTaskActivityType: 'ChangeTaskActivityType',
};

export const PermissionsTaskPriorityAction = {
    CreatePriority: 'CreatePriority',
    UpdatePriority: 'UpdatePriority',
    DeletePriority: 'DeletePriority',
    ViewPriority: 'ViewPriority',
    ChangeTaskPriority: 'ChangeTaskPriority',
};

export const PermissionsAttachmentsAction = {
    AttachFile: 'AttachFile',
    AttachLink: 'AttachLink',
    UpdateAttachment: 'UpdateAttachment',
    DeleteAttachment: 'DeleteAttachment',
    DownloadAttachedFile: 'DownloadAttachedFile',
    ViewAttachments: 'ViewAttachments',
    AttachFileToTask: 'AttachFileToTask',
    AttachLinkToTask: 'AttachLinkToTask',
    AttachFileToProject: 'AttachFileToProject',
    AttachLinkToProject: 'AttachLinkToProject',
    DeleteAttachmentFromTask: 'DeleteAttachmentFromTask',
    DeleteAttachmentFromProject: 'DeleteAttachmentFromProject',
    DownloadTaskAttachment: 'DownloadTaskAttachment',
    DownloadProjectAttachment: 'DownloadProjectAttachment',
    PreviewTaskAttachment: 'PreviewTaskAttachment',
    PreviewProjectAttachment: 'PreviewProjectAttachment',
};

export const PermissionsProjectsAction = {
    ...PermissionsProjectAction,
    ...PermissionsProjectMembersAction,
    ...ProjectGanttAction,
};

export const PermissionsTaskAction = {
    ...PermissionsTaskPriorityAction,
    ...PermissionsTaskActivityTypeAction,
    ...PermissionsCommentsAction,
    ...PermissionsActualTimeAction,
    ...PermissionsAssignmentsAction,
    ...PermissionsDeliverableActions,
    ...PermissionsTasksAction,
    ...PermissionsTasksGridAction,
};

export const PermissionsProjectLevelAction = {
    ...PermissionsProjectsAction,
    ...PermissionsTaskAction,
    ...PermissionsTasksGridAction,
    ...PermissionsAttachmentsAction
};

export type ProjectPermissionsAction = (typeof PermissionsProjectLevelAction)[keyof typeof PermissionsProjectLevelAction];
