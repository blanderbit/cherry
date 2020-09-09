import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLoaderComponent } from './auth-loader.component';

@NgModule({
    declarations: [
        AuthLoaderComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AuthLoaderComponent,
    ]
})
export class AuthLoaderModule {
}
