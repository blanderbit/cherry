import { Component } from '@angular/core';
import { TranslateService } from 'translate';

@Component({
    selector: 'app-descriptions',
    templateUrl: './descriptions.component.html',
    styleUrls: ['./descriptions.component.scss'],
})
export class DescriptionsComponent {
    langList = [];

    constructor(protected _translateService: TranslateService) {
        this._translateService.getLangList().subscribe(
            arr => this.langList = arr,
            err => console.log(err),
        );
    }
}
