import { FakeProvider } from './fake.provider';
import { Helpers } from '../../../../../../src/app/helpers';
import { ICopyHolidaysParams, IHoliday } from 'communication';
import { HolidaysProvider } from '../common/holidays.provider';
import { Observable, throwError } from 'rxjs';

export abstract class FakeHolidaysProvider extends FakeProvider<IHoliday> implements HolidaysProvider {
    protected _getItems(params = {}): IHoliday[] {
        return generateFakeHolidays(200);
    }

    itemsFilter(item: IHoliday) {
        const policyId = (<any>this._getItemsParams) && this._getItemsParams.policyId;
        return item.holidayPolicyId === +policyId;
    }

    copyHolidays(params: ICopyHolidaysParams): Observable<IHoliday[]> {
        return throwError('Not implemented');
    }
}

const HOLIDAY_NAMES = [
    'New Year Day',
    'Valentine\'s Day',
    'Christmas',
    'Paska dey',
    'Funeral day',
    'The end of the world day',
];

function generateFakeHolidays(amount: number): IHoliday[] {
    return new Array(amount).fill('')
        .map((v, index) => ({
            holidayPolicyId: Helpers.getRandomInteger(1, 10),
            id: index + 1,
            name: HOLIDAY_NAMES[Helpers.getRandomInteger(0, HOLIDAY_NAMES.length - 1)],
            date: new Date().setFullYear(Helpers.getRandomInteger(2010, 2020)),
        }));
}
