import { Component, Input, OnInit } from '@angular/core';
import { IActualTime } from 'communication';
import { FormControl, FormGroup } from '@angular/forms';
import { ITypedFormGroup } from '../../../settings/modules/company-settings/forms/holidays-form/holidays-form.component';
import { WeekdayComponent } from '../../../../common-tasks/weekday/weekday.component';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-comment-dialog-control',
    templateUrl: './comment-dialog-control.component.html',
    styleUrls: ['./comment-dialog-control.component.scss']
})
export class CommentDialogControlComponent extends WeekdayComponent implements OnInit {
    @Input() showDayName: boolean;

    get resourceId(): number {
        return this._profile.resourceId;
    }

    apply(e?) {
        super.apply(e);
        return this.request;
    }

    public create(obj: IActualTime) {
        return this.request = this._create(obj).pipe(
            tap(v => this.handleItem(v))
        );
    }

    public getDto(): IActualTime {
        const dto = super.getDto();
        return {...dto, date: Date.toServerDate(dto.date, true)};
    }

    public update(obj: IActualTime) {
        return this.request = this._update(obj).pipe(
            tap(v => this.handleItem(v))
        );
    }

    protected createForm(): FormGroup {
        const {comment} = this.item;
        return new FormGroup({
            comment: new FormControl(comment),
        } as ITypedFormGroup<IActualTime>);
    }
}
