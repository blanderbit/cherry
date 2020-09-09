import { Pipe, PipeTransform } from '@angular/core';
import { IIdObject, ResourcesProvider } from 'communication';

export const DEFAULT_AVATAR = 'assets/img/profile.png';

@Pipe({
    name: 'userAvatar',
    pure: false,
})
export class UserAvatarPipe implements PipeTransform {

    constructor(private _userProvider: ResourcesProvider) {
    }

    transform(value: IIdObject | string | number, defaultAvatar = DEFAULT_AVATAR): string {
        if (!value || (typeof value === 'object' && !value.id)) {
            return defaultAvatar;
        }

        const id = typeof value === 'object' ? value.id : value;
        return this._userProvider.getPhotoUrl(id);
    }

}
