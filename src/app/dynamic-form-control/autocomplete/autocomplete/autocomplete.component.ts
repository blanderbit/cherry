import { Component, ElementRef, EventEmitter, forwardRef, Injector, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ILoadingHandler, ItemsComponent } from 'components';
import { Provider } from 'communication';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, finalize, map, mergeMap } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { merge } from 'rxjs/internal/observable/merge';
import { DynamicField } from '../../field';
import { IAutocompleteField } from '../../components';
import { NotifierService } from '../../../notifier/notifier.service';
import { tap } from 'rxjs/internal/operators/tap';
import { ResultTemplateContext } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window';
import { FocusableOption } from '@angular/cdk/a11y';

@Component({
    selector: 'dynamic-autocomplete-control',
    styleUrls: ['./autocomplete.component.scss'],
    template: DynamicField.getFromControlTemplate(`
        <app-autocomplete-control 
            [placeholder]="placeholder"
            [provider]="field.provider" 
            [formatter]="field.formatter" 
            [paramsFormatter]="field.paramsFormatter" 
            [formControlName]="formControlName">
</app-autocomplete-control>
    `),
})
export class DynamicAutocompleteComponent extends DynamicField<IAutocompleteField<any>> {
}

@Component({
    selector: 'app-autocomplete-control',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutocompleteComponent),
            multi: true,
        },
    ],
})
export class AutocompleteComponent extends ItemsComponent<{ id: any }, any>
    implements OnInit, ControlValueAccessor {

    get formatter(): (params: any) => string {
        return this._formatter;
    }

    @Input()
    set formatter(value: (params: any) => string) {
        if (value)
            this._formatter = value;
    }

    get paramsFormatter(): (params) => any {
        return this._paramsFormatter;
    }

    @Input()
    set paramsFormatter(value: (params) => any) {
        if (value)
            this._paramsFormatter = value;
    }

    @Input() triggerOnClick = true;

    @Input()
    public loadingHandler: ILoadingHandler;

    constructor(protected notifier: NotifierService,
                protected injector: Injector) {
        super();
    }

    public loadDataOnInit = false;
    public loadDataOnParamsChange = false;
    id;

    focus$ = new Subject<string>();
    click$ = new Subject<string>();

    public isActive: boolean = true;

    @Input()
    emitNullValues = true;

    @Input()
    placeholder: string;

    @Input() params = {};

    @Input()
    provider: Provider;

    @Input()
    disabled = false;

    @ViewChild('instance', {static: true})
    instance: NgbTypeahead;

    @Input() itemTemplate: TemplateRef<ResultTemplateContext>;

    @Input() container = '';

    @ViewChild('input', {static: true})
    private autocompleteInput: ElementRef<HTMLInputElement>;

    @Output()
    onSelect = new EventEmitter();

    @Output()
    onType = new EventEmitter<string>();

    @Input()
    itemsFilter: (items: any[]) => any = (items) => items

    private _formatter = ({id, name}) => `${name || id}`;

    private _paramsFormatter = (search) => ({search});

    search = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap((query) => this.onType.emit(query)));
        const clicksWithClosedPopup$ = this.click$.pipe(filter(() =>
            !this.instance.isPopupOpen() && this.triggerOnClick));
        const inputFocus$ = this.focus$.pipe(filter((value) => {
            return this.isActive;
        }));

        let hide = () => {};
        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
            tap(name => this.emitNullValues && !name && this.onChange()),
            tap(() => hide = this.showLoading()),
            mergeMap(name => this._getItems(this._paramsFormatter(name))
                .pipe(
                    finalize(hide),
                    map(this.itemsFilter))
            ),
            tap(items => {
                this.items = items;
            }),
        );
    }

    protected _getItems(params?): Observable<{ id: any }[]> {
        return super._getItems({...params, ...this.params});
    }

    onChange = (v?) => {
        this.onSelect.emit(v && v.item);
        setTimeout(() => this.instance.writeValue(null));
    }

    onTouched = () => {
    }

    ngOnInit(): void {
        let provider = this._provider;

        if (typeof provider === 'function')
            this.provider = this.injector.get(this.provider as any);

        provider = this.provider;

        if (!provider || !provider.getItems)
            throw new Error(`Please provide valid provider instead of ${provider}`);

        super.ngOnInit();
    }

    registerOnChange(fn: any): void {
        this.onChange = ({item} = {item: null}) => fn(item && item.id);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    open() {
        this.isActive = true;
        this.focus$.next('');
    }
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(id: any): void {
        if (!id) {
            this.id = null;
            this.instance.writeValue(null);
        } else if (this.id !== id) {
            this.id = id;
            const hide = this.showLoading();
            this.provider.getItemById(id)
                .pipe(finalize(hide))
                .subscribe(
                    user => {
                        this.instance.inputFormatter = this.formatter; // fix ssr issue with [Object object]. Formatter don't set yet
                        this.instance.writeValue(user);
                    },
                    error => this.notifier.showError(error),
                );
        }
    }

    focusAutocompleteInput(triggerEvent = false) {
        const nativeElement = this.autocompleteInput && this.autocompleteInput.nativeElement;

        if (nativeElement) {
            this.isActive = triggerEvent;

            nativeElement.focus();
        }
    }

    blur() {
        const nativeElement = this.autocompleteInput && this.autocompleteInput.nativeElement;

        if (nativeElement)
            nativeElement.blur();
    }

    close() {
        this.instance.dismissPopup();
    }
}
