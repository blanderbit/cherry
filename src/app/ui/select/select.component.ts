import {Component, ContentChild, EventEmitter, forwardRef, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {IItem, MenuComponent} from 'menu';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FocusableOption} from '@angular/cdk/a11y';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true,
        },
    ],
})
export class SelectComponent implements OnInit, ControlValueAccessor, FocusableOption {
    private _value: any;
    private _options: any[];
    private _translationPrefix: string;
    private _disabled: boolean;

    @ViewChild('menu', {static: false}) menu: MenuComponent;
    menuOptions: IItem[] = [];
    selectedItem: IItem;

    @ContentChild(TemplateRef, { static: false, read: TemplateRef }) selectedItemTemplate: TemplateRef<any>;

    @Input() showCaret = false;

    @Output() itemSelect = new EventEmitter<any>();
    @Input() autoSelectFirstItem = true;
    @Input() onItemClick: (item: IItem) => any;
    @Input() placement = 'bottom-right';

    @Input() set disabled(v: boolean) {
        this._disabled = v;
    }

    get disabled() {
        return this._disabled;
    }

    @Input() set value(value: any) {
        this.writeValue(value);
    }

    get value() {
        return this._value;
    }

    @Input() set options(value: any[]) {
        this._options = value;
        this.setMenuOptions();
        this.selectItem();
    }

    get options() {
        return this._options;
    }

    @Input() set translationPrefix(value: string) {
        this._translationPrefix = value;
        this.setMenuOptions();
        this.selectItem();
    }

    get translationPrefix() {
        return this._translationPrefix || '';
    }

    @Input() container = 'body';

    @Input() placeholder: string = 'Select value';

    onChange = (_) => {
    }
    onTouch = () => {
    }
    get focused()  {
       return  this.menu.opened;
    }
    ngOnInit() {
    }

    setMenuOptions() {
        this.menuOptions = getNormalizedOptions(this._options, this.translationPrefix, this.onItemClick);
    }

    onItemSelect(item: IItem) {
        const value = item.value;

        if (this.value !== value) {
            this.writeValue(value);
            this.itemSelect.emit(value);
            this.onChange(value);
            this.onTouch();
        }
    }

    open() {
        this.menu.open();
    }

    close() {
        this.menu.close();
    }

    onOpenChange(event) {
        if (!event) {
            this.onTouch();
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._disabled = isDisabled;
    }

    writeValue(obj: any): void {
        this._value = obj;
        this.selectItem(obj);
    }

    selectItem(value?: any) {
        if (value === undefined) {
            if (this.value != null) {
                this.selectItem(this.value);
            } else
                this.autoselectFirstItem();
        } else {
            if (value != null && typeof value === 'object') {
                this.selectedItem = value;
            } else {
                if (!this.menuOptions)
                    return;

                const menuOption = this.menuOptions.find(option => option.value === value);

                const defaultOption = getNormalizedOption(value, this.translationPrefix);
                if (menuOption || defaultOption)
                    this.selectedItem = menuOption || defaultOption;
                else
                    this.autoselectFirstItem();
            }
        }
    }

    autoselectFirstItem() {
        if (this.autoSelectFirstItem && (this.menuOptions || []).length) {
            this.selectItem(this.menuOptions[0]);
        }
    }

    focus(origin?: 'touch' | 'mouse' | 'keyboard' | 'program' | null): void {
        this.menu.open();
    }
}

function getNormalizedOptions(options: any[], translatePrefix?: string, action?: (param: IItem) => void): IItem[] {
    return (options || []).map(o => getNormalizedOption(o, translatePrefix, action));
}

function getNormalizedOption(option: any, translatePrefix?: string, action?): IItem {
    if (typeof option === 'object') {
        return option;

    } else {
        return {
            title: getOptionTitle(option, translatePrefix),
            value: option,
            action,
        };
    }
}

function getOptionTitle(option: any, translatePrefix: string = ''): string {
    return translatePrefix ? `${translatePrefix}.${option}` : `${option}`;
}
