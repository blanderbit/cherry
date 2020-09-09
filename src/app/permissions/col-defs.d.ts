import { IPermissionsData } from './models';
import { ColDef as ColDefType } from 'ag-grid-community';

declare type ColDef = ColDefType & IPermissionsData;
