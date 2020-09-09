import { GridItemsComponent } from 'grid';

export abstract class ListHandler {
    abstract handleCreateItem(item, listComponent: GridItemsComponent<any>): boolean;
}
