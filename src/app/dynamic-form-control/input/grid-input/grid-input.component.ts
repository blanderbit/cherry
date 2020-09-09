import { AfterViewInit, Component, ElementRef, Injector, OnInit, Type, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { FormGroup } from '@angular/forms';
import { FormComponent, TranslateErrorHandler } from 'components';
import { Provider } from 'communication';
import { NotifierService } from 'notifier';
import { Router } from '@angular/router';
import { DynamicField } from '../../field';
import { ICellEditorParams } from 'ag-grid-community';
import { IInputField } from '../../components';

export interface IGridInputParams extends Partial<ICellEditorParams> {
    field: Partial<IInputField>;
    provider: Type<Provider> | any;
}

@Component({
    selector: 'app-grid-input',
    templateUrl: './grid-input.component.html',
    styleUrls: ['./grid-input.component.scss'],
})
export class GridInputComponent extends FormComponent<any>
    implements OnInit, AfterViewInit, ICellEditorAngularComp {
    public loadDataOnParamsChange = false;
    public loadDataOnInit = false;
    public errorHandler = new TranslateErrorHandler('form.');

    public params: IGridInputParams;
    public field: IInputField;

    public provider: Provider;

    @ViewChild('input', {static: true})
    private inputRef: ElementRef<HTMLInputElement>;

    get input() {
        return this.inputRef.nativeElement;
    }

    constructor(private injector: Injector,
                protected _notifier: NotifierService,
                protected _router: Router) {
        super();
    }

    agInit(params: IGridInputParams | any): void {
        this.params = params;
        const {field, provider} = params;

        this.field = field;
        this.provider = this.getProvider(provider);
    }

    ngOnInit() {
        super.ngOnInit();
        this.handleItem(this.params.data);
    }

    protected createForm(): FormGroup {
        return DynamicField.getFormGroup(this.params.field);
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.input.focus());
    }

    protected _handleSuccessUpdate() {
        super._handleSuccessUpdate();
        this.stopEditing();
    }

    protected _handleUpdateError(error: any) {
        super._handleUpdateError(error);

        this.stopEditing(true);
    }

    isCancelAfterEnd(): boolean {
        return this.form.invalid;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    focusOut(): void {
        console.log('focusOut');
        setTimeout(() => this.input.blur());
    }

    isPopup(): boolean {
        return false;
    }

    getValue(): any {
        return this.item[this.field.name];
    }

    getDto(): any {
        const value = super.getDto();
        const {name, type} = this.field;

        return {...value, [name]: parseValue(value[name], type)};
    }

    private getProvider(providerOrToken: Type<Provider> | Provider): Provider {
        if (providerOrToken instanceof Provider) {
            return providerOrToken;
        }

        return this.injector.get(<Type<Provider>>providerOrToken);
    }

    private stopEditing(cancel = false) {
        this.params.api.stopEditing(cancel);
    }
}

function parseValue(value: any, type = 'text') {
    if (type === 'number') {
        return +value;
    }

    return value;
}
