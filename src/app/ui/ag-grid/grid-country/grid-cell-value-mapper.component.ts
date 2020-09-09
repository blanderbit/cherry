import { Component, Injector, OnInit, Type } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';
import { Provider } from 'communication';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

export interface IGridCellValueMapperParams {
    provider: Type<Provider> | Provider;
    valueFormatter: ValueFormatter;
}

type Params = ICellRendererParams & IGridCellValueMapperParams;
type ValueFormatter = (item: any) => any;

@Component({
    selector: 'app-grid-country',
    templateUrl: './grid-cell-value-mapper.component.html',
    styleUrls: ['./grid-cell-value-mapper.component.scss']
})
export class GridCellValueMapperComponent implements ICellRendererAngularComp, IGridCellValueMapperParams {
    public provider: Provider;
    public value: string | number;
    public valueFormatter: ValueFormatter = (item) => item.name;

    constructor(private injector: Injector) {
    }

    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    }

    loadData(params) {
        if (!this.provider)
            this.provider = this.getProvider(params.provider);

        if (params.valueFormatter)
            this.valueFormatter = params.valueFormatter;

        if (this.provider) {
            this.provider.getItemById(params.value)
                .pipe(catchError(() => EMPTY))
                .subscribe(item => this.value = item ? this.valueFormatter(item) : '-');
        }
    }

    agInit(params: Params): void {
        this.loadData(params);
    }

    refresh(params: any): boolean {
        this.loadData(params);
        return true;
    }

    getProvider(provider: Provider | Type<Provider>): Provider {
        if (!provider) return;

        if (provider instanceof Provider) {
            return provider;
        }

        return this.injector.get(provider);
    }
}
