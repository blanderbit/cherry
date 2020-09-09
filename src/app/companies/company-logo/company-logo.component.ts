import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { acceptFile } from '../../helpers/const/regx';
import { CompaniesProvider } from '../../../../projects/communication/src/lib/services/common/companies.provider';
import { NotifierService } from 'notifier';
import { ProfileService } from '../../identify/profile.service';
import { ICompany } from '../../../../projects/communication/src/lib/models/companies';

@Component({
    selector: 'app-company-logo',
    templateUrl: 'company-logo.component.html',
    styleUrls: ['company-logo.component.scss'],
})
export class CompanyLogoComponent implements OnInit {
    @Input() companyId: number;
    @Input() size = 40;
    @Input() canLoad = false;
    @Input() showLoadButton = true;

    @ViewChild('fileInput', {static: false}) private _fileInput;

    public logoUrl = '';
    public errorLoad = false;
    public accept = acceptFile;
    readonly defaultLogo = require('../../../assets/images/company.svg');

    get showLoadLogoButton() {
        return this.canLoad && this.errorLoad && this.showLoadButton;
    }

    constructor(private profileService: ProfileService,
                private companiesProvider: CompaniesProvider,
                private notifier: NotifierService) {
    }

    ngOnInit() {
        if (!this.companyId) {
            this.companiesProvider.logo$
                .subscribe((url) => {
                    this.errorLoad = false;
                    this.logoUrl = url;
                });
        } else {
            this.logoUrl = this.companiesProvider.getCompanyLogoUrlById(this.companyId);
        }
    }

    onLoadImageError() {
        this.errorLoad = true;
        this.logoUrl = this.defaultLogo;
    }

    onImageSelect(event: Event): void {
        const target = event.target as HTMLInputElement;
        const file = target.files[0];

        this.companiesProvider.updateLogo(this.companyId, file)
            .subscribe(() => {
                const reader = new FileReader();

                reader.onload = () => {
                    this.logoUrl = reader.result as string;
                    this.errorLoad = false;
                };
                reader.readAsDataURL(file);
            }, error => {
                this.notifier.showError(error, 'Failed to load image');
            });
    }

    loadImage(): void {
        if (!this.canLoad || !this.companyId) return;

        this._fileInput.nativeElement.click();
    }
}
