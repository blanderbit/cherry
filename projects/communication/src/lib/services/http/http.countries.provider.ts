import { Observable, throwError } from 'rxjs';
import { HttpProvider } from './http.provider';
import { CountriesProvider } from '../common/countries.provider';
import { ICountry } from '../../models/country';
import { CommunicationConfig, ExcludeId } from 'communication';
import { IPaginationParams } from '../../models/pagination';

const COUNTRIES_PAGE_SIZE = 1000;

export abstract class HttpCountriesProvider extends HttpProvider<ICountry> implements CountriesProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.settings}/countries`;
    }

    getItems(obj?: IPaginationParams): Observable<ICountry[]> {
        return super.getItems({
            take: COUNTRIES_PAGE_SIZE,
            ...obj,
        });
    }

    createItem(item: ExcludeId<ICountry>, options?: any): Observable<any> {
        return throwError('Not available');
    }

    updateItem(item: ICountry): Observable<any> {
        return throwError('Not available');
    }

    deleteItem(id: number | string): Observable<any> {
        return throwError('Not implemented');
    }
}
