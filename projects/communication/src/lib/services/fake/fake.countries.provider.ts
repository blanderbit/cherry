import { FakeProvider } from './fake.provider';
import { getEnumKeys } from '../../../../../../src/app/components/getEnumKeys';
import { LocationsProvider } from '../common/locations.provider';
import { Country } from '../../fake-data/country.enum';
import { ILocation } from '../../models/location';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Helpers } from '../../../../../../src/app/helpers';
import { CountriesProvider } from '../common/countries.provider';
import { ICountry } from '../../models/country';

export abstract class FakeCountriesProvider extends FakeProvider<ICountry> implements CountriesProvider {

    getItems(params): Observable<ICountry[]> {
        const {search = null} = params || {};

        return super.getItems()
            .pipe(map(items => search ? items.filter(({name}) => name.includes(search)) : items));
    }

    protected _getItems(params = {}): ICountry[] {
        const countries = getEnumKeys(Country);
        return countries.map((name, index) => ({
            name,
            id: index,
        }));
    }
}
