import { Provider } from './provider';
import { IResource, ResourceKind } from '../../models/resource';
import { Observable } from 'rxjs';
import {IIds} from "./attachments.provider";

export abstract class ResourcesProvider extends Provider<IResource> {
    static isHumanResource(resource: IResource) {
        return resource.kind === ResourceKind.Human;
    }

    abstract getPhotoUrl(id: number | string): string;

    abstract uploadPhoto(id, data, reportProgress?: boolean): Observable<any>;

    abstract getAssignedItemsById(options?: IIds): Observable<any>;
}
