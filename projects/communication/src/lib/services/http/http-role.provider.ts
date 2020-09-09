import { IRole } from '../../models/permissions/role.interface';
import { HttpProvider } from './http.provider';

export abstract class HttpRoleProvider extends HttpProvider<IRole> {

}
