import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

export interface IItem {
    action?: (param?) => void;
    icon?: string;
    title: string;
    value?: string | number;
}

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent extends NgbDropdown {
    @Input() items: IItem[] = [];

    @Output() closed: EventEmitter<any> = new EventEmitter<any>();
    @Output() checked: EventEmitter<any> = new EventEmitter<any>();

    toggled(open) {
        if (!open) {
            this.closed.emit();
        }
    }

    check(item) {
        if (item.actionId) {
            item.actionId();
        } else {
            this.checked.emit(item);
        }
    }

}
