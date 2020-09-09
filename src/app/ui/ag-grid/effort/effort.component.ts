import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import * as moment from 'moment';
import { TimeToStringPipe } from 'date';

export interface IEffortComponentParams {
    // value in minutes
    value: number;
    error: boolean;
    highlightOverdue: boolean;
}

@Component({
    selector: 'app-effort',
    templateUrl: './effort.component.html',
    styleUrls: ['./effort.component.scss'],
})
export class EffortComponent implements ICellRendererAngularComp {
    params: ICellRendererParams & IEffortComponentParams = null;
    value: number;
    error: boolean;

    agInit(params: ICellRendererParams & IEffortComponentParams): void {
        this.params = params;

        const {value = 0, valueFormatted, error} = params;

        this.value = valueFormatted != null ? valueFormatted : TimeToStringPipe.timeToString(value);

        this.error = !!error;
    }

    refresh(params: any): boolean {
        return true;
    }
}


