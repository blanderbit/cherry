import { OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { finalize, first, switchMap, tap } from 'rxjs/operators';
import { IIdObject } from 'communication';
import { LoadingComponent } from './loading.component';
import { MetaService } from '@ngx-meta/core';

export abstract class DetailComponent<T extends IIdObject> extends LoadingComponent<null> implements OnInit {
    needCreate = false;
    item: T;
    protected _metaService: MetaService;

    protected _getItem(id?: any): Observable<T> {
        if (!id) {
            const {params = {}} = this.route.snapshot || {};
            id = params.id;
        }

        if (!id)
            return EMPTY;

        return this.provider.getItemById(id);
    }

    loadData(params?: any) {
        const hide = this.showLoading(true);

        this.getPermissions()
            .pipe(
                switchMap((() => this._getItem(params)
                    .pipe(first(), finalize(hide)))
                )
            ).subscribe(
            (item) => this.handleItem(item),
            (error) => this._handleLoadingError(error)
        );
    }

    protected handleItem(item: T) {
        if (!item || item.id)
            this.needCreate = true;

        this.item = item;

        this.handleMeta();
    }

    protected handleMeta() {
        const title = this._getMetaTitle();

        if (this._metaService && title) {
            this._metaService.setTitle(title, true);
        }
    }

    protected _getMetaTitle(): string {
        return this.item && this.item['name'];
    }

    protected _handleErrorDelete(error) {
        console.warn('Implement _handleErrorDelete', error);
    }

    protected _handleUpdateItem(item: T): boolean {
        if (!item || !this.item || this.item.id !== item.id)
            return false;

        this.item = {...this.item, ...item};
        return true;
    }

    protected _handleDeleteItem(item: IIdObject) {
        const id = item && item.id;
        if (id == null || !this.item || this.item.id !== id)
            return;

        this._navigateOnSuccessAction(); // todo: temporary solution (need test)
    }

    protected _handleLoadingError(error: Error) {
        return super._handleLoadingError(error);
    }
}
