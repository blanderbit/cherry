import { Component } from '@angular/core';
import { ProfileService } from '../../../identify/profile.service';
import { Router } from '@angular/router';
import { AppConfig } from '../../../app.config';

@Component({
    selector: 'app-profile-settings-side-bar',
    templateUrl: './settings-side-bar.component.html',
    styleUrls: ['./settings-side-bar.component.scss'],
})
export class SettingsSideBarComponent {

    sideBarMenu = [
        {
            name: 'side-bar-menu.profileSettings',
            path: ''
        },
        {
            name: 'side-bar-menu.notifications',
            path: '/notifications'
        },
        // {
        //     name: 'side-bar-menu.apps',
        //     path: '/apps'
        // }
    ];

    constructor(private _profileProvider: ProfileService,
                private _appConfig: AppConfig,
                private _router: Router) {
    }
}
