import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MyTaskProvider} from './my-task.provider';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddTaskDialogComponent} from '../add-task-dialog/add-task-dialog.component';
import {IActualTime, PermissionAction} from 'communication';
import {IWeekItem} from '../../../models';

@Component({
    selector: 'app-search-task',
    templateUrl: './task-search.component.html',
    styleUrls: ['./task-search.component.scss'],
    providers: [MyTaskProvider],
})

export class TaskSearchComponent implements AfterViewInit {
    private _addedItems: (IActualTime | IWeekItem)[] = [];
    provider = MyTaskProvider;
    searchQuery: string;
    permissionAction = PermissionAction;
    @ViewChild('autocompleteComponent', { static: false }) autocompleteComponent;

    @Input() set addedItems(value: (IActualTime | IWeekItem)[]) {
        this._addedItems = value;
    }

    get addedItems() {
        return this._addedItems;
    }

    @Output()
    onSelect = new EventEmitter();

    filteredItems = items => items.filter(el => !this.addedItems.find(i => getTaskId(i) === el.id));

    constructor(private dialogService: NgbModal) {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.autocompleteComponent.focusAutocompleteInput();
        });
    }

    createNewTask($event: MouseEvent) {
        $event.preventDefault();
        const instance = this.dialogService.open(AddTaskDialogComponent, {container: 'body'});

        instance.result
            .then(task => this.onSelect.emit(task))
            .catch(() => {});
    }

    setQuery($event: string) {
        this.searchQuery = $event;
    }
}

function getTaskId(item: IActualTime | IWeekItem): number {
    return <number>(item.taskId || (<IActualTime>item).id);
}
