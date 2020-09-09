import {Component} from '@angular/core';
import {INoRowsOverlayAngularComp} from 'ag-grid-angular';

@Component({
    selector: 'app-no-rows-overlay',
    template: `
        <div class="d-flex {{customClass}} flex-column h-100 overlay">
            <img src="../../../../assets/img/{{img}}" class="" alt="">
            <h3 class="text-center ">{{ "details.no-rows" | translate }}</h3>
        </div>
    `,
    styleUrls: [
        'app-no-rows-overlay.scss',
    ],
    styles: [

    ],
})
export class CustomNoRowsOverlayComponent implements INoRowsOverlayAngularComp {
    img;
    customClass = '';

    private params: any;

    agInit(params) {
        this.img = params.img || 'no-content.png';
        this.customClass = params.class;
        this.params = params;
    }
}
