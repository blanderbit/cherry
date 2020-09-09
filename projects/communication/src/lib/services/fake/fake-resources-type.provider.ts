import { IResourceType } from '../../models/resource-type';
import { FakeProvider } from './fake.provider';
import { Helpers } from '../../../../../../src/app/helpers';

export abstract class FakeResourcesTypeProvider extends FakeProvider<IResourceType> {
    protected _getItems(): IResourceType[] {
        return Array.from(new Array(10), (v, id) => (
            {
                id,
                name: `Type ${id}`,
                rate: Helpers.getRandomInteger(8, 100),
                currency: Helpers.getRandomInteger(0, 4),
            }
        ));
    }
}
