import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import {
    AppPermissionsProvider,
    AssignmentsProvider,
    HolidaysPolicyProvider,
    NotificationSettingsProvider,
    ProjectsProvider,
    ResourcesProvider,
    TasksProvider,
} from './services/common';
import { CommunicationConfig } from './communication.config';
import { FakeResourcesProvider } from './services/fake/fake-resources.provider';
import { FakeTasksProvider } from './services/fake/fake-tasks.provider';
import { HttpTasksProvider } from './services/http/http-tasks.provider';
import { HttpProjectsProvider } from './services/http/http-projects.provider';
import { FakeProjectsProvider } from './services/fake/fake-projects.provider';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { HttpAssignmentsProvider } from './services/http/http-assignments.provider';
import { TimeProvider } from './services/common/time.provider';
import { HttpTimeProvider } from './services/http/http-time.provider';
import { MaterialResourcesProvider } from './services/common/material-resources.provider';
import { HumanResourcesProvider } from './services/common/human-resources.provider';
import { GenericResourcesProvider } from './services/common/generic-resources.provider';
import { FakeGenericResourcesProvider } from './services/fake/fake-generic-resources.provider';
import { FakeHumanResourcesProvider } from './services/fake/fake-human-resources.provider';
import { FakeMaterialResourcesProvider } from './services/fake/fake-material-resources.provider';
import { FakeHolidaysPolicyProvider } from './services/fake/fake-holidays-policy.provider';
import { HttpHolidaysPolicyProvider } from './services/http/http-holidays-policy.provider';
import { LocationsProvider } from './services/common/locations.provider';
import { HttpLocationsProvider } from './services/http/http.locations.provider';
import { FakeLocationsProvider } from './services/fake/fake.locations.provider';
import { ResourcesTypeProvider } from './services/common/resources-type.provider';
import { HttpResourcesProvider } from './services/http/http-resources.provider';
import { HttpMaterialResourcesProvider } from './services/http/http-material-resources.provider';
import { HttpHumanResourcesProvider } from './services/http/http-human-resources.provider';
import { HttpGenericResourcesProvider } from './services/http/http-generic-resources.provider';
import { SkillsProvider } from './services/common/skills.provider';
import { FakeSkillsProvider } from './services/fake/fake.skills.provider';
import { HolidaysProvider } from './services/common/holidays.provider';
import { HttpHolidaysProvider } from './services/http/http-holidays.provider';
import { FakeHolidaysProvider } from './services/fake/fake-holidays.provider';
import { CurrencyProvider } from './services/common/currency.provider';
import { FakeCurrencyProvider } from './services/fake/fake.currency.provider';
import { HttpCurrencyProvider } from './services/http/http.currency.provider';
import { CountriesProvider } from './services/common/countries.provider';
import { FakeCountriesProvider } from './services/fake/fake.countries.provider';
import { HttpCountriesProvider } from './services/http/http.countries.provider';
import { HttpSkillsProvider } from './services/http/http.skills.provider';
import { HttpResourcesTypeProvider } from './services/http/http.resources-type.provider';
import { RealtimeProvider } from 'projects/communication/src/lib/services/common/realtime.provider';
import { WsRealtimeProvider } from 'projects/communication/src/lib/services/ws/ws-realtime.provider';
import { FakeResourcesTypeProvider } from 'projects/communication/src/lib/services/fake/fake-resources-type.provider';
import { TranslateProvider } from 'projects/communication/src/lib/services/common/translate.provider';
import { HttpTranslateProvider } from 'projects/communication/src/lib/services/http/http-translate.provider';
import { TaskCommentsProvider } from './services/common/task-comments.provider';
import { FakeTasksCommentsProvider } from './services/fake/fake.task-comments.provider';
import { HttpTaskCommentsProvider } from './services/http/http-task-comments.provider';
import { PermissionsProvider } from './services/common/permissions.provider';
import { FakePermissionsProvider } from './services/fake/fake.permissions.provider';
import { SystemPermissionsProvider } from './services/common/system-permissions.provider';
import { ProjectsPermissionsProvider } from './services/common/projects-permissions.provider';
import { FakeSystemPermissionsProvider } from './services/fake/fake.system-permissions.provider';
import { FakeProjectsPermissionsProvider } from './services/fake/fake.projects-permissions.provider';
import { HttpSystemRolesProvider } from './services/http/http-system-roles.provider';
import { HttpProjectRolesProvider } from './services/http/http-project-roles.provider';
import { ProjectRolesProvider } from './services/common/project-roles.provider';
import { SystemRolesProvider } from './services/common/system-roles.provider';
import { HttpPermissionsProvider } from './services/http/http.permissions.provider';
import { HttpSystemPermissionsProvider } from './services/http/http.system-permissions.provider';
import { AttachmentsProvider } from './services/common/attachments.provider';
import { HttpAttachmentsProvider } from './services/http/http.attachments.provider';
import { FakeAttachmentsProvider } from './services/fake/fake.attachments.provider';
import { SearchProjectProvider } from './services/http/http.project-search.provider';
import { HttpProjectsPermissionsProvider } from './services/http/http.project-permissions.provider';
import { FakeAppPermissionsProvider } from './services/fake/fake.app-permissions.provider';
import { HttpAppPermissionsProvider } from './services/http/http.app-permissions.provider';
import { HttpSubscriptionsProvider } from './services/http/http-subscription.provider';
import { SubscriptionProvider } from './services/common/subscription.provider';
import { FakeNotificationSettingsProvider } from './services/fake/fake-notification-settings.provider';
import { HttpNotificationSettingsProvider } from './services/http/http-notification-settings.provider';
import { NotificationProvider } from './services/common/notification.provider';
import { HttpNotificationProvider } from './services/http/http.notification.provider';
import { AuthProvider } from './services/common/auth.provider';
import { HttpAuthProvider } from './services/http/http.auth.provider';
import { CompaniesProvider } from './services/common/companies.provider';
import { HttpCompaniesProvider } from './services/http/http.companies.provider';
import { KanbanProvider } from './services/common/kanban.provider';
import { HttpKanbanProvider } from './services/http/http-kanban.provider';
import { KanbanColumnsProvider } from './services/common/kanban-columns.provider';
import { FakeKanbanProvider } from './services/fake/fake-kanban.provider';
import { HttpKanbanColumnsProvider } from './services/http/http.kanban-columns.provider';

