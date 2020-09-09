import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FormComponent } from 'components';
import { IItem } from 'menu';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { IKanbanColumn } from '../project-kanban-board/project-kanban-board.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'notifier';
import { KanbanColumnsProvider } from '../../../../../projects/communication/src/lib/services/common/kanban-columns.provider';
import { IIdObject } from 'communication';
import { Observable, of, throwError } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Component({
    selector: 'app-kanban-column',
    templateUrl: './kanban-column.component.html',
    styleUrls: ['./kanban-column.component.scss', '../kanban.component.scss']
})
export class KanbanColumnComponent extends FormComponent<IKanbanColumn> implements OnInit {
    private _item: IKanbanColumn;
    public loadDataOnInit = false;
    public loadDataOnParamsChange = false;
    public nameEditInProgress = false;
    public autoSave = true;
    public revertChangesOnError = true;
    // public patchFields: {[key in keyof I]} = []

    @ViewChild('columnName', {read: ElementRef, static: true})
    public columnName: ElementRef<HTMLDivElement>;

    @Input()
    public set item(value: IKanbanColumn) {
        this._item = value;
    }

    public get item() {
        return this._item;
    }

    public menuItems: IItem[] = [];

    get actualTime() {
        const tasks = this.item && this.item.taskCards;

        return (tasks || []).reduce((prev, curr) => prev + curr.actualTime, 0);
    }

    get plannedTime() {
        const tasks = this.item && this.item.taskCards;

        return (tasks || []).reduce((prev, curr) => prev + curr.plannedTime, 0);
    }

    constructor(
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _notifier: NotifierService,
        protected _provider: KanbanColumnsProvider,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.handleItem(this.item);
    }

    protected _handleUpdateError(error: any) {
        super._handleUpdateError(error);
    }

    addTask() {
        console.log('ADD TASK');
        // TODO: Implement
    }

    editName() {
        this.nameEditInProgress = true;
        setTimeout(() => this.columnName.nativeElement.focus());
    }

    deleteItem() {
        super.deleteItem(this.item);
    }

    protected _navigateOnSuccessAction(item?: null) {
        // prevent navigation
        return;
    }

    protected createForm() {
        return new FormGroup({
            name: new FormControl(null, {
                validators: [Validators.required],
                updateOn: 'blur'
            }),
        });
    }
}
