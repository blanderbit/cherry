import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotifierService } from 'notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsComponent } from 'components';
import { ICompany } from '../../../../projects/communication/src/lib/models/companies';
import { AuthComponent } from '../auth.component';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, finalize, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProfileService } from '../../identify/profile.service';
import { CompaniesProvider } from '../../../../projects/communication/src/lib/services/common/companies.provider';

@Component({
    selector: 'app-select-company',
    templateUrl: './select-company.component.html',
    styleUrls: ['./select-company.component.scss'],
})
export class SelectCompanyComponent extends ItemsComponent<ICompany> implements OnInit, OnDestroy {
    public searchControl = new FormControl();
    public filteredItems: ICompany[] = [];

    constructor(
        protected _notifier: NotifierService,
        protected _route: ActivatedRoute,
        protected _router: Router,
        private _companiesProvider: CompaniesProvider,
        public _profileService: ProfileService,
        public parent: AuthComponent,
    ) {
        super();
        parent.showLogo = false;

        this.searchControl.valueChanges
            .pipe(
                startWith(''),
                debounceTime(300),
                distinctUntilChanged(),
            ).subscribe(searchTerm => {
            this.filteredItems = this.search(searchTerm);
        });
    }

    protected _getItems(params?): Observable<ICompany[]> {
        return this._profileService.getMyCompanies();
    }

    protected _handleResponse(response: ICompany[]) {
        this.filteredItems = response.map(company => {
            return {
                ...company,
                logoUrl: this._companiesProvider.getCompanyLogoUrlById(company.id),
            };
        });

        super._handleResponse(this.filteredItems);
    }

    search(str: string) {
        return this.items.filter(item => item.name.toLowerCase().includes(str.toLowerCase()));
    }

    public trackBy(index: number, item: ICompany) {
        return item.id;
    }

    public selectCompany(company: ICompany) {
        const hide = this.showLoading();

        this._profileService.selectCompany(company.id).pipe(
            catchError((error) => {
                this.notifier.showError(`Failed to login to company ${company.name}`);
                return error;
            }),
            finalize(hide),
        ).subscribe();

    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.parent.showLogo = true;
    }
}
