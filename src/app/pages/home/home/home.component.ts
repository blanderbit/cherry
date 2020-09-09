import { Component } from '@angular/core';
import { ProfileService } from '../../../identify/profile.service';
import { APPLICATIONS } from '../../../ui/app-item/app-item.component';
import { ItemsComponent } from 'components';
import { IAppPermission } from '../../../../../projects/communication/src/lib/services/http/http.app-permissions.provider';
import { AppPermissionsAction, AppPermissionsProvider, PermissionAction } from 'communication';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-home-component',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends ItemsComponent<IAppPermission> {
    apps = APPLICATIONS;
    permissionActions = PermissionAction;
    loadDataOnParamsChange = false;

    get profile() {
        return this._profileProvider.profile;
    }

    constructor(
        public _profileProvider: ProfileService,
        public route: ActivatedRoute,
        public _provider: AppPermissionsProvider,
    ) {
        super();
    }

    public isAppDisabled(app: IAppPermission, allowedApps: AppPermissionsAction[]) {
        return !AppPermissionsProvider.isAppEnabled(app, allowedApps);
    }
}
