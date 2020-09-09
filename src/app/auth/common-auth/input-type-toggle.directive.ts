import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';


export const showPassword = require('../../../assets/svg/show-password.svg');
export const hidePassword = require('../../../assets/svg/hide-password.svg');

enum InputType {
    Text = 'text',
    Password = 'password',
}

@Directive({
    selector: 'input[inputTypeToggle]',
    exportAs: 'inputTypeToggle',
})
export class InputTypeToggleDirective implements AfterViewInit, OnDestroy {
    private disposeClickListener: () => void;
    private switcher: HTMLElement;

    get element(): HTMLInputElement {
        return this.elementRef && this.elementRef.nativeElement;
    }

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
    ) {
    }

    ngAfterViewInit() {
        const {renderer, element: {parentElement}} = this;
        this.switcher = this.createSwitcher();

        renderer.addClass(parentElement, 'position-relative');

        this.disposeClickListener = renderer.listen(this.switcher, 'click', this.toggleInputType.bind(this));

        renderer.appendChild(parentElement, this.switcher);
    }

    createSwitcher(): HTMLImageElement {
        const {renderer} = this;
        const switcher = renderer.createElement('img') as HTMLImageElement;

        renderer.setAttribute(switcher, 'src', showPassword);
        renderer.addClass(switcher, 'input-type-toggle');

        return switcher;
    }

    toggleInputType() {
        const {renderer, element, switcher} = this;

        if (element.type === InputType.Text) {
            renderer.setAttribute(switcher, 'src', showPassword);
            element.type = InputType.Password;
        } else {
            renderer.setAttribute(switcher, 'src', hidePassword);
            element.type = InputType.Text;
        }
    }

    ngOnDestroy() {
        if (this.disposeClickListener) {
            this.disposeClickListener();
        }
    }
}
