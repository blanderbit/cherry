import { Directive, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewContainerRef } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Directive({
    selector: '[noSSR]',
})
export class NoSSRDirective implements OnInit {
    public constructor(@Inject(ViewContainerRef) protected _viewContainerRef: ViewContainerRef,
                       @Inject(PLATFORM_ID) private _platformId: Object,
                       @Inject(TemplateRef) protected _templateRef: TemplateRef<any>) {

    }

    ngOnInit(): void {
        console.log('isPlatformServer(this._platformId)', isPlatformServer(this._platformId));
        if (!isPlatformServer(this._platformId)) {
            this._viewContainerRef.createEmbeddedView(this._templateRef);
        } else {
            this._viewContainerRef.clear();
        }
    }
}
