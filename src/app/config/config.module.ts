import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FileLoader } from 'platform-file-loader';
import { ConfigurationConfig } from './configuraion.config';
import { PATH } from './path';
import { Config } from './config';

export function initConfig(loader: FileLoader, path: string, config: Config): Function {
    return () => loader
        .loadFile(path)
        .toPromise()
        .then(result => config.apply(result));
}

@NgModule()
export class ConfigModule {
    static configure(config: ConfigurationConfig) {
        return {
            ngModule: ConfigModule,
            providers: [
                {
                    provide: APP_INITIALIZER,
                    useFactory: initConfig,
                    multi: true,
                    deps: [FileLoader, PATH, Config],
                },
                {
                    provide: Config,
                    useExisting: config.configProvider,
                },
                {
                    provide: PATH,
                    useValue: config.path,
                },
            ],
        };
    }
}
