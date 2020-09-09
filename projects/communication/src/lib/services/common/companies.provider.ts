import { Provider } from './provider';
import { ICompany } from '../../models/companies';
import { Observable } from 'rxjs';


export abstract class CompaniesProvider extends Provider<ICompany> {
    public logo$: Observable<string>;

    abstract updateLogo(companyId: string | number, file: any): Observable<any>;

    abstract emitUpdateLogo(): void;

    abstract getCurrentCompanyLogoUrl(): string;

    abstract getCompanyLogoUrlById(id: number): string;
}

