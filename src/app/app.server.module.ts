import { Inject, NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { ServerFileModule } from 'platform-file-loader';
import { ServerCookieModule } from 'cookie-storage';

export class TokenInterceptor implements HttpInterceptor {
    constructor(@Inject(REQUEST) private _request: any) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const Authorization = this._request.cookies.token || '';
        request = request.clone({ headers: new HttpHeaders({ Authorization: `Bearer ${Authorization}` }) });
        return next.handle(request);
    }
}

@NgModule({
    imports: [
        // KanbanModule - FIRST!!!
        AppModule,
        ServerModule,
        NoopAnimationsModule,
        ServerTransferStateModule,
        ServerFileModule.forRoot({root: './dist/'}),
        ServerCookieModule.forRoot()
    ],
    bootstrap: [AppComponent],
    providers: [
    ],
})
export class AppServerModule {
}
