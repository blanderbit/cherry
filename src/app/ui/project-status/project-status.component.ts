import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { ProjectStatus } from 'communication';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-project-status',
    template: `
        <div class='status {{ statusClass }}'>
            {{("status." + status) | translate }}
        </div>`,
    styleUrls: ['../ag-grid/status/status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStatusComponent implements ICellRendererAngularComp, OnDestroy {
    private _status: any;
    public Status = ProjectStatus;
    public statusClass: string;

    @Input()
    public set status(status: ProjectStatus) {
        this._status = status;
        this.statusClass = ProjectStatus[status];
    }

    public get status() {
        return this._status;
    }

    agInit(params: any): void {
        this.status = params.data.status;
    }

    refresh(params: any): boolean {
        return true;
    }

    ngOnDestroy() {
        console.log('PROJECT STATUS DESTROYED');
    }
}
