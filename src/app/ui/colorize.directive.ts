import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Helpers } from '../helpers';

export const COLOR_CLASSES_PALETTE = [
    'background-red',
    'background-green',
    'background-blue',
    'background-orange',
];

const COLOR_CLASSES_MAP = {};

function getColorClass(id?: any) {
    if (id && COLOR_CLASSES_MAP[id]) {
        return COLOR_CLASSES_MAP[id];
    }

    return COLOR_CLASSES_PALETTE[Helpers.getRandomInteger(0, COLOR_CLASSES_PALETTE.length - 1)];
}

function saveColor(id: any, colorClass: string) {
    if (id && !COLOR_CLASSES_MAP[id]) {
        COLOR_CLASSES_MAP[id] = colorClass;
    }
}

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[colorize]'
})
export class ColorizeDirective implements OnInit {
    protected _id: any;

    @Input('colorize') set id(value: any) {
        this._id = value;

        this.setClass();
    }

    constructor(protected ref: ElementRef, protected renderer: Renderer2) {
    }

    ngOnInit(): void {
        if (!this._id) {
            this.setClass();
        }
    }

    setClass() {
        const colorClass = getColorClass(this._id);

        saveColor(this._id, colorClass);
        this.renderer.addClass(this.ref.nativeElement, colorClass);
    }
}
