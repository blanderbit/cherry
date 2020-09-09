import { Component, ContentChild, EventEmitter, Injector, Input, Output, TemplateRef } from '@angular/core';
import { IResource, ResourceKind, ResourcesProvider } from 'communication';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailComponent } from 'components';
import { EMPTY, Observable } from 'rxjs';
import { NotifierService } from '../../notifier/notifier.service';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';

export interface IUserSummaryComponentParams {
    user: IResource | number;
    showAvatar: boolean;
}

const DEFAULT_USER = {name: 'resource not found'} as Partial<IResource>;

@Component({
    selector: 'app-user-summary',
    templateUrl: './user-summary.component.html',
    styleUrls: ['./user-summary.component.scss']
})
export class UserSummaryComponent extends DetailComponent<IResource> implements ICellRendererAngularComp {
    loadDataOnInit = false;
    loadDataOnParamsChange = false;
    loadDataOnQueryParamsChange = false;
    ResourceKind = ResourceKind;

    _resourceId;

    @Input()
    set user(value: IResource | number) {
        if (typeof value === 'number') {
            this._resourceId = value;
            this.loadData();
        } else {
            this.item = value;
        }

        if (this.item && this.item.kind === ResourceKind.Generic)
            this.showAvatar = false;
    }

    @Input() showAvatar = true;
    @Input() avatarSize: number = 40;
    @Input() removable = false;
    @Input() ownerId: number;
    @Input() gutter = 8;
    @Input() removeDisabled = false;
    @Input() success = false;
    @Output() remove = new EventEmitter<IResource>();

    @ContentChild(TemplateRef, {static: false}) userTemplate: TemplateRef<any>;



    constructor(protected _ngbModal: NgbModal,
                protected _injector: Injector,
                protected _provider: ResourcesProvider,
                protected _route: ActivatedRoute,
                protected _notifier: NotifierService) {
        super();
    }

    public onRemove() {
        this.remove.emit(this.item);
    }

    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    }

    agInit(params: ICellRendererParams & IUserSummaryComponentParams): void {
        const {user, showAvatar} = params;

        this.user = user;
        this.showAvatar = showAvatar != null ? showAvatar : true;
    }

    protected handleItem(item: IResource<any>) {
        this.user = item;
    }

    refresh(params: any): boolean {
        return true;
    }

    protected _getItem(id?: any): Observable<IResource> {
        return this._resourceId ? super._getItem(this._resourceId) : EMPTY;
    }

    protected _handleLoadingError(error: Error) {
        this.item = DEFAULT_USER as any;
        return super._handleLoadingError(error);
    }
}
