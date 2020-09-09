import { Injectable, Provider } from '@angular/core';
import { IProject, ProjectsProvider } from 'communication';
import { CreateService } from './create.service';
import { ALIAS } from 'src/app/create/alias';
import { CreateComponentConfig, ICreateComponentConfig } from './providers';
import { DashboardRoutes } from '../pages/dashboard/dashboard.routes';

@Injectable()
export class ProjectsCreateService extends CreateService {
    getCreateProvider() {
        return ProjectsProvider;
    }

    getModuleAlias() {
        return ALIAS.Projects;
    }
}

export class AgileProjectsCreateService extends ProjectsCreateService {
    getProviders(): Provider[] {
        return [
            {
                provide: CreateComponentConfig,
                useValue: {
                    hideTypeCheckboxes: true,
                    onSuccessCreate: this._onSuccessCreate.bind(this)
                } as ICreateComponentConfig,
            },
        ];
    }

    private _onSuccessCreate(item: IProject): void {
        this.router.navigate([DashboardRoutes.Kanban, item.id]);
    }
}
