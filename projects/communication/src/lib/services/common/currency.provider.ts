import { Provider } from '../common/provider';
import { ICurrency } from '../../models/currency';


export abstract class CurrencyProvider extends Provider<ICurrency> {
}
