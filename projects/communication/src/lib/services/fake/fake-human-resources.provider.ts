import { Provider } from '../common/provider';
import { HumanResourceStatus, IHumanResource, ResourceKind } from '../../models/resource';
import { Helpers } from '../../../../../../src/app/helpers';
import { FakeResourcesProvider } from './fake-resources.provider';

export class FakeHumanResourcesProvider extends FakeResourcesProvider<IHumanResource> implements Provider<IHumanResource> {
    protected _getItems(): IHumanResource[] {
        return new Array(10).fill('').map((i, id) =>
            ({
                id,
                firstName: `first ${id}`,
                lastName: `last ${id}`,
                name: getUserFullName({firstName: `first ${id}`, lastName: `last ${id}`}),
                email: 'emil@test.com',
                phone: '00000000',
                responsible: 1,
                skills: [],
                type: Helpers.getRandomInteger(0, 5),
                code: i.toString(),
                kind: ResourceKind.Human,
                locationId: 1,
                status: HumanResourceStatus.Active,
                apps: [],
            }));
    }
}

function getUserFullName(user: { firstName: string, lastName: string }) {
    if (user) {
        return `${user.firstName} ${user.lastName}`;
    }
}
