import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside: EventEmitter<void> = new EventEmitter();
  @Input() isOpen: boolean;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event.target']) select(targetElement) {
    if (this.isOpen && !this.elementRef.nativeElement.contains(targetElement)) {
      this.clickOutside.emit();
    }
  }
}
