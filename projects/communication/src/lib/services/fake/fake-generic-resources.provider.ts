import { Provider } from '../common/provider';
import { GenericResourceStatus, IGenericResource, ResourceKind } from '../../models/resource';
import { FakeResourcesProvider } from './fake-resources.provider';

export class FakeGenericResourcesProvider extends FakeResourcesProvider<IGenericResource> implements Provider<IGenericResource> {

    protected _getItems(): IGenericResource[] {
        return new Array(10).fill('').map((i, id) =>
            ({
                id,
                kind: ResourceKind.Generic,
                name: `Generic name ${id}`,
                firstName: 'John',
                lastName: 'Cena',
                email: 'strong-man@yshatau.com',
                code: id.toString(),
                internalRate: { value: 25000, currency: 0 },
                billableRate: { value: 25000, currency: 0 },
                status: GenericResourceStatus.Active,
                location: 'location',
            }));
    }
}
