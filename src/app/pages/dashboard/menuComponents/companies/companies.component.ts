import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ICompany} from '../../../../../../projects/communication/src/lib/models/companies';
import {LoadingComponent} from 'components';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {createCompanyUrl} from '../../../../auth/auth.routes';
import {ProfileService} from '../../../../identify/profile.service';
import {CompaniesProvider} from '../../../../../../projects/communication/src/lib/services/common/companies.provider';

@Component({
    selector: 'app-companies',
    templateUrl: 'companies.component.html',
    styleUrls: ['companies.component.scss', '../menuComponents.scss'],
})
export class CompaniesComponent extends LoadingComponent<ICompany> implements OnInit {
    @Output() hide = new EventEmitter<any>();
    canCreateCompany = false;
    loadDataOnInit = false;
    items: ICompany[];
    readonly defaultLogo = require('src/assets/images/company.svg');

    constructor(protected _profile: ProfileService,
                protected _companiesProvider: CompaniesProvider,
                protected _router: Router,
                protected _route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.items = this._profile.companies;
        this.canCreateCompany = this._canCreateCompany();
    }

    onHide() {
        this.hide.emit();
    }

    selectCompany(company: ICompany) {
        const hide = this.showLoading();

        this._profile.selectCompany(company.id)
            .pipe(finalize(hide))
            .subscribe(() => {
                this._companiesProvider.emitUpdateLogo();
                this.hide.emit();
            });
    }

    createCompany() {
        this._router.navigate([createCompanyUrl]).then();
    }

    canUpdateCompany(company: ICompany, logoUrl?): boolean {
        return company.creatorId === this._profile.id && logoUrl == this.defaultLogo;
    }

    private _canCreateCompany(): boolean {
        return this.items.every(company => this._profile.id !== company.creatorId);
    }
}
