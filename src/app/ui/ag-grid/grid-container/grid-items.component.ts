import { OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IIdObject } from 'communication';
import { ItemsComponent } from 'components';
import { GridContainerComponent } from 'src/app/ui/ag-grid/grid-container/grid-container.component';
import { IPaginationParams } from '../../../../../projects/communication/src/lib/models/pagination';
import { GridOptions } from 'ag-grid-community';

export abstract class GridItemsComponent<T extends IIdObject, P extends IPaginationParams = any> extends ItemsComponent<T, P>
    implements OnInit, OnDestroy {
    @ViewChild(GridContainerComponent, {static: false})
    grid: GridContainerComponent;
    gridFilterOptions: GridOptions = {
        isExternalFilterPresent: () => true,
        doesExternalFilterPass: this.doesExternalFilterPass.bind(this)
    };

    protected _handleUpdateItem(item: T) {
        try {
            if (!item)
                return;

            if (this.grid)
                this.grid.updateItem(item);
        } catch (e) {
            console.error('error', e);
        }
    }

    // todo: if you want intercept update the best solution is use _handleRealtimeCreateItem
    // protected _handleRealtimeCreateItem(message: IRealtimeMessage<T>) {
    //     // if (message && message.internal)
    //         super._handleRealtimeCreateItem(message);
    // }
    doesExternalFilterPass(node?) {
        return false;
    }

    protected _handleCreateItem(item) {
        try {
            if (Array.isArray(item)) {
                for (const i of item)
                    this._handleCreateItem(i);
                return;
            }

            if (this.grid && !this.grid.rowData.some(({id}) => item.id === id)) {
                this.grid.addItem(item);

                if (this.loadDataOnQueryParamsChange) {
                    this.totalItems = this.totalItems + 1;
                }
            }

        } catch (e) {
            console.error('error', e);
        }
    }

    protected _handleDeleteItem(item) {
        try {
            if (Array.isArray(item)) {
                for (const i of item)
                    this._handleDeleteItem(i);
                return;
            }

            if (this.grid) {
                const index = this.grid.rowData.findIndex(({id}) => id == item.id);

                if (index !== -1) {
                    this.grid.removeItem(item);
                    if (this.loadDataOnQueryParamsChange) {
                        this.totalItems = this.totalItems - 1;
                    }
                }
            }
        } catch (e) {
            console.error('error', e);
        }
    }
}
