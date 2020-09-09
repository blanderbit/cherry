import { Provider } from '../common/provider';
import { IMaterialResource, MaterialResourceStatus, ResourceKind } from '../../models/resource';
import { FakeResourcesProvider } from './fake-resources.provider';

export class FakeMaterialResourcesProvider extends FakeResourcesProvider<IMaterialResource> implements Provider<IMaterialResource> {
    protected _getItems(): IMaterialResource[] {
        return new Array(10).fill('').map((i, id) =>
            ({
                id,
                name: `Material name ${id}`,
                firstName: 'John',
                lastName: 'Cena',
                email: 'strong-man@yshatau.com',
                responsible: 1,
                code: i.toString(),
                kind: ResourceKind.Generic,
                status: MaterialResourceStatus.Active,
                location: 'location',
                locationId: 0
            }));
    }
}
