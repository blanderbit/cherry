import { Directive, ElementRef, forwardRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';


const RELATIVE_POSITIONING_CLASS = 'position-relative';

@Directive({
    selector: 'div[contentEditable]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EditableDivDirective),
            multi: true,
        },
    ],
})
export class EditableDivDirective implements ControlValueAccessor, OnInit {
    private _disabled: boolean;
    @Input() multiline = false;
    @Input() valueFormatter: (value: string) => any;
    @Input() maxLength: number;
    @Input() absolute = false;

    @Input()
    set disabled(value: boolean) {
        if (value) {
            this._renderer.addClass(this.element, 'pointer-events-none');
        } else {
            this._renderer.removeClass(this.element, 'pointer-events-none');
        }
    }

    private value: string = null;
    private _onChange = (_) => {
    }
    private _onTouched = () => {
    }

    get innerText(): string {
        return this._elRef.nativeElement.innerText;
    }

    get element(): HTMLDivElement {
        return this._elRef.nativeElement;
    }

    get parentElement(): HTMLElement {
        if (this.element) {
            return this.element.parentElement;
        }

        return null;
    }

    get classList() {
        return this.element && this.element.classList;
    }

    constructor(private _elRef: ElementRef, private _renderer: Renderer2) {
    }


    ngOnInit(): void {
    }

    onChange() {
        if (this.innerText !== this.value) {
            this._onChange(this.innerText);
        }
    }

    @HostListener('keydown', ['$event'])
    enter(event) {
        if (event.key === 'Enter' && !this.multiline) {
            event.preventDefault();
        }

        if (this.maxLength && (this.innerText.length >= this.maxLength) && event.key !== 'Backspace') {
            event.preventDefault();
        }
    }

    @HostListener('keyup', ['$event'])
    keyup(event: KeyboardEvent) {
        this.onChange();
    }

    @HostListener('focus')
    focus() {
        if (this.absolute) {
            this._makeAbsolute();
        }
        this.toggleClass('text-overflow-clip');

        window['el'] = this.element;
        window['el1'] = this.parentElement;
    }

    @HostListener('blur')
    blur() {
        this._onTouched();

        if (this.absolute) {
            this._makeNonAbsolute();
        }

        this.toggleClass('text-overflow-clip');
        this.scrollToStart();
    }

    writeValue(val: any) {
        if (this.valueFormatter) {
            val = this.valueFormatter(val);
        }

        if (this.maxLength) {
            val = val && val.toString().slice(0, this.maxLength);
        }

        this.value = val;
        this._renderer.setProperty(this.element, 'innerText', val);
    }

    registerOnChange(fn: (_: any) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    private _makeAbsolute() {
        // if (this.parentElement) {
        //     this.parentElement.classList.toggle(RELATIVE_POSITIONING_CLASS);
        // }

        if (this.parentElement) {
            this._renderer.addClass(this.parentElement, RELATIVE_POSITIONING_CLASS);
            this._renderer.addClass(this.element, 'position-absolute');

            const elementWidth = this.element.clientWidth;

            this._renderer.setStyle(this.parentElement, 'paddingLeft', elementWidth);
        }

    }

    private _makeNonAbsolute() {
        this._renderer.removeClass(this.parentElement, RELATIVE_POSITIONING_CLASS);
        this._renderer.removeClass(this.element, 'position-absolute');
    }

    private toggleClass(name: string) {
        if (name) {
            this.classList.toggle(name);
        }
    }

    private scrollToStart() {
        this.element.scrollLeft = 0;
    }
}
