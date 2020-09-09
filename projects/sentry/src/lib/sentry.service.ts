import { Injectable, ErrorHandler, Inject } from '@angular/core';
import * as Sentry from '@sentry/browser';
import { SentryConfig } from './config';

@Injectable({
    providedIn: 'root'
})
export class SentryErrorHandler implements ErrorHandler {

    constructor(@Inject(SentryConfig) protected _communicationConfig: SentryConfig ) { }

    handleError(error) {
        console.log(error);
        if (!this.initIfNeed())
            return;

        const eventId = Sentry.captureException(error.originalError || error);
        Sentry.showReportDialog({ eventId });
    }

    private initIfNeed(): boolean {
        const config = this._communicationConfig,
            sentryConfig = config && config.sentry,
            dsnUrl = sentryConfig && sentryConfig.dsn;

        if (dsnUrl && sentryConfig.enable) {
            Sentry.init({ dsn: dsnUrl });
            return true;
        }

        return false;
    }
}
