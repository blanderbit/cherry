import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { ProjectsPermissionsManager } from './services/projects-permissions-manager.service';
import { PermissionsInterceptorService } from './services/permissions-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoPermissionDirective, PermissionDirective, PermissionNoForbiddenDirective, PermissionsDirective } from './permissions.directive';
import { SystemPermissionsManager } from './services/system-permissions-manager.service';
import { EditPermissionDirective } from './edit-permission.directive';
import { PermissionsService } from './services/permissions.service';
import { NavigationPermissionsDirective } from './navigation-permissions.directive';

const DIRECTIVES = [
    PermissionsDirective,
    PermissionDirective,
    NoPermissionDirective,
    PermissionNoForbiddenDirective
];

@NgModule({
    declarations: [
        ...DIRECTIVES,
        EditPermissionDirective,
        NavigationPermissionsDirective
    ],
    imports: [],
    exports: [
        ...DIRECTIVES,
        EditPermissionDirective,
        NavigationPermissionsDirective
    ],
    providers: []
})
export class PermissionsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PermissionsModule,
            providers: [
                ProjectsPermissionsManager,
                SystemPermissionsManager,
                PermissionsService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: PermissionsInterceptorService,
                    multi: true,
                },
            ]
        };
    }

    static getPermissionsInterceptor(): Provider {
        return [
            {
                provide: HTTP_INTERCEPTORS,
                useClass: PermissionsInterceptorService,
                multi: true,
            }
        ];
    }

    static providers() {
        return [
            ProjectsPermissionsManager,
        ];
    }
}
