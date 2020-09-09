import { Component, Inject, Input, Optional } from '@angular/core';
import { ItemsComponent, LoadingComponent, objOrDefault } from 'components';
import { HumanResourcesProvider, IRealtimeMessage, IResource, ITask, ITaskComment } from 'communication';
import { TaskCommentsProvider } from '../../../../projects/communication/src/lib/services/common/task-comments.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'notifier';
import { IPaginationParams } from '../../../../projects/communication/src/lib/models/pagination';
import * as moment from 'moment';
import { COMMENTS_PAGE_SIZE, FIRST_PAGE_DESC_PARAMS, ITaskCommentsComponent, TaskCommentsParams } from '../../common-tasks/task-comments';
import { TaskCommentsManagerService } from '../task-comments-manager.service';
import { ProfileService } from '../../identify/profile.service';
import { TaskCommentComponent } from '../task-comment/task-comment.component';
import { Translate } from 'translate';
import { take } from 'rxjs/operators';
import { IPermissionsDirectiveData } from 'permissions';

export interface ITaskCommentsParams extends IPaginationParams {
    descending: boolean;
    taskId: number | string;
    orderBy: string;
}

@Component({
    selector: 'app-task-comments',
    templateUrl: './task-comments.component.html',
    styleUrls: ['./task-comments.component.scss'],
    providers: [
        ...Translate.localizeComponent('task-comments'),
    ]
})
export class TaskCommentsComponent extends ItemsComponent<ITaskComment, Partial<ITaskCommentsParams>>
    implements ITaskCommentsComponent, IPermissionsDirectiveData {
    loadDataOnParamsChange = false;
    loadDataOnInit = false;
    dividerVisibilityMap: { [key: number]: any } = {};
    hoveredItem: ITaskComment;
    menuShownForItem: ITaskComment;
    commentInEditMode: TaskCommentComponent;
    mentionResources: IResource[] = [];

    @Input() task: ITask;
    @Input() hideActions = false;

    get taskId(): number {
        return +(<{ id: string }>this.route.snapshot.params).id;
    }

    get descending() {
        return this.manager.descending;
    }

    get creatorId(): number {
        return this.hoveredItem && this.hoveredItem.resourceId;
    }

    get membersIds() {
        return this.task.assignments.map(i => i.resourceId);
    }

    constructor(
        protected _provider: TaskCommentsProvider,
        protected _router: Router,
        protected _route: ActivatedRoute,
        protected _notifier: NotifierService,
        public manager: TaskCommentsManagerService,
        protected _profile: ProfileService,
        private _usersProvider: HumanResourcesProvider,
        @Optional() @Inject(LoadingComponent) public parent,
    ) {
        super();
        this.loadingHandler = parent;

        manager.initFinished$
            .pipe(take(1))
            .subscribe(() => this.loadData());
    }

    setCommentInEditMode(comment: TaskCommentComponent) {
        if (this.commentInEditMode && this.commentInEditMode !== comment) {
            this.commentInEditMode.needCreate = true;
        }

        this.commentInEditMode = comment;
    }

    getParams(params?): Partial<ITaskCommentsParams> {
        const {taskId} = this;
        return {
            taskId,
            orderBy: 'createdAt',
            take: COMMENTS_PAGE_SIZE,
            ...params,
        };
    }

    loadData(params?: TaskCommentsParams) {
        const {manager} = this;
        const {descending: prevDescending = false} = objOrDefault<ITaskCommentsParams>(this._params);
        const {
            skip = getSkip(params, this._params),
            descending = prevDescending
        } = objOrDefault<ITaskCommentsParams>(params);

        const requestRequired = !(params && prevDescending === descending);

        setTimeout(() => {
            if (this.allItemsLoaded) {
                if (params) {
                    if (!descending) {
                        manager.scrollToTop();
                    } else {
                        manager.scrollToBottom();
                    }
                }
            } else {
                if (skip === 0 && !descending && this.items && this.items.length) {
                    manager.scrollToTop();
                }

                manager.descending = descending;
                super.loadData({...this.getParams(), ...params, descending, skip});
            }
        });
    }

    protected _handleResponse(response: ITaskComment[]) {
        const {manager} = this;
        const scrollContainer = manager.scrollContainer;

        const scrollTopPercentage = 100 * ((scrollContainer.scrollTop) / (scrollContainer.scrollHeight - scrollContainer.offsetHeight));
        const {skip = 0} = objOrDefault(this._params);
        const scrollToEnd = skip === 0 && (this.items || []).length;

        this.responseHandling = skip === 0 ? null : 'append';

        super._handleResponse(response);
        this.setDateSplitters();

        setTimeout(() => {
            if (!this.allItemsLoaded && this.descending && skip !== 0) {
                this._normalizeScrollTop(scrollTopPercentage);
            }

            manager.updateScrollToTopDistance();

            if (!!response.length && this.descending && skip === 0) {
                this.manager.scrollToBottom();
            }

            // if (scrollToEnd) {
            //     if (this.descending) {
            //         manager.scrollToBottom();
            //     } else {
            //         if (skip !== 0)
            //             manager.scrollToTop();
            //         // manager.scrollToBottom();
            //     }
            // }
        }, 200);

        this._getMentionResources();
    }

    public trackBy(index, item: ITaskComment) {
        return item.id;
    }

    public setDateSplitters() {
        let date;

        this.items.forEach((comment, index) => {
            const item = this.items[index];
            const nextItem = this.items[index + 1];

            if (item) {
                const itemDate = moment(item.createdAt).startOf('day');

                if (this.descending && nextItem) {
                    const nextItemDate = moment(nextItem.createdAt).startOf('day');

                    if (!itemDate.isSame(nextItemDate)) {
                        this.dividerVisibilityMap[item.id] = item.createdAt;
                    }
                }

                if (!this.descending && !itemDate.isSame(date)) {
                    date = itemDate;
                    this.dividerVisibilityMap[item.id] = item.createdAt;
                }
            }
        });
    }

    protected _handleRealtimeCreateItem(message: IRealtimeMessage<ITaskComment>) {
        if (message.payload.taskId === this.taskId) {
            super._handleRealtimeCreateItem(message);
        }
    }

    protected _handleCreateItem(item: ITaskComment) {
        // if user add a message - load last messages
        if (!this.allItemsLoaded && item.resourceId === this._profile.resourceId && !this.descending) {
            return this.loadData(FIRST_PAGE_DESC_PARAMS);
        }

        super._handleCreateItem(item, this.descending ? 'prepend' : 'append');

        this.setDateSplitters();
       this._getMentionResources();

        setTimeout(() => {
            this.manager.scrollToBottom();
        }, 100);
    }

    private _getMentionResources() {
        this._usersProvider.getBaseItemsByIds(this._getMentionIds())
            .subscribe((resources: IResource[] ) => {
                this.mentionResources = resources;
            });
    }

    private _getMentionIds(): number[] {
        const uniqueIds = new Set();

        this.items.forEach(comment => {
            comment.mentions.forEach(id => uniqueIds.add(id));
        });

        return Array.from(uniqueIds) as number[];
    }

    /**
     * @description
     * Move scroll top to same position(percentage) after request finished
     */
    private _normalizeScrollTop(scrollTopPercentageBefore: number) {
        const scrollContainer = this.manager.scrollContainer;
        const scrollTopHeight = (scrollContainer.scrollHeight) * scrollTopPercentageBefore / 100;

        scrollContainer.scrollTop = (scrollTopHeight + scrollContainer.offsetHeight);
    }
}

function getSkip(params: ITaskCommentsParams, prevParams: Partial<ITaskCommentsParams>) {
    const {skip} = objOrDefault<ITaskCommentsParams>(params);
    const {skip: prevSkip} = objOrDefault<ITaskCommentsParams>(prevParams);

    if (skip != null) {
        return skip;
    }

    return prevSkip != null ? prevSkip + COMMENTS_PAGE_SIZE : 0;
}
