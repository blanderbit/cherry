import { Component, OnInit } from '@angular/core';
import { HumanResourcesProvider, IHumanResource, IRole } from 'communication';
import { NotifierService } from '../../../notifier/notifier.service';
import { ItemsComponent } from 'components';
import { ValueFormatterParams } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { GridService } from '../../../ui/ag-grid/grid.service';
import { LinkComponent } from '../../../ui/ag-grid/components/link.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-admin-users',
    templateUrl: './admin-users.component.html',
    styleUrls: ['../../../ui/ag-grid/ag-grid.component.scss', './admin-users.component.scss'],
})
export class AdminUsersComponent extends ItemsComponent<IHumanResource> implements OnInit {
    public items = null;
    public loadDataOnParamsChange = false;
    public columnDefs = [
        {
            headerName: 'ID',
            field: 'id',
            width: 100,
            headerValueGetter: () => {
                return this._translateService.instant('table.id');
            },
            // suppressAutoSize: true,
        },
        {
            headerName: 'Name',
            field: 'firstName',
            cellRendererFramework: LinkComponent,
            headerValueGetter: () => {
                return this._translateService.instant('table.name');
            },
            // suppressAutoSize: true,
        },
        {
            headerName: 'Email',
            field: 'email',
            headerValueGetter: () => {
                return this._translateService.instant('table.email');
            },
            // suppressAutoSize: true,
        },
        {
            headerName: 'Admin',
            field: 'roles',
            headerValueGetter: () => {
                return this._translateService.instant('table.admin');
            },
            valueFormatter: (params: ValueFormatterParams) => {
                // TODO: Add translation
                return (params.value as IRole).name;
            },
        },
        {
            headerName: '',
            field: 'delete',
            width: 50,
            cellRenderer: () => `<span class="icon-cont cursor-pointer">
            <i class="icon-delete"></i></span>`,
            onCellClicked: (params) => {
                this.deleteItem(<any>{ id: params.data.id });
            },
            suppressAutoSize: true,
            filter: false,
            sortable: false,
        },
        // {
        //     headerName: '',
        //     field: 'navigate',
        //     width: 50,
        //     cellRenderer: () => `<span class="icon-cont cursor-pointer">
        //     <i class="icon-user"></i></span>`,
        //     onCellClicked: (params) => this._navigateToUserDetail(params),
        //     suppressAutoSize: true,
        //     filter: false,
        //     sortable: false,
        // },
    ];

    public defaultColDef = {
            width: 300,
    };

    constructor(protected _provider: HumanResourcesProvider,
                protected _notifier: NotifierService,
                protected _translateService: TranslateService,
                protected _gridService: GridService,
                protected _route: ActivatedRoute,
                // @Inject(ColumnDefsToken) public columnDefs: ColDef[],
                protected _router: Router) {
        super();

    }

    private _navigateToUserDetail(params) {
        this._router.navigate([`/settings/users/${params.data.id}`]);
    }

    protected _handleDeleteError(error) {
        if (error.error.code === 1006) {
            return this._notifier.showError('action.error-1006');
        }
        if (error.error.code === 1010) {
            return this._notifier.showError('action.error-1010');
        }

        super._handleDeleteError(error);
    }
}


