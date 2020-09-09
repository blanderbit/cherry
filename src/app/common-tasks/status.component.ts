import { Component } from '@angular/core';
import { ProjectStatus, TaskStatus } from 'communication';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-task-status',
    template: `
        <div class='status {{ _class }}'>
            {{"statusType." + status | translate }}
        </div>`,
    styleUrls: ['../ui/ag-grid/status/status.component.scss']
})
export class StatusComponent implements ICellRendererAngularComp {
    TaskStatus = TaskStatus;

    constructor() {
    }

    status: string;
    _class: string;

    agInit(params: any): void {
        const status = params.data.status;
        this._class = TaskStatus[status];
        this.status = status;
    }

    refresh(params) {
        this.agInit(params);
        return true;
    }
}
