import { Component, HostListener, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormComponent, ILoadingHandler } from 'components';
import { IHumanResource, IIdObject, ITaskComment } from 'communication';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskCommentsProvider } from '../../../../projects/communication/src/lib/services/common/task-comments.provider';
import { NotifierService } from 'notifier';
import { ActivatedRoute } from '@angular/router';
import { TaskDetailsComponent } from '../../common-tasks/task-details/task-details.component';
import { Translate } from 'translate';
import { getMentionName, IMentionsSubmitEvent } from '../../ui/mentions-input/mentions-input.component';

@Component({
    selector: 'app-task-comment',
    templateUrl: './task-comment.component.html',
    styleUrls: ['./task-comment.component.scss'],
    providers: [
        ...Translate.localizeComponent('task-comments'),
    ],
})
export class TaskCommentComponent extends FormComponent<ITaskComment> implements OnInit {
    private _item: ITaskComment;
    private _resources: IHumanResource[];
    needCreate = true;
    loadDataOnInit = false;
    loadDataOnParamsChange = false;
    hover = false;
    commentHtml = '';

    public editCommentAction = {
        icon: 'edit',
        title: 'edit',
        action: () => this.enableEditMode(),
    };
    public deleteCommentAction = {
        icon: 'delete',
        title: 'delete',
        action: () => this.deleteItem(this.item),
    };

    @Input() set resources(value: IHumanResource[]) {
        this._resources = value;
        this._highlightMentions();
    }

    get resources() {
        return this._resources ? this._resources : [];
    }

    @Input()
    set item(value: ITaskComment) {
        this._item = value;

        if (this.form) {
            this.setForm(value, false);
        }

        this._highlightMentions();
    }

    get item() {
        return this._item;
    }

    get creatorId() {
        return this.item && this.item.resourceId;
    }

    constructor(
        public _provider: TaskCommentsProvider,
        protected _notifier: NotifierService,
        protected _route: ActivatedRoute,
        @Optional() @Inject(TaskDetailsComponent) public loadingHandler: ILoadingHandler,
        private _parent: TaskDetailsComponent,
    ) {
        super();
    }

    enableEditMode() {
        if (this.needCreate) {
            this.needCreate = false;
        }
    }

    @HostListener('document:keydown.escape')
    cancelEdit() {
        this.setForm(this.item, false);

        if (!this.needCreate) {
            this.needCreate = true;
        }
    }

    protected _handleDeleteItem(item: IIdObject) {
    }

    protected _showSuccessDelete() {
    }

    protected _handleSuccessUpdate() {
        this.cancelEdit();
    }

    protected createForm(): FormGroup {
        return new FormGroup({
            text: new FormControl(null),
            mentions: new FormControl(null),
        });
    }

    private _highlightMentions() {
        if (!this.item) return;

        let text = serializeToSafeHTML(this.item.text);

        const highlightTextList = this._getMentions().map(resource => `@${getMentionName(resource)}`);

        highlightTextList.forEach(highlightText => {
            const regExp = new RegExp(highlightText, 'g');
            text = text.replace(regExp, `<span class='color-blue'>${highlightText}</span>`);
        });

        this.commentHtml = text;
    }

    private _getMentions(): IHumanResource[] {
        return this.resources.filter(resource => {
            return this.item.mentions.some(id => id === resource.id);
        });
    }

    onSendMessage(data: IMentionsSubmitEvent) {
        const mentions = data.mentions.map(mention => mention.id);
        this.controls.mentions.setValue(mentions, {emitEvent: false});

        this.apply();
    }
}

function serializeToSafeHTML(str): string {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
