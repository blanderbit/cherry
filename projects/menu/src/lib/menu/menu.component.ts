import {Component, ContentChild, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {PlacementArray} from '@ng-bootstrap/ng-bootstrap/util/positioning';

export interface IItem {
    action?: (param?) => void;
    icon?: string;
    title: string;
    value?: string | number;
    submenu?: ISubmenuItem[];
}

export interface ISubmenuItem {
    action: (param?) => void;
    title: string;

}
/**
 * Example how to use menu.
 * <menu [items]="items"><i class="icon-arrow"></i></menu>
 * */
@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent extends NgbDropdown {
    private currentElement;

    @ViewChild(NgbDropdown, {static: true})
    public dropdown: NgbDropdown;

    @Input()
    highlightSelected = false;

    @Input()
    items: IItem[] = [];

    @Input()
    container: 'body' | null = null;

    @Input() placement: PlacementArray;

    @Input()
    noOptionsPlaceholder = 'No options';


    @Output()
    checked: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    openStateChange: EventEmitter<any> = new EventEmitter<any>();

    @ContentChild('.no-options-placeholder', {static: true}) noOpsPlaceholder: TemplateRef<any>;

    get opened() {
        return this.dropdown && this.dropdown.isOpen();
    }

    check(item: IItem) {
        this.currentElement = item;
        if (item.action)
            item.action(item);
        else
            this.checked.emit(item);

        this.emitOpenChange(false);
    }

    public onOpenChange(event) {
        this.emitOpenChange(event);
    }

    public open() {
        this.dropdown.open();
    }

    public close() {
        this.dropdown.close();
    }

    private emitOpenChange(value: boolean) {
        this.openStateChange.emit(value);
    }
}
