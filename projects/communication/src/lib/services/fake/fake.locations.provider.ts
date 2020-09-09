import { FakeProvider } from './fake.provider';
import { getEnumKeys } from '../../../../../../src/app/components/getEnumKeys';
import { LocationsProvider } from '../common/locations.provider';
import { Country } from '../../fake-data/country.enum';
import { ILocation } from '../../models/location';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Helpers } from '../../../../../../src/app/helpers';

export abstract class FakeLocationsProvider extends FakeProvider<ILocation> implements LocationsProvider {

    getItems(params): Observable<ILocation[]> {
        const { search = null } = params || {};

        return super.getItems()
            .pipe(map(items => search ? items.filter(({ name }) => name.includes(search)) : items));
    }

    protected _getItems(params = {}): ILocation[] {
        const countries = getEnumKeys(Country);
        return countries.map(name => ({
            name,
            id: name,
            countryId: countries[Helpers.getRandomInteger(0, countries.length - 1)],
            address: name,
            holidayPolicyId: 1,
        }));
    }
}
