import { PermissionActionType } from 'communication';
import { InjectionToken } from '@angular/core';

export interface IPreviewPermission {
    downloadAction: PermissionActionType;
    deleteAction: PermissionActionType;
}

export const PreviewPermissions = new InjectionToken<IPreviewPermission>('Preview permissions');
