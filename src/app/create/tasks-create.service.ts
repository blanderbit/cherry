import { Injectable, Provider } from '@angular/core';
import { CreateService, ICreateServiceConfig } from './create.service';
import { CreateComponentConfig, ICreateComponentConfig } from './providers';
import { ALIAS } from 'src/app/create/alias';
import { ITask, TasksProvider } from 'communication';
import { TaskWithFakeDateFields } from './components/create.component';
import { ProjectId } from '../common-tasks/token/token';

interface ITasksCreateServiceConfig extends ICreateServiceConfig {
    projectId?: number;
}


@Injectable()
export class TasksCreateService extends CreateService<ITasksCreateServiceConfig> {
    getCreateProvider() {
        return TasksProvider;
    }

    getModuleAlias() {
        return ALIAS.Tasks;
    }

    create(args: ITasksCreateServiceConfig = {}) {
        super._create(args.provider, [{provide: ProjectId, useValue: args.projectId}]);
    }

    onSuccessCreate(item: ITask): void {
        const projectId = item.projectId;
        const navigationData = TasksProvider.getTaskDetailsNavigationData(item.id, projectId);

        this.router.navigate(navigationData.segments, {
            queryParams: navigationData.queryParams,
        });
    }

    getProviders(): Provider[] {
        return [
            {
                provide: CreateComponentConfig,
                useValue: {
                    handleRequestParams: (params: Partial<TaskWithFakeDateFields>): Partial<TaskWithFakeDateFields> => {
                        const {startDate, endDate, ...task} = params;

                        return {
                            ...task,
                            currentStartDate: startDate,
                            currentEndDate: endDate,
                        };
                    },
                    onSuccessCreate: this.onSuccessCreate.bind(this),
                } as ICreateComponentConfig<ITask>,
            },
        ];
    }
}
