import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, ContentChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { IKanbanTask } from '../project-kanban-board/project-kanban-board.component';
import { DateValidators } from 'date';
import { ITask } from 'communication';
import { FormComponent } from 'components';
import { KanbanTaskDirective } from '../kanban-task.directive';
import { NotifierService } from 'notifier';

@Component({
    selector: 'app-kanban-column-task',
    templateUrl: './kanban-column-task.component.html',
    styleUrls: ['./kanban-column-task.component.scss']
})
export class KanbanColumnTaskComponent extends FormComponent<IKanbanTask> implements OnInit {
    private _content: ElementRef<HTMLElement>;

    @Input()
    public item: IKanbanTask;

    @ContentChild(KanbanTaskDirective, {static: false, read: ElementRef})
    public set content(value: ElementRef<HTMLElement>) {
        this._content = value;
    }

    public get content() {
        return this._content;
    }

    constructor(
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _notifier: NotifierService,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    createForm() {
        return new FormGroup({
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(256),
            ]),
            description: new FormControl(''),
            currentStartDate: getDateControl(),
            currentEndDate: getDateControl(),
        }, {
            validators: [
                DateValidators.dateLessThan('currentStartDate', 'currentEndDate'),
            ],
        });
    }
}

function getDateControl() {
    return new FormControl(null, {
        validators: [Validators.required],
    });
}
