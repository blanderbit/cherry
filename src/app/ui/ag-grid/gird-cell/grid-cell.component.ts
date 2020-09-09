import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { GridService } from '../grid.service';
import { IIdObject } from 'communication';

export interface IGridCellComponentParams {
    value: any;
    disableCheckbox?: boolean;
    checkboxValue?: boolean;
    onCheckboxValueChange?: (value: boolean, data?: any) => any;
    getRouterLink?: (data: any) => string;
    onValueClick?: (data: any, event?: MouseEvent) => void;
    navigateById?: boolean;
    isCheckboxShown: () => boolean;

    preserveCheckboxSpace: boolean;
    showDeliverableIcon?: boolean;
}

@Component({
    selector: 'app-gird-cell',
    templateUrl: './grid-cell.component.html',
    styleUrls: ['./grid-cell.component.scss'],
})
export class GridCellComponent implements OnInit, ICellRendererAngularComp {
    params: ICellRendererParams & IGridCellComponentParams = null;
    routerLink: string | number;
    onValueClick: (data, event) => void;
    showCheckbox = false;
    checkboxValue: boolean;
    disableCheckbox: boolean;
    preserveCheckboxSpace: boolean = false;

    get api() {
        return this.params && this.params.api;
    }

    get columnApi() {
        return this.params && this.params.columnApi;
    }

    constructor(public gridService: GridService,
                private router: Router,
                private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
    }

    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    }

    agInit(params: ICellRendererParams & IGridCellComponentParams): void {
        this.params = params;
        const data = (<IIdObject>params.data);

        try {
            const {onValueClick, navigateById, getRouterLink, showDeliverableIcon} = params;
            this.onValueClick = onValueClick;
            this.showCheckbox = params.isCheckboxShown && params.isCheckboxShown();

            if (params.preserveCheckboxSpace != null)
                this.preserveCheckboxSpace = !!params.preserveCheckboxSpace;
            else
                this.preserveCheckboxSpace = this.showCheckbox;

            this.refresh(params);

            if (navigateById) {
                this.routerLink = data.id;
            }

            if (getRouterLink) {
                this.routerLink = getRouterLink(data);
            }

        } catch (e) {
        }
    }

    refresh(params: any): boolean {
        this.params = params;
        const needRefresh = this.checkboxValue !== params.checkboxValue || this.disableCheckbox !== params.disableCheckbox;
        this.checkboxValue = params.checkboxValue;
        this.disableCheckbox = params.disableCheckbox;

        return needRefresh;
    }

    public onCheckboxSelectChange(e: boolean) {
        if (this.params.onCheckboxValueChange) {
            this.params.onCheckboxValueChange(e, this.params.data);
        }
    }

    public onClick(e) {
        if (this.onValueClick) {
            this.onValueClick(this.params.data, e);
        }

        // if (this.params.navigateById) {
        //     this.navigateById();
        // }
    }

    private navigateById() {
        const id = this.params.data.id;

        if (id != null) {
            this.router.navigate([id], {relativeTo: this.route, queryParamsHandling: 'merge'});
        }
    }
}

