import { ProfileService } from 'src/app/identify/profile.service';
import { ResourceId } from './../assignee/index';
import { Component, Input, OnInit, Optional, Inject } from '@angular/core';
import { FormComponent } from 'components';
import { IActualTime, IIdObject, TimeProvider } from 'communication';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-weekday',
    templateUrl: './weekday.component.html',
    styleUrls: ['./weekday.component.scss'],
})
export class WeekdayComponent extends FormComponent<IActualTime> implements OnInit {
    protected _disabled = false;
    public request: Observable<IActualTime | boolean>;
    loadDataOnInit = true;
    loadDataOnParamsChange = false;

    @Input()
    item: IActualTime;

    @Input()
    set disabled(value: boolean) {
        this._disabled = value;
        this.setFormDisabledState();
    }

    get disabled() {
        return this._disabled;
    }

    get control() {
        return this.form && this.form.get('time');
    }

    get resourceId(): number {
        return this._resourceId;
    }

    constructor(
        protected _provider: TimeProvider,
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _profile: ProfileService,
        @Optional() @Inject(ResourceId) protected _resourceId: number,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.setFormDisabledState();
    }

    submit(e?) {
        const prevTime = this.item && this.item.time;
        const time = this.control.value;

        if (prevTime !== time) {
            this.apply(e);
        }

        return this.request;
    }

    getDto(): IActualTime {
        return {
            ...super.getDto(),
            resourceId: this.resourceId,
        };
    }

    public create(obj: IActualTime) {
        if (obj.time) {
            return this.request = this._create(obj);
        }
    }

    public update(obj: IActualTime) {
        // if (!obj.time) {
        //     return this.request = this._deleteItem(obj);
        // } else {
        //     return this.request = this._update(obj).pipe(
        //         tap(v => this.handleItem(v))
        //     );
        // }
        return this.request = this._update(obj);
    }

    protected _navigateOnSuccessAction(item: IIdObject) {
        return;
    }

    protected _handleCreateItem(item: IActualTime) {
        if (Date.toServerDate(item.date) === Date.toServerDate(this.item.date)) {
            this.handleItem({...this.item, ...item});
        }
    }

    protected _handleDeleteItem(item: IIdObject) {
        if (item.id === this.item.id) {
            this.handleItem({
                time: 0,
                comment: null,
                date: this.item.date,
            } as IActualTime);
        }
    }

    public setFormDisabledState() {
        if (!this.form) return;

        if (this.disabled) {
            this.form.disable({emitEvent: false});
        } else {
            this.form.enable({emitEvent: false});
        }
    }

    protected _getItem(id?: any): Observable<IActualTime> {
        return of(this.item);
    }

    protected createForm(): FormGroup {
        return new FormGroup({
            time: new FormControl(null),
        });
    }
}
