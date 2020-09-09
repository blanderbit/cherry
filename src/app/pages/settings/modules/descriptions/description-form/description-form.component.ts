import { Component, Inject, Input } from '@angular/core';
import { FormComponent } from 'components';
import { NotifierService } from 'notifier';
import { ITranslateDescription, TranslateProvider } from 'communication';
import { FormControl, FormGroup } from '@angular/forms';
import { ILang } from 'translate';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileToken } from 'src/app/pages/settings/modules/descriptions/file.token';

@Component({
    selector: 'app-description-form',
    templateUrl: './description-form.component.html',
    styleUrls: ['./description-form.component.scss'],
})
export class DescriptionFormComponent extends FormComponent<ITranslateDescription> {
    loadDataOnInit = true;
    loadDataOnParamsChange = false;
    loadDataOnQueryParamsChange = false;

    get needCreate() {
        return false;
    }

    set needCreate(value) {
    }

    @Input()
    lang: ILang;

    constructor(protected _provider: TranslateProvider,
                protected _notifier: NotifierService,
                @Inject(FileToken) public file: string) {
        super();
    }

    protected _getItem(id?: any): Observable<ITranslateDescription> {
        return this._provider.getItems({lang: this.lang.code, file: this.file})
            .pipe(map(arr => arr && arr[0]));
    }

    protected createForm(): FormGroup {
        return new FormGroup({
            lang: new FormControl(this.lang.code),
            file: new FormControl(this.file),
            description: new FormControl(''),
        });
    }
}
