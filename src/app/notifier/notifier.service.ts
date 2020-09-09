import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformServer } from '@angular/common';
import { ErrorTranslateService } from './error-translate.service';


@Injectable()
export class NotifierService {
    get isPlatformServer() {
        return isPlatformServer(this.platformId);
    }

    constructor(private notifier: ToastrService,
                @Inject(PLATFORM_ID) private platformId: Object,
                @Optional() private translate: TranslateService,
                @Optional() private errorTranslateService: ErrorTranslateService) {
        const config = this.notifier.toastrConfig;

        config.closeButton = true;
        config.timeOut = 10000;
    }

    showSuccess(message: string | HttpErrorResponse) {
        if (!this.isPlatformServer) {
            this.notifier.success(this._getMessage(message));
        }
    }

    showError(message: string | HttpErrorResponse, defaultMessage?: string) {
        if (!this.isPlatformServer) {
            this.notifier.error(this._getMessage(message, defaultMessage));
        }
    }

    showWarning(message: string, defaultMessage?: string) {
        if (!this.isPlatformServer) {
            this.notifier.warning(this._getMessage(message, defaultMessage));
        }
    }

    private _getMessage(message: string | HttpErrorResponse, defaultMessage?: string): string {
        if (message instanceof HttpErrorResponse) {
            const {message: serverMessage, code, errors} = (message as any).error || {} as any;

            if (typeof code === 'number') {
                const messageFromCode = this.errorTranslateService.instant(code.toString());

                if (messageFromCode != code)
                    return messageFromCode;
                else
                    console.warn('Can\'t localize server code', code);
            }

            if (serverMessage && typeof serverMessage === 'string') {
                return serverMessage;
            } else if (errors)
                return getErrorsFromObject(errors);

            message = message.message;
        }

        if (message && message.includes(' ')) // this is sentences
            return message;

        let translatedMessage = message && this.translate.instant(message);

        if (translatedMessage === message && defaultMessage)
            translatedMessage = this.translate.instant(defaultMessage);

        return translatedMessage;
    }
}

function getErrorsFromObject(obj) {
    let result = '';

    for (const key in obj)
        result += obj[key];

    return result;
}
