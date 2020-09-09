import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import {HumanResourceStatus, IIdObject, IResource, ResourcesProvider} from 'communication';
import { DetailComponent } from 'components';
import { NotifierService } from 'notifier';
import { Observable, of, throwError } from 'rxjs';
import { DEFAULT_AVATAR, UserAvatarPipe } from '../user-avatar.pipe';

export interface IAvatarComponentParams {
    resource?: IResource | string | number;
    size: number;
}

export const INACTIVE_USER_AVATAR = 'assets/images/inactive-resource-avatar.svg';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
    providers: [
        UserAvatarPipe,
    ],
})
export class AvatarComponent extends DetailComponent<IResource> implements ICellRendererAngularComp, IAvatarComponentParams {
    private _item: IResource;
    public loadDataOnInit = false;
    public loadDataOnParamsChange = false;
    public loadDataOnQueryParamsChange = false;
    _showDeletedUserAvatar = false;

    @Input()
    public avatarUrl;

    @Input()
    public success: boolean;

    @Input()
    public showSuccessCheckMark = false;

    @Input()
    public size: number;

    @Input()
    public acronym: string = '';

    @HostBinding('class.error')
    protected error = false;

    @Input()
    set showDeletedUserAvatar(value) {
        if (value) {
            this.avatarUrl = INACTIVE_USER_AVATAR;
        }
        this._showDeletedUserAvatar = value;
    }

    get showDeletedUserAvatar() {
        return this._showDeletedUserAvatar;
    };

    @Input()
    set resource(value: IResource | string | number) {
        if (value) {
            if (isResource(value)) {
                this.item = value;
            } else {
                this.loadData(value);
            }
        }
    }

    set item(value: IResource) {
        this._item = value;

        if (!this.showDeletedUserAvatar && value && value.active) {
            this.avatarUrl = this._userAvatarPipe.transform(value && value.id, null);
        } else {
            this.avatarUrl = INACTIVE_USER_AVATAR;
        }
    }

    get item(): IResource {
        return this._item;
    }


    constructor(protected _userAvatarPipe: UserAvatarPipe,
        protected _http: HttpClient,
        protected _avatarPipe: UserAvatarPipe,
        protected _provider: ResourcesProvider,
        protected _notifier: NotifierService
    ) {
        super();
    }

    protected _handleLoadingError() {
        this.avatarUrl = DEFAULT_AVATAR;
    }

    protected _getItem(resource: IResource | string | number): Observable<IResource> {
        if (!resource) {
            return throwError('You have provided an incorrect resource or resource id');
        }

        if (isResource(resource)) {
            return of(resource);
        } else {
            return super._getItem(resource);
        }
    }

    agInit(params: ICellRendererParams & IAvatarComponentParams): void {
        const { resource, size } = params;

        if (resource) {
            this.resource = resource;
        }

        this.size = size || this.size;
    }

    refresh(): boolean {
        return true;
    }

    onImageError(): void {

        if (!this.item) {
            this.avatarUrl = null;
            return;
        }

        if (this.showDeletedUserAvatar && !this.item.active) {
            this.avatarUrl = INACTIVE_USER_AVATAR;
        } else {
            this.avatarUrl = null;
            this.acronym = this.acronym || this.item.name.acronym();
        }

    }
}

function isResource(obj: IIdObject | string | number): obj is IResource {
    if (typeof obj === 'object' && obj.id) {
        return true;
    }
}
