import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createCompanyUrl } from '../../../../../auth/auth.routes';
import { CompaniesProvider } from '../../../../../../../projects/communication/src/lib/services/common/companies.provider';
import { FormComponent, TranslateErrorHandler } from 'components';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICompany } from '../../../../../../../projects/communication/src/lib/models/companies';
import { ProfileService } from '../../../../../identify/profile.service';
import { NotifierService } from 'notifier';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-general-company-settings',
    templateUrl: 'general.component.html',
    styleUrls: ['general.component.scss'],
})
export class GeneralComponent extends FormComponent<ICompany> implements OnInit {
    needCreate = false;
    isMyCompany = false;
    errorHandler = new TranslateErrorHandler('errors');

    constructor(protected _router: Router,
                protected _route: ActivatedRoute,
                protected _provider: CompaniesProvider,
                protected _notifier: NotifierService,
                private _profileService: ProfileService) {
        super();
    }

    ngOnInit() {
      this.item = this._profileService.getCurrentCompany();
      this.isMyCompany = this.item.creatorId === this._profileService.id;
      super.ngOnInit();
    }

    protected createForm(): FormGroup {
        return new FormGroup({
            name: new FormControl(this.item.name, [
                Validators.required, Validators.minLength(1),
            ]),
        }, {
            updateOn: 'submit',
        });
    }

    protected _update(obj: ICompany): Observable<any> {
        return super._update(obj).pipe(
            switchMap(() => this._profileService.getMyCompanies())
        );
    }

    createCompany() {
        this._router.navigate([createCompanyUrl]).then();
    }
}
