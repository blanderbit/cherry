import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IItem } from 'menu';
import { MatMenuTrigger } from '@angular/material/menu';


/**
 * Example how to use menu.
 * <menu [items]="items"><i class="icon-arrow"></i></menu>
 * */
@Component({
    selector: 'material-menu',
    templateUrl: './material-menu.component.html',
    styleUrls: ['./material-menu.component.scss'],
})
export class MaterialMenuComponent {

    @ViewChild(MatMenuTrigger, {static: false}) menu: MatMenuTrigger;

    @Input()
    items: IItem[] = [];

    @Input()
    customizeClass: string = '';

    @Input()
    disabled: boolean;

    @Output()
    onToggleMenu = new EventEmitter<boolean>();

    get isOpen(): boolean {
        return this.menu && this.menu.menuOpen;
    }


    onMenuOpen() {
        this.onToggleMenu.emit(true);
    }

    onMenuClose() {
        this.onToggleMenu.emit(false);
    }
}
