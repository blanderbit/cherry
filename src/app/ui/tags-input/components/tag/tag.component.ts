import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
    selector: 'tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
    @Input() selected: boolean;
    @Input() text: string;
    @Input() index: number;
    @Output() tagRemoved: EventEmitter<number> = new EventEmitter<number>();

    @HostBinding('class.ng2-tag-input-item-selected')
    get isSelected() {
        return !!this.selected;
    }

    removeTag(): void {
        this.tagRemoved.emit(this.index);
    }
}
