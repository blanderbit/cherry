/* SystemJS module definition */
import { PermissionActionType } from 'communication';
import { IOptionalPermissionActionProvider } from 'communication';
import { ColDef } from 'ag-grid-community';

declare var module: NodeModule;

interface NodeModule {
    id: string;
}

declare module 'ag-grid-community' {
    // tslint:disable-next-line:no-empty-interface
    interface ColDef extends IOptionalPermissionActionProvider {
    }
}
