import { Provider } from '../common/provider';
import { PermissionsProvider } from './permissions.provider';
import { IPermission } from '../../models/permissions/permission.interface';

export abstract class SystemPermissionsProvider extends PermissionsProvider {
}
