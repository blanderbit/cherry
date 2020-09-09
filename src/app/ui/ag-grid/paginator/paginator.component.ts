import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPaginationParams } from '../../../../../projects/communication/src/lib/models/pagination';

export const DEFAULT_PAGE_SIZE = 20;

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit, IPaginationParams {
    public pageSizeOptions: number[] = [10, DEFAULT_PAGE_SIZE, 25];
    public totalItems = 0;
    private _skip: number;
    private _take: number;

    set take(take: number) {
        if (take != null) {
            this._take = take;
            this.setPaginationQueryParams();
        }
    }

    get pageDescription() {
        const current = this.totalItems !== 0 ? `${this.topRowIndex}-${this.bottomRowIndex}` : 0;

        return `${current} of ${this.totalItems || 0}`;
    }

    get take() {
        return this._take;
    }

    set skip(value: number) {
        if (value != null && value >= 0) {
            this._skip = value;
            this.setPaginationQueryParams();
        }
    }

    get skip() {
        return this._skip;
    }

    get totalPages(): number {
        return Math.ceil((this.totalItems / this.take) || 1);
    }

    get totalFullPages() {
        return Math.floor(this.totalItems / this.take);
    }

    get topRowIndex() {
        return this.skip + 1;
    }

    get bottomRowIndex() {
        if (this.isLastPage) {
            return this.totalItems;
        } else {
            return (this.skip + this.take);
        }
    }

    get page() {
        return Math.floor(this.skip / this.take) + 1;
    }

    get isFirstPage() {
        return this.page === 1;
    }

    get isLastPage() {
        return this.page === this.totalPages;
    }

    constructor(private _router: Router,
                private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this._route.queryParams.subscribe(params => {
            const {skip, take, totalItems} = params;

            if (totalItems) {
                this.totalItems = +totalItems;
            }

            if (+skip !== this.skip || +take !== this.take) {
                this.skip = +skip;
                this.take = +take || this.take;
            }
        });
    }

    public setPaginationQueryParams() {
        const {skip = 0, take = DEFAULT_PAGE_SIZE} = this;

        this._router.navigate([], {
            queryParams: {skip, take},
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    onPageSizeChange(take: number) {
        this.take = take;
    }

    goToFirstPage() {
        this.skip = 0;
    }

    goToPrevPage() {
        this.skip -= this.take;
    }

    goToNextPage() {
        this.skip += this.take;
    }

    goToLastPage() {
        this.skip = this.take * this.totalFullPages;
    }
}

