import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserFileLoader } from './browser-file.loader';
import { FileLoader } from '../file.loader';
import { ROOT } from '../root';

@NgModule()
export class BrowserFileModule {
    static forRoot(config: { root: string }): ModuleWithProviders {
        return {
            ngModule: BrowserFileModule,
            providers: [
                {
                    provide: FileLoader,
                    useClass: BrowserFileLoader,
                },
                {
                    provide: ROOT,
                    useValue: config.root,
                },
            ],
        };
    }
}
