import { FakeProvider } from './fake.provider';
import { Provider } from '../common/provider';
import { ResourceKind } from '../../models/resource';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IIdObject } from 'communication';
import { PaginationResponse } from '../../models/pagination';

export class FakeResourcesProvider<T extends IIdObject> extends FakeProvider<T> implements Provider<T> {
    public getItems(params: any): Observable<T[]> {
        const search = (params || {}).search || '';
        return super.getItems()
            .pipe(
                map(v => v.filter((resource: any) => resource.name.includes(search))),
            );
    }

    protected _getItems(): T[] {
        return new Array(10).fill('').map((i, id) =>
            (<any>{
                id,
                name: `Resource name ${id}`,
                kind: ResourceKind.Human,
                code: i.toString(),
                status: 1,
            }));
    }
}
