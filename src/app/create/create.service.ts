import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable, Injector, Provider } from '@angular/core';
import { CreateComponent } from './components/create.component';
import { TranslateService } from '@ngx-translate/core';
import { CreateComponentConfig, CreateProvider, ICreateComponentConfig, ModuleAlias } from './providers';
import { translateServiceFactory } from 'translate';
import { IBaseTask, IBasicTask, ITask, ITaskWithProgressDetails, Provider as CommunicationProvider } from 'communication';
import { ActivatedRoute, Router } from '@angular/router';

export interface ICreateServiceConfig {
    provider?: CommunicationProvider;
}

@Injectable()
export abstract class CreateService<T extends ICreateServiceConfig = ICreateServiceConfig> {

    constructor(protected modalService: NgbModal,
                protected router: Router,
                protected route: ActivatedRoute,
                protected injector: Injector) {
    }

    abstract getCreateProvider();

    abstract getModuleAlias();

    create(args?: T) {
        this._create(args && args.provider);
    }

    protected _create(createProvider?: CreateProvider, providers?: Provider[]) {
        this.modalService.open(CreateComponent, {
            windowClass: 'create-dialog',
            injector: Injector.create({
                parent: this.injector,
                providers: [
                    createProvider ?
                        {
                            provide: CreateProvider,
                            useValue: createProvider
                        } :
                        {
                            provide: CreateProvider,
                            useExisting: this.getCreateProvider()
                        },
                    {
                        provide: TranslateService,
                        useFactory: translateServiceFactory(`${this.getModuleAlias()}-create`),
                        deps: [Injector]
                    },
                    {
                        provide: ModuleAlias,
                        useValue: this.getModuleAlias(),
                    },
                    providers,
                    this.getProviders(),
                ]
            })
        });
    }

    getProviders(): Provider[] {
        return [];
    }
}
