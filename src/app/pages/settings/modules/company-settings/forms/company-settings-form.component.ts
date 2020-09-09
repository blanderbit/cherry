import {FormComponent, TranslateErrorHandler} from 'components';
import {IIdObject, Provider} from 'communication';
import {EventEmitter, Inject, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifierService} from 'notifier';
import {Observable} from 'rxjs';
import {FormContainer} from '../keys';
import {NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';

export abstract class CompanySettingsForm<T extends IIdObject> extends FormComponent<T> {
    private _id;
    loadDataOnInit = false;
    loadDataOnParamsChange = false;
    loadDataOnQueryParamsChange = false;
    errorHandler = new TranslateErrorHandler('errors');

    @Output()
    hide = new EventEmitter<void>();

    constructor(@Inject(Provider) protected _provider: Provider,
                @Inject(Router) protected _router: Router,
                @Inject(FormContainer) protected _parent,
                @Inject(ActivatedRoute) protected _route: ActivatedRoute,
                protected adapter: NgbDateAdapter<string>,
                @Inject(NotifierService) protected _notifier: NotifierService) {
        super();
    }

    loadData(id?) {
        this._id = id;
        super.loadData();
    }

    showLoading(initializing: boolean = false): () => void {
        return this._parent.showLoading(initializing);
    }

    setItem(item: T) {
        this.handleItem(item);
    }

    protected _getItem(id?: any): Observable<T> {
        return super._getItem(this._id);
    }

    protected _handleSuccessCreate() {
        super._handleSuccessCreate();
        this.resetAndHide();
    }

    protected _handleSuccessUpdate() {
        super._handleSuccessUpdate();
        this.resetAndHide();
    }

    reset() {
        this.form.reset();
        this.setItem(null);
    }

    resetAndHide() {
        this.reset();
        this._parent.hideCreateForm();
    }
}
