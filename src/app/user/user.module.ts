import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { UserAvatarPipe } from './user-avatar.pipe';
import { AvatarsStackComponent } from './avatars-stack/avatars-stack.component';
import { UserNamePipe } from './user-name.pipe';
import { AvatarComponent } from './avatar/avatar.component';
import { UserSummaryComponent } from './user-summary/user-summary.component';
import { UiModule } from '../ui/ui.module';
import { CheckboxModule } from '../ui/checkbox/checkbox.module';

const COMPONENTS = [
    AvatarsStackComponent,
    UserSummaryComponent,
    AvatarComponent,
];

@NgModule({
    declarations: [
        UserAvatarPipe,
        UserNamePipe,
        ...COMPONENTS,
    ],
    exports: [
        UserAvatarPipe,
        UserNamePipe,
        ...COMPONENTS
    ],
  imports: [
    CommonModule,
    UiModule,
    CheckboxModule,
  ],
    providers: [TitleCasePipe]
})
export class UserModule {
}
