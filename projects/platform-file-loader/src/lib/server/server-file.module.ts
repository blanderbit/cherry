import { ModuleWithProviders, NgModule } from '@angular/core';
import { ServerFileLoader } from './server-file.loader';
import { FileLoader } from '../file.loader';
import { ROOT } from '../root';

@NgModule()
export class ServerFileModule {
    static forRoot(config: { root: string }): ModuleWithProviders {
        return {
            ngModule: ServerFileModule,
            providers: [
                {
                    provide: FileLoader,
                    useClass: ServerFileLoader,
                },
                {
                    provide: ROOT,
                    useValue: config.root,
                },
            ],
        };
    }
}