@NgModule({})
export class CommunicationModule {
    static forRoot(communicationConfigToken: Provider): ModuleWithProviders {
        return {
            ngModule: CommunicationModule,
            providers: [
                {
                    provide: HttpClient,
                    useClass: HttpService,
                },
                {
                    provide: CommunicationConfig,
                    useExisting: communicationConfigToken,
                },
                {
                    provide: RealtimeProvider,
                    useClass: WsRealtimeProvider,
                },

                registerService(TasksProvider, FakeTasksProvider, HttpTasksProvider),
                registerService(SearchProjectProvider, null, SearchProjectProvider),

                registerService(ProjectsProvider, FakeProjectsProvider, HttpProjectsProvider),
                registerService(AssignmentsProvider, null, HttpAssignmentsProvider),
                registerService(TimeProvider, null, HttpTimeProvider),
                registerService(ResourcesProvider, FakeResourcesProvider, HttpResourcesProvider),
                registerService(MaterialResourcesProvider, FakeMaterialResourcesProvider, HttpMaterialResourcesProvider),
                registerService(HumanResourcesProvider, FakeHumanResourcesProvider, HttpHumanResourcesProvider),
                registerService(GenericResourcesProvider, FakeGenericResourcesProvider, HttpGenericResourcesProvider),
                registerService(HolidaysPolicyProvider, FakeHolidaysPolicyProvider, HttpHolidaysPolicyProvider),
                registerService(HolidaysProvider, FakeHolidaysProvider, HttpHolidaysProvider),
                registerService(LocationsProvider, FakeLocationsProvider, HttpLocationsProvider),
                registerService(ResourcesTypeProvider, FakeResourcesTypeProvider, HttpResourcesTypeProvider),
                registerService(SkillsProvider, FakeSkillsProvider, HttpSkillsProvider),
                registerService(CurrencyProvider, FakeCurrencyProvider, HttpCurrencyProvider),
                registerService(CountriesProvider, FakeCountriesProvider, HttpCountriesProvider),
                registerService(TranslateProvider, HttpTranslateProvider, HttpTranslateProvider),
                registerService(TaskCommentsProvider, FakeTasksCommentsProvider, HttpTaskCommentsProvider),
                registerService(PermissionsProvider, FakePermissionsProvider, HttpPermissionsProvider),
                registerService(SystemPermissionsProvider, FakeSystemPermissionsProvider, HttpSystemPermissionsProvider),
                registerService(ProjectsPermissionsProvider, FakeProjectsPermissionsProvider, HttpProjectsPermissionsProvider),
                registerService(SystemRolesProvider, null, HttpSystemRolesProvider),
                registerService(ProjectRolesProvider, null, HttpProjectRolesProvider),
                registerService(AttachmentsProvider, FakeAttachmentsProvider, HttpAttachmentsProvider),
                registerService(AppPermissionsProvider, FakeAppPermissionsProvider, HttpAppPermissionsProvider),
                registerService(SubscriptionProvider, null, HttpSubscriptionsProvider),
                registerService(NotificationProvider, null, HttpNotificationProvider),
                registerService(NotificationSettingsProvider, FakeNotificationSettingsProvider, HttpNotificationSettingsProvider),
                registerService(AuthProvider, HttpAuthProvider, HttpAuthProvider),
                registerService(CompaniesProvider, HttpCompaniesProvider, HttpCompaniesProvider),
                registerService(KanbanProvider, FakeKanbanProvider, HttpKanbanProvider),
                registerService(KanbanColumnsProvider, HttpKanbanColumnsProvider, HttpKanbanColumnsProvider),
            ],
        };
    }

    static forProjectsPermissions() {
        return [
            registerService(TasksProvider, FakeTasksProvider, HttpTasksProvider),
            registerService(ProjectsProvider, FakeProjectsProvider, HttpProjectsProvider),
            registerService(AssignmentsProvider, null, HttpAssignmentsProvider),
            registerService(TimeProvider, null, HttpTimeProvider),
            registerService(TaskCommentsProvider, FakeTasksCommentsProvider, HttpTaskCommentsProvider),
            registerService(ResourcesProvider, FakeResourcesProvider, HttpResourcesProvider),
            registerService(MaterialResourcesProvider, FakeMaterialResourcesProvider, HttpMaterialResourcesProvider),
            registerService(HumanResourcesProvider, FakeHumanResourcesProvider, HttpHumanResourcesProvider),
            registerService(GenericResourcesProvider, FakeGenericResourcesProvider, HttpGenericResourcesProvider),
        ];
    }
}

export function registerService(provide, mockedService, realService): any[] {
    return [
        {
            provide,
            useClass: realService, // todo
        },
    ];
}
