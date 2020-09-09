import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { LocalizationService } from '../../localization.service';
import { ColDef } from 'ag-grid-community';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    private _resize$ = new Subject();
    public resize$ = this._resize$.asObservable();

    static gridDateFormatter = (params) => {
        const date = params.value;

        if (!date) {
            return;
        }

        if (typeof date === 'string') {
            return moment(date).locale(LocalizationService.locale).format('ll');
        }

        return (new Date(params.value)).toLocaleDateString();
    }

    static getColDefHeader(colDef: ColDef) {
        const {headerValueGetter, headerName} = (colDef || <ColDef>{});

        if (headerValueGetter) {
            return typeof headerValueGetter === 'function' ? headerValueGetter() : headerValueGetter;
        }

        return headerName;
    }

    resizeGrid(delay = 0) {
        setTimeout(() => {
            this._resize$.next(null);
        }, delay);
    }

    exportToCSV(projects = false) {
        // const params = projects ? this._getProjectsExportParams() : this._getExportParams();
        // this._gridApi.exportDataAsCsv(params);
    }

    // private _getExportParams(): BaseExportParams {
    //     // const rowsSelected = !!this._gridApi.getSelectedRows().length;
    //
    //     return {
    //         suppressQuotes: true,
    //         fileName: 'data',
    //         // onlySelectedAllPages: rowsSelected,
    //
    //         processCellCallback: (param) => {
    //             const colId = param.column['colId'];
    //             const data = <IDetailedTask>param.node.data;
    //             console.log('DATA', data);
    //
    //             if (param.value && param.value.toUpperCase) {
    //                 return param.value.toUpperCase();
    //             }
    //
    //             if (colId === 'taskStatus' || colId === 'status') {
    //                 const status = param.node.data.status;
    //                 if (status != null && TaskStatus[status]) {
    //                     return TaskStatus[status].replace(/([a-z])([A-Z])/, '$1 $2');
    //                 } else {
    //                     return status;
    //                 }
    //             }
    //
    //             if (colId === 'startDate') {
    //                 console.log('START DATE', data.startDate);
    //                 return new Date(data.startDate).toString();
    //             }
    //             if (colId === 'endDate') {
    //                 return new Date(data.endDate).toString();
    //             }
    //             if (colId === 'lastModified') {
    //                 return new Date(data.lastModified).toString();
    //             }
    //             if (colId === 'assignee') {
    //                 return data.assignee.map(a => a.userId).join('    ');
    //                 // if (!data.assignedUsers || !data.assignedUsers.length) {
    //                 //     return '-';
    //                 // } else return data.assignedUsers.map(getFullName).join('   ');
    //             }
    //
    //             if (colId === 'project') {
    //                 const project = data.project;
    //                 return project && project.name;
    //             }
    //
    //             if (colId === 'creator') {
    //                 const creator = (<IDetailedTask>data).creator;
    //                 console.log('CREATOR', creator, creator ? getFullName(creator) : '-');
    //                 return creator ? getFullName(creator) : '-';
    //             } else {
    //                 return param.value;
    //             }
    //         },
    //         processHeaderCallback: (param) => {
    //             return param.column.getColDef().headerName.toUpperCase();
    //         },
    //     };
    // }
    //
    // private _getProjectsExportParams() {
    //     const rowsSelected = !!this._gridApi.getSelectedRows().length;
    //     const visibleColumns = this._gridColumnsApi.getAllDisplayedColumns()
    //         .filter(col => col.getColId() !== 'gantt' && col.getColId() !== 'members');
    //
    //     return {
    //         suppressQuotes: true,
    //         fileName: 'data',
    //         onlySelectedAllPages: rowsSelected,
    //         columnKeys: visibleColumns,
    //
    //         processCellCallback: (param) => {
    //             const colId = param.column['colId'];
    //             const data = <IDetailedTask>param.node.data;
    //
    //             if (param.value && param.value.toUpperCase) {
    //                 return param.value.toUpperCase();
    //             }
    //
    //             if (colId === 'status') {
    //                 const status = param.node.data.status;
    //                 if (status != null && ProjectStatus[status]) {
    //                     return ProjectStatus[status].replace(/([a-z])([A-Z])/, '$1 $2');
    //                 } else {
    //                     return status;
    //                 }
    //             }
    //
    //             if (colId === 'startDate') {
    //                 return new Date(data.startDate).toString();
    //             }
    //             if (colId === 'endDate') {
    //                 return new Date(data.endDate).toString();
    //             }
    //             if (colId === 'lastModified') {
    //                 return new Date(data.lastModified).toString();
    //             }
    //             // if (colId === 'members') {
    //             //     return data.members.join(' ');
    //             // }
    //             // if (colId === 'assignee') {
    //             //     if (!data.assignedUsers || !data.assignedUsers.length) {
    //             //         return '-';
    //             //     } else return data.assignedUsers.map(getFullName).join('   ');
    //             // }
    //
    //             if (colId === 'creator') {
    //                 const creator = (<IDetailedTask>data).creator;
    //                 return creator ? getFullName(creator) : '-';
    //             } else {
    //                 return param.value;
    //             }
    //         },
    //         processHeaderCallback: (param) => {
    //             return param.column.getColDef().headerName.toUpperCase();
    //         },
    //     };
    // }
}

