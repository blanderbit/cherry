import { Component, Input, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

type QueryParamsHandling = 'merge' | 'preserve' | '';

export interface ILinkComponentParams {
    queryParamsHandling: QueryParamsHandling;
    navigate: (params: any, router: Router, route: ActivatedRoute) => any;
    title: string;
}

@Component({
    selector: 'app-link',
    template: `<a (click)="onLinkClick()" [attr.title]="title"
                  class="zs-12 l-h-16 text-overflow-ellipsis">
        {{ params.value }}
    </a>`,
    styles: [
        ':host {width: 100%; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;}',
    ],
})
export class LinkComponent implements ILinkComponentParams {
    public params: any;

    @Input()
    public queryParamsHandling: QueryParamsHandling = '';

    @Input() title = null;

    navigate = (params: any, router: Router, route: ActivatedRoute) => {
        router.navigate([`${params.data.id}`], {
            relativeTo: this._route,
            queryParamsHandling: this.queryParamsHandling,
        }).then();
    }

    get paramsData() {
        const { params } = this;

        if (params && params.hasOwnProperty('data')) {
            return params.data;
        }

        return null;
    }

    constructor(private _ngZone: NgZone,
                private _router: Router,
                private _route: ActivatedRoute) {
    }

    public agInit(params: ILinkComponentParams): void {
        this.params = params;
        const { queryParamsHandling, navigate, title } = params;

        this.queryParamsHandling = queryParamsHandling;
        this.navigate = navigate || this.navigate;
        this.title = title;
    }

    public onLinkClick() {
        if (this.navigate) {
            this._ngZone.run(() => this.navigate(this.params, this._router, this._route));
        }
    }
}

