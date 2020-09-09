import {Component, OnInit} from '@angular/core';
import {DetailComponent} from 'components';
import {HolidaysPolicyProvider, HolidaysProvider, IHolidaysPolicy} from 'communication';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifierService} from 'notifier';
import {PARAM_KEYS} from '../keys';
import {ListComponent} from '../list/list.component';
import {finalize} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from '../../../../../ui/dialogs/confirm-dialog/confirm-dialog.component';
import {DashboardRoutes} from '../../../../dashboard/dashboard.routes';
import {SettingsRoutes} from '../../../settings-routes';

export interface IHolidaysQueryParams {
    year?: number;
}

@Component({
    selector: 'app-holidays-header',
    templateUrl: './holidays-header.component.html',
    styleUrls: ['./holidays-header.component.scss'],
})
export class HolidaysHeaderComponent extends DetailComponent<IHolidaysPolicy> implements OnInit {
    public loadDataOnParamsChange = true;
    public loadDataOnInit = false;
    public year: number;
    public holidaysUrl = `/${DashboardRoutes.Settings}/${SettingsRoutes.CompanySettings}/${SettingsRoutes.HolidaysPolicy}`;


    get showCopyButton(): boolean {
        return this.currentYear !== (+this.route.snapshot.queryParams.year);
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }

    get holidaysPolicyId() {
        return +this.route.snapshot.params[PARAM_KEYS.POLICY_ID];
    }

    constructor(protected _route: ActivatedRoute,
                protected _router: Router,
                protected _provider: HolidaysPolicyProvider,
                protected _holidaysProvider: HolidaysProvider,
                protected _notifier: NotifierService,
                protected _dialogService: NgbModal,
                public parent: ListComponent,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

        this.year = +(<IHolidaysQueryParams>this.route.snapshot.queryParams).year || this.currentYear;
        this.setQueryParams(this.year);
    }

    goToNextYear() {
        this.setQueryParams(++this.year);
    }

    goToPrevYear() {
        this.setQueryParams(--this.year);
    }

    onCopyHolidaysClick() {
        const instance = this._dialogService.open(ConfirmDialogComponent, {
            windowClass: 'modal-copy-holidays-dialog'});

            instance.componentInstance.year = this.year;
            instance.result
            .then(result => {
                this.copyHolidays();
            }).catch(() => {
        });
    }

    copyHolidays() {
        const hide = this.showLoading();

        this._holidaysProvider.copyHolidays({
            holidayPolicyId: this.holidaysPolicyId,
            sourceYear: this.year,
        }).pipe(
            finalize(hide),
        ).subscribe((
            res) => {
                this._notifier.showSuccess('action.copying-success');
            },
            err => {
                this._notifier.showError('action.copying-error');
            },
        );
    }

    protected _getItem(id?: any): Observable<IHolidaysPolicy> {
        const params = this.route.snapshot.params;
        id = +params[PARAM_KEYS.POLICY_ID];

        return super._getItem(id);
    }

    private setQueryParams(year: number) {
        this.router.navigate([], {
            queryParamsHandling: 'merge',
            queryParams: {
                year,
            } as IHolidaysQueryParams,
            replaceUrl: true,
        });
    }

    updateItem(value: string) {


        if (this.item.name != value) {
            this.item.name = value;
            this._provider.updateItem(this.item)
                .subscribe(
                    () => {
                        this._notifier.showSuccess('action.successfully-updated');

                    },
                    () => {
                        this._notifier.showError('action.update-error');
                    },
                );

        }
    }
}
