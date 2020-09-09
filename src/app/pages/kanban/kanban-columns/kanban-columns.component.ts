import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IKanbanBoard, IKanbanColumn, IKanbanTask } from '../project-kanban-board/project-kanban-board.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ITypedFormGroup } from '../../settings/modules/company-settings/forms/holidays-policy-form/holidays-policy-form.component';
import { ItemsComponent } from 'components';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'notifier';
import { KanbanColumnsProvider } from '../../../../../projects/communication/src/lib/services/common/kanban-columns.provider';
import { finalize } from 'rxjs/operators';
import { IIdObject } from 'communication';

@Component({
    selector: 'app-kanban-columns',
    templateUrl: './kanban-columns.component.html',
    styleUrls: ['./kanban-columns.component.scss', '../kanban.component.scss']
})
export class KanbanColumnsComponent extends ItemsComponent<IKanbanColumn> implements OnInit {
    public loadDataOnInit = false;
    public loadDataOnParamsChange = false;
    public addColumnInProgress = false;
    public addTaskInProgress = false;
    addNewColumnForm = new FormGroup({
        name: new FormControl(null, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(256)
        ]),
    } as ITypedFormGroup<Partial<IKanbanBoard>>);

    @Input()
    public items: IKanbanColumn[];

    @ViewChild('newColumnNameInput', {static: false})
    public set newColumnNameInput(value: ElementRef<HTMLInputElement>) {
        if (value) {
            value.nativeElement.focus();
        }
    }

    constructor(
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _notifier: NotifierService,
        protected _provider: KanbanColumnsProvider,
    ) {
        super();
    }

    public getConnectedBoards(column: IKanbanColumn) {
        const ids = this.items.map(col => col.id);
        const filtered = ids.filter(id => id !== column.id);

        return filtered.filter(Boolean).map(i => i.toString());
    }

    public createColumn() {
        const hide = this.showLoading();

        return this._provider.createItem(this.addNewColumnForm.value)
            .pipe(finalize(hide))
            .subscribe((res) => console.log(res));
    }

    public toggleColumnAdd() {
        this.addColumnInProgress = !this.addColumnInProgress;
    }

    public hideColumnAdd(event?: Event) {
        if (event) {
            event.stopPropagation();
        }

        this.addColumnInProgress = false;
    }

    public showColumnAdd(event: Event) {
        if (!this.addColumnInProgress) {
            this.addColumnInProgress = true;
        }
    }

    // public addNewColumn(name: string) {
    //     this.items.push({
    //         id: Math.random(),
    //         name,
    //         taskCards: [],
    //     } as IKanbanColumn);
    //
    //     this.hideColumnAdd();
    // }

    // public onAddNewColumnSubmit(event: Event, name: string) {
    //     if (this.addColumnInProgress) {
    //         this.addNewColumn(name);
    //     } else {
    //         this.showColumnAdd(event);
    //     }
    // }

    public betweenBoardsDrop(event: CdkDragDrop<(IKanbanTask | IKanbanColumn)[]>) {
        console.log('E', event);
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

    protected _handleDeleteItem(items: IIdObject | IIdObject[]) {
        super._handleDeleteItem(items);
    }
}
