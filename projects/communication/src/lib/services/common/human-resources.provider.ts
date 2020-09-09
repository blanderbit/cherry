import { Provider } from './provider';
import { IHumanResource, IUpdateHumanResourceStatus } from '../../models/resource';
import { Observable } from 'rxjs';

export abstract class HumanResourcesProvider extends Provider<IHumanResource> {
    abstract getRoles(): Observable<string[]>;

    abstract getAvatarUrl(id: number | string): string;

    abstract uploadAvatar(data, id);

    abstract updateStatus(data: IUpdateHumanResourceStatus): Observable<any>;
}
