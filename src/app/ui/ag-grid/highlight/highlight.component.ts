import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

export interface IHighlightComponentParams {
    valueFormatted: any;
    isHighlighted: boolean;
}

@Component({
    selector: 'app-highlight',
    templateUrl: './highlight.component.html',
    styleUrls: ['./highlight.component.scss'],
})
export class HighlightComponent implements ICellRendererAngularComp {

    isHighlighted;
    valueFormatted;

    agInit(params: ICellRendererParams & IHighlightComponentParams): void {

        this.isHighlighted = params.isHighlighted;
        this.valueFormatted = params.valueFormatted;
    }

    refresh(params: any): boolean {
        return true;
    }
}
