import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appHighlight]',
})
export class HighlightDirective {

    protected _highlightIf;
    protected _highlightClass = 'color-red';

    @Input('appHighlight') set highlightIf(value) {
        this._highlightIf = value;
        this.updateHighlight();
    }
    @Input () set highlightClass (value: string) {
        this._highlightClass = value;
        this.updateHighlight();
    }
    constructor(protected ref: ElementRef,
                protected renderer: Renderer2) {
    }

    protected updateHighlight() {
        const element = this.ref.nativeElement;
        const { _highlightClass } = this;
        if (this.shouldUpdateHighlight()) {
            this.renderer.addClass(element, _highlightClass);
        } else {
            this.renderer.removeClass(element, _highlightClass);
        }
    }

    protected shouldUpdateHighlight(): boolean {
        return this._highlightIf;
    }
}

