import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {IResource} from 'communication';
import {ICellRendererAngularComp} from 'ag-grid-angular';

export interface IAvatarStackComponentParams {
    defaultImageSrc?: string;
    shownCount?: number;
    hideRemainedAvatars?: boolean;

    ids: (number | IResource)[];
    successIds: number[];
}

@Component({
    selector: 'app-avatars-stack',
    templateUrl: './avatars-stack.component.html',
    styleUrls: ['./avatars-stack.component.scss'],
})
export class AvatarsStackComponent implements ICellRendererAngularComp, IAvatarStackComponentParams {
    private _ids: number[];
    private _successIds: number[];
    private _showCount: number = 3;

    @Input() hideRemainedAvatarsCount = false;
    @Input() avatarSize = 25;

    @Input()
    public gutter = -3;

    @Input() set showCount(value: number) {
        this._showCount = value;
    }

    get showCount() {
        if (!this.hideRemainedAvatarsCount && this.ids.length <= this._showCount) {
            return this._showCount;
        }

        return this._showCount - 1;
    }

    @Input() set successIds(v) {
        this._successIds = v;
    }

    get successIds() {
        return this._successIds || [];
    }


    @Input()
    set ids(value: any[]) {
        this._ids = value;
    }

    get ids() {
        return this._ids || [];
    }

    get showRemainedUsersCount() {
        return !this.hideRemainedAvatarsCount && this.ids.length > this.showCount;
    }

    get remainedUsersCount() {
        return this.ids.length - this.showCount;
    }

    constructor(private _cdr: ChangeDetectorRef) {
    }

    agInit(params): void {
        const p = params as IAvatarStackComponentParams & ICellRendererAngularComp;
        this.showCount = p.shownCount || this.showCount;
        this.hideRemainedAvatarsCount = p.hideRemainedAvatars || this.hideRemainedAvatarsCount;
        this.ids = p.ids;
        this.successIds = p.successIds;
        this._cdr.detectChanges();
    }

    refresh(params: any): boolean {
        return true;
    }
}
