import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextReplace]'
})
export class TextReplaceDirective {
  readonly el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event']) onEnter($event) {
    this.onInputChange($event);
  }

  onInputChange($event) {
    let oldValue = $event.target.value;
    let newVal = '';

    oldValue = oldValue.trim();

    if (oldValue.length > 5) {
      oldValue = oldValue.slice(0, 5);
    }

    oldValue = oldValue.replace(/[a-zA-Z:]+/, '0');

    if (oldValue.length > 2) {
      oldValue = oldValue.split('');

      oldValue[2] = ':';

      oldValue = oldValue.join('');
    }

    newVal = oldValue;

    this.el.value = newVal;
  }
}
