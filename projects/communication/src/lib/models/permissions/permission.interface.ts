import { IIdObject } from '../id.object';
import { PermissionValue } from './permission-value.enum';
import { PermissionActionType } from './permission-action';

export interface IPermission extends IIdObject {
    actionId: PermissionActionType;
    value: PermissionValue;
}
