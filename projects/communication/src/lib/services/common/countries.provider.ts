import { Provider } from '../common/provider';
import { ICurrency } from '../../models/currency';
import { ICountry } from '../../models/country';


export abstract class CountriesProvider extends Provider<ICountry> {
}
