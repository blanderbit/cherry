import { HttpProvider } from './http.provider';
import { ICompany } from '../../models/companies';
import { CompaniesProvider } from '../common/companies.provider';
import { CommunicationConfig, ExcludeId } from 'communication';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export abstract class HttpCompaniesProvider extends HttpProvider<ICompany> implements CompaniesProvider {
    private _logo$ = new BehaviorSubject<string>(this.getCurrentCompanyLogoUrl());
    public logo$: Observable<string> = this._logo$.asObservable();

    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.companies}/companies`;
    }

    createItem(item: ExcludeId<ICompany>, options?: any): Observable<ICompany> {
        const formData = new FormData();

        formData.append('name', item.name);
        formData.append('logo', item.logo);

        return super.createItem(formData as unknown as ICompany, options);
    }

    getItems(obj?: {search: string}): Observable<ICompany[]> {
        return super.getItems(obj);
    }

    updateLogo(companyId: string | number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this._http.post(this._concatUrl(companyId, 'logos'), formData).pipe(
            tap(() => this.emitUpdateLogo()),
        );
    }

    getCurrentCompanyLogoUrl(): any {
        return getUniqueImageUrl(this._concatUrl('logo'));
    }

    getCompanyLogoUrlById(id: number): string {
        return getUniqueImageUrl(this._concatUrl(id, 'logos'));
    }

    emitUpdateLogo() {
        this._logo$.next(this.getCurrentCompanyLogoUrl());
    }
}

function getUniqueImageUrl(url: string): string {
    return `${url}?${new Date().getTime()}`;
}
