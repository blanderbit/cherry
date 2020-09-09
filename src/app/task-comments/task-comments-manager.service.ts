import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { TaskDetailsComponent } from '../common-tasks/task-details/task-details.component';

export interface IScrollToParams {
    top?: number;

    onScrollEnd?(): void;
}

const DEFAULT_SCROLL_TO_PARAMS: IScrollToParams = {
    onScrollEnd: () => {
    },
};

@Injectable()
export class TaskCommentsManagerService {
    private _descending = false;
    private _initFinished$ = new Subject<boolean>();
    public initFinished$ = this._initFinished$.asObservable();
    infiniteScrollDisabled = false;
    scroll$: Observable<any>;
    scrollToTopDistance: number;
    atTheBottom = false;
    taskDetailsComponent: TaskDetailsComponent;

    set descending(value) {
        this._descending = value;
    }

    get descending() {
        return this._descending;
    }

    get scrollContainer() {
        return this.taskDetailsComponent && this.taskDetailsComponent.scrollContainer.nativeElement;
    }

    get comments() {
        return this.taskDetailsComponent && this.taskDetailsComponent.comments.nativeElement;
    }

    init(component: TaskDetailsComponent) {
        this.taskDetailsComponent = component;
        const {scrollContainer, comments} = component;

        if (scrollContainer && comments) {
            this.setScrollData();
            this.emitInitFinished();
        }
    }

    emitInitFinished() {
        this._initFinished$.next(true);
    }

    setScrollData(): void {
        const {scrollContainer, comments} = this;
        if (scrollContainer && comments) {

            this.scroll$ = fromEvent(scrollContainer, 'scroll')
                .pipe(debounceTime(200));

            this.scroll$.subscribe((v) => {
                const {scrollHeight, offsetHeight, scrollTop} = scrollContainer;
                const buffer = scrollHeight * 0.2;

                this.atTheBottom = (scrollTop + offsetHeight + buffer) >= scrollHeight;
            });
        }
    }

    scrollTo(params: IScrollToParams) {
        const {onScrollEnd, top} = params;
        const scroll = this.scrollContainer;
        this.infiniteScrollDisabled = true;

        this.scroll$.pipe(
            takeWhile(() => this.infiniteScrollDisabled),
        ).subscribe(() => {
            if (this.infiniteScrollDisabled) {
                this.infiniteScrollDisabled = false;
            }

            onScrollEnd();
        });

        scroll.scrollTo({top, behavior: 'smooth'});
    }

    scrollToTop(params: IScrollToParams = DEFAULT_SCROLL_TO_PARAMS) {
        const {offsetHeight} = this.scrollContainer;

        this.scrollTo({
            top: this.comments.offsetTop - (offsetHeight / 2),
            ...params,
        });
    }

    scrollToBottom(params: IScrollToParams = DEFAULT_SCROLL_TO_PARAMS): void {
        const {scrollHeight, offsetHeight} = this.scrollContainer;
        this.scrollTo({
            top: scrollHeight + offsetHeight,
            ...params
        });
    }

    getScrollTopDistance(): number {
        const {scrollContainer, comments} = this;
        const scrollHeight = scrollContainer.scrollHeight;
        const buffer = scrollHeight * 0.3;

        if (scrollContainer && comments) {
            return Math.ceil(((comments.offsetTop + buffer) * 100) / scrollHeight / 10);
        }
    }

    updateScrollToTopDistance() {
        this.scrollToTopDistance = this.getScrollTopDistance();
    }
}
