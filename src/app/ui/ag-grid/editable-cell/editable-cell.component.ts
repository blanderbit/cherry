import { AfterViewInit, Component, ElementRef, Inject, Injector, OnInit, Type, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { FormComponent, TranslateErrorHandler } from 'components';
import { Provider } from 'communication';
import { NotifierService } from 'notifier';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GridContainerComponent } from '../grid-container/grid-container.component';
import { GRID_CONTAINER_COMPONENT } from '../grid-container/token';

export interface IEditableCellParams { // todo: remove and use use IFieldConfig
    validators?: ValidatorFn | ValidatorFn[] | null;
    placeholder?: string;
    fieldName: string;
    provider: Provider | Type<Provider>;
}

@Component({
    selector: 'app-editable-cell',
    templateUrl: './editable-cell.component.html',
    styleUrls: ['./editable-cell.component.scss'],
    host: {
        // '(keydown.enter)': 'apply($event)'
    }
})
export class EditableCellComponent extends FormComponent<any>
    implements OnInit, AfterViewInit, ICellEditorAngularComp, IEditableCellParams {

    public params: ICellEditorParams & IEditableCellParams;
    public validators: ValidatorFn | ValidatorFn[] | null;
    public value: string;
    public errorHandler = new TranslateErrorHandler('');
    public loadDataOnParamsChange = false;
    public loadDataOnInit = false;
    public fieldName: string;
    public placeholder: string;
    public provider: Provider;
    public submitEvent: KeyboardEvent;

    @ViewChild('input', {static: true})
    private inputRef: ElementRef<HTMLInputElement>;

    get input() {
        return this.inputRef.nativeElement;
    }

    constructor(private injector: Injector,
                protected _notifier: NotifierService,
                protected _router: Router,
                @Inject(GRID_CONTAINER_COMPONENT) public gridContainer: GridContainerComponent
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

        this.handleItem(this.params.data);
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.input.focus());
    }

    agInit(params: ICellEditorParams & IEditableCellParams): void {
        this.params = params;

        const {value = '', fieldName = '', validators = [], provider, placeholder = ''} = params;

        this.fieldName = fieldName;
        this.validators = validators;
        this.value = value;
        this.provider = this.getProvider(provider);
        this.placeholder = placeholder;
    }

    protected _update(obj: any): Observable<any> {
        return super._update(obj);
    }

    protected _handleSuccessUpdate() {
        super._handleSuccessUpdate();
        this.stopEditing();

        // const id = this.params.node.id;
        // const node = this.gridContainer.gridApi.getRowNode(id);
        // node.setData({...this.item, ...this.form.get(this.fieldName).value});

        // this.input.dispatchEvent(this.submitEvent);
    }

    protected _handleUpdateError(error: any) {
        // super._handleUpdateError(error);
        console.log('handle update error');

        const id = this.params.node.id;
        const node = this.gridContainer.gridApi.getRowNode(id);
        // node.setData(this.item);

        this.stopEditing(true);

    }

    protected createForm(): FormGroup {
        return new FormGroup({
            [this.fieldName]: new FormControl(this.value, this.validators)
        }, {});
    }

    apply(e) {
        this.submitEvent = e;
        e.preventDefault();
        e.stopPropagation();

        const obj = {...this.item, ...this.form.value};

        if (this.needCreate)
            this.create(obj);
        else
            this.update(obj);
    }

    isCancelAfterEnd(): boolean {
        console.log('CANCEL?', this.form.invalid, this.params.charPress);
        return this.form.invalid;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    focusOut(): void {
        setTimeout(() => this.input.blur());
    }

    isPopup(): boolean {
        return false;
    }

    getValue(): any {
        console.log('GET VALUE', this.form);
        // return this.form.valid ? this.form.get(this.fieldName).value : this.value;
        return '44444';
    }

    public onKeyDown(event) {
        const key = event.which || event.keyCode;
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
