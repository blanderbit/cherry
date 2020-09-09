import { Component, Injector, OnInit, Type, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormComponent } from 'components';
import { Provider } from 'communication';
import { IAutocompleteField } from '../../components';
import { NotifierService } from '../../../notifier/notifier.service';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellEditorParams } from 'ag-grid-community';
import { DynamicField } from '../../field';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';

export interface IGridAutocompleteParams extends Partial<ICellEditorParams> {
    field: Partial<IAutocompleteField<any>>;
    provider: Type<Provider> | any;
}

@Component({
    selector: 'app-grid-autocomplete',
    templateUrl: './grid-autocomplete.component.html',
    styleUrls: ['./grid-autocomplete.component.scss'],

})
export class GridAutocompleteComponent extends FormComponent<any> implements ICellEditorAngularComp, OnInit {
    protected _provider: Provider<any>;
    public loadDataOnInit = false;
    public loadDataOnParamsChange = false;
    emitNullValues = false;

    @ViewChild(AutocompleteComponent, {static: false})
    autocompleteComponent: AutocompleteComponent;

    autoSave = true;

    private params: any;
    field: Partial<IAutocompleteField<any>>;

    constructor(protected _notifier: NotifierService, protected _injector: Injector) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this._initializing = true;
        this.handleItem(this.params.data);
        this._initializing = false;
    }

    protected createForm(): FormGroup {
        return DynamicField.getFormGroup(this.field);
    }

    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    }

    agInit(params: IGridAutocompleteParams | any): void {
        this.params = params;

        const {provider} = params;

        this.field = params.field;
        this.provider = this._injector.get(provider);
    }

    focusIn(): void {
    }

    focusOut(): void {
    }

    refresh() {
        return false;
    }

    getFrameworkComponentInstance(): any {
        return this;
    }

    getValue(): any {
        return this.item[this.field.name];
    }

    isCancelAfterEnd(): boolean {
        return false;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    isPopup(): boolean {
        return true;
    }

    protected _handleSuccessUpdate() {
        super._handleSuccessUpdate();
        this.params.stopEditing();
    }
}
