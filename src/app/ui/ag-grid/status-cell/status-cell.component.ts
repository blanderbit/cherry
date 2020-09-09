import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';
import { HumanResourceStatus, IHumanResource } from 'communication';
import { Router } from '@angular/router';

export interface IStatusCellComponentParams {
    className?: string;
}

@Component({
    selector: 'app-status-cell',
    templateUrl: './status-cell.component.html',
    styleUrls: ['./status-cell.component.scss'],
})
export class StatusCellComponent implements ICellRendererAngularComp {
    status;
    className: string;

    constructor(private _router: Router) {
    }

    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
        console.warn('implement afterGuiAttached', params);
    }

    agInit(params: ICellRendererParams & IStatusCellComponentParams): void {
        const data = params && params.data as IHumanResource;

        if (!data)
            return;

        this.status = data.status;
        this.className = params.className || '';
    }

    refresh(params: any): boolean {
        console.warn('implement refresh', params);
        return false;
    }
}
