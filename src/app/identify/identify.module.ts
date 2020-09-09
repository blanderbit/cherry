import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from './auth.guard';
import { ClassAccessDirective } from './directives/class-access.directive';
import { PermissionsGuard } from './permissions.guard';

@NgModule({
    declarations: [
        ClassAccessDirective,
    ],
    exports: [
        ClassAccessDirective
    ],
    imports: [
        CommonModule
    ],
    providers: []
})
export class IdentifyModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: IdentifyModule,
            providers: [
                ProfileService,
                AuthGuard,
                PermissionsGuard
            ]
        };
    }
}
