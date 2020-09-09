import { Component, OnDestroy, OnInit } from '@angular/core';
import { RealtimeProvider } from 'communication';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'realtime-frame',
    templateUrl: './realtime-frame.component.html',
    styleUrls: ['./realtime-frame.component.scss'],
})
export class RealtimeFrameComponent implements OnInit, OnDestroy {
    messages = [];

    constructor(public realtimeProvider: RealtimeProvider) {
    }

    ngOnInit(): void {
        this.realtimeProvider.message.pipe(untilDestroyed(this)).subscribe(m => this.messages.push(m));
    }

    ngOnDestroy(): void {
    }
}
