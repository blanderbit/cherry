import { IErrorResponse } from 'projects/communication/src/lib/models/error-response';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IIdObject } from 'communication';
import { NotifierService } from 'notifier';
import { ICompany } from '../../../../projects/communication/src/lib/models/companies';
import { CompaniesProvider } from '../../../../projects/communication/src/lib/services/common/companies.provider';
import { acceptFile } from '../../helpers/const/regx';
import { ProfileService } from '../../identify/profile.service';
import { DashboardRoutes } from '../../pages/dashboard/dashboard.routes';
import { ITypedFormGroup } from '../../pages/settings/modules/company-settings/forms/holidays-form/holidays-form.component';
import { slideInFromRightAnimation } from '../animations';
import { AuthFormComponent } from '../auth-form';
import { AuthComponent } from '../auth.component';
import { aboutCerriUrl, subscriptionAgreementUrl } from '../auth.routes';

const dashedBorder = require('../../../assets/img/dashed.png');

interface ICreateCompanyData extends IIdObject {
    logo: string;
    name: string;
    acceptTerms: boolean;
}

@Component({
    selector: 'app-create-company',
    templateUrl: './create-company.component.html',
    styleUrls: ['./create-company.component.scss', '../auth.scss'],
    animations: [slideInFromRightAnimation]
})
export class CreateCompanyComponent extends AuthFormComponent<ICreateCompanyData> implements OnInit, OnDestroy {
    public accept = acceptFile;
    public dashedBorder = dashedBorder;
    public loadDataOnInit = false;
    public loadDataOnParamsChange = false;
    public isCompanyCreated = false;
    public logo: string;
    public subscriptionAgreementUrl = subscriptionAgreementUrl;
    public aboutCerriUrl = aboutCerriUrl;

    constructor(
        private parent: AuthComponent,
        protected _provider: CompaniesProvider,
        protected _profile: ProfileService,
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _notifier: NotifierService,
    ) {
        super();
        parent.showLogo = false;
        this.loadingHandler = parent;
    }

    ngOnDestroy(): void {
        this.parent.showLogo = true;
    }

    onImageSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files[0];

        if (file) {
            this.controls.logo.setValue(file);

            const reader = new FileReader();
            reader.onload = () => this.logo = reader.result as string;
            reader.readAsDataURL(file);
        }
    }

    protected createForm(): FormGroup {
        return new FormGroup({
            name: new FormControl(null, [
                Validators.required,
                Validators.minLength(1)
            ]),
            logo: new FormControl(),
            acceptTerms: new FormControl(false, [
                Validators.requiredTrue
            ]),
        } as ITypedFormGroup<ICreateCompanyData>, {
            updateOn: 'submit'
        });
    }

    protected _handleErrorCreate(error: IErrorResponse) {
        this.redirectToErrorPage();
    }

    protected _handleSuccessCreate(company: ICompany) {
        this.isCompanyCreated = true;

        this._profile.refreshToken({
            companyId: company.id,
        }).subscribe(
            () => this.navigateToDashboard(),
            () => this.isCompanyCreated = false
        );
    }
}
