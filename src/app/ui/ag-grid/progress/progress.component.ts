import { Component } from '@angular/core';

@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent {

    constructor() {
    }

    params: any;

    agInit(params: any): void {
        this.params = params;
    }

}
