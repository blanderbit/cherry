import {FakeProvider} from './fake.provider';
import {getEnumKeys} from '../../../../../../src/app/components/getEnumKeys';
import {CurrencyProvider} from '../common/currency.provider';
import {ICurrency} from '../../models/currency';

export enum Currency {
    EUR,
    USD,
    GBP,
    CHF,
    AUD,
    CAD,
}


export abstract class FakeCurrencyProvider extends FakeProvider<ICurrency> implements CurrencyProvider {
    protected _getItems(params = {}): ICurrency[] {
        return getEnumKeys(Currency).map(name => ({name, code: name.toLowerCase(), id: name}));
    }
}
