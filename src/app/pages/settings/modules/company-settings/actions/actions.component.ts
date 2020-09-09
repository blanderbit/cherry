import { Component, Inject, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';
import { Provider } from 'communication';
import { NotifierService } from 'notifier';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CompanySettingsPermissions, PARAM_KEYS } from '../keys';
import { finalize } from 'rxjs/operators';
import { ListComponent } from '../list/list.component';
import { ILoadingHandler } from 'components';
import { ICompanySettingsPermissions } from '../models/permissions';

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements ICellRendererAngularComp, OnDestroy {
    private params: any;
    private editId: number;

    get loading() {
        return this.loadingHandler.loading;
    }

    constructor(private _provider: Provider,
                private _router: Router,
                private _route: ActivatedRoute,
                @Inject(ListComponent) public loadingHandler: ILoadingHandler,
                @Inject(CompanySettingsPermissions) public permissions: ICompanySettingsPermissions,
                private _notifier: NotifierService) {
        this._route.queryParams
            .subscribe(p => {
                this.editId = Number.parseInt(p[PARAM_KEYS.EDIT_QUERY], 10);
            });
    }

    delete() {
        const {_provider, _notifier, params} = this;
        const {id = null} = params && params.data || {};

        if (!id) {
            _notifier.showWarning('Invalid id');
            return;
        }

        const hide = this.loadingHandler.showLoading();

        _provider.deleteItem(id)
            .pipe(finalize(hide))
            .subscribe(
                () => {
                    if (this.editId === id) {
                        this.setEditQueryParams(null);
                    }
                    _notifier.showSuccess('action.successfully-deleted');
                },
                (e) => _notifier.showError(e, 'action.actions-error'),
            );
    }

    edit() {
        this.setEditQueryParams(this.params.data.id);
    }

    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    }

    agInit(params: ICellRendererParams): void {
        this.params = params;
    }

    refresh(params: any): boolean {
        return false;
    }

    ngOnDestroy(): void {
    }

    private setEditQueryParams(value, navigationExtras?: NavigationExtras) {
        this._router.navigate([], {
            relativeTo: this._route,
            queryParamsHandling: 'merge',
            queryParams: {
                [PARAM_KEYS.EDIT_QUERY]: value,
            },
            ...navigationExtras,
        });
    }
}
