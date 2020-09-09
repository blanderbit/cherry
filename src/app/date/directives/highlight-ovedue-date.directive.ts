import { HighlightDirective } from '../../ui/highlight.directive';
import { Directive, Input } from '@angular/core';
import * as moment from 'moment';

@Directive({
    selector: '[appHighlightOverdueDate]',
})
export class HighlightOverdueDateDirective extends HighlightDirective {
    protected _overdueDate;
    protected _date;
    private _enabled = true;

    @Input('appHighlightOverdueDate') set date(value) {
        this._date = value;
        this.updateHighlight();
    }

    @Input('highlightEnabled') set enabled(value: boolean) {
        this._enabled = value;
        this.updateHighlight();

    }

    @Input() set overdueDate(value) {
        this._overdueDate = value;
        this.updateHighlight();
    }

    get date() {
        return this._date;
    }

    get overdueDate() {
        return this._overdueDate || moment();
    }


    protected shouldUpdateHighlight(): boolean {
        return this._enabled && this.date && this.overdueDate.isAfter(this.date);
    }
}
