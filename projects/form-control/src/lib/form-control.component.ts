import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'lib-form-control',
    template: `
        <div class="field" [class.errored]="error">

            <label [for]="title">{{title | translate }}</label>
            <div>
                <ng-content></ng-content>
            </div>
            <span class="error">{{error}}</span>

        </div>
    `,
    styles: []
})
export class FormControlComponent implements OnInit {
    @Input() title: string;
    @Input() error: string = '';

    constructor() {
    }

    ngOnInit() {
    }

}
