import { FakeProvider } from './fake.provider';
import { HolidaysPolicyProvider } from '../common/holidays-policy.provider';
import { Helpers } from '../../../../../../src/app/helpers';
import { IHolidaysPolicy } from '../../models/holidays-policy';
import { getEnumKeys } from '../../../../../../src/app/components/getEnumKeys';
import { Country } from '../../fake-data/country.enum';
import { Observable } from 'rxjs';

export abstract class FakeHolidaysPolicyProvider extends FakeProvider<IHolidaysPolicy> implements HolidaysPolicyProvider {
    protected _getItems(params = {}): IHolidaysPolicy[] {
        return generateFakeHolidays(100);
    }

    updateItem(item: IHolidaysPolicy): Observable<IHolidaysPolicy> {
        return super.updateItem(item);
    }
}

const HOLIDAY_POLICY_NAMES = [
    'First holidays policy',
    'Second holidays policy',
    'Third holidays policy',
    'Forth holidays policy',
    'Fifth holidays policy',
];

function generateFakeHolidays(amount: number): IHolidaysPolicy[] {
    const countries = getEnumKeys(Country);

    return new Array(amount).fill('')
        .map((v, index) => ({
            id: index + 1,
            name: HOLIDAY_POLICY_NAMES[Helpers.getRandomInteger(0, HOLIDAY_POLICY_NAMES.length - 1)],
            countryId: countries[Helpers.getRandomInteger(0, countries.length - 1)],
        }));
}
