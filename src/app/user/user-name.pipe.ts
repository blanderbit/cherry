import { Pipe, PipeTransform } from '@angular/core';
import { IHumanResource } from 'communication';
import { TitleCasePipe } from '@angular/common';
import { last } from 'rxjs/operators';

type UserNamePipePriority = 'fullName' | 'name';

@Pipe({
    name: 'userName',
})
export class UserNamePipe implements PipeTransform {
    static getName(user: IHumanResource, priority: UserNamePipePriority = 'fullName') {
        const {firstName, lastName, name} = (user || <IHumanResource>{});

        if (user) {
            if (firstName || lastName || priority !== 'fullName') {
                return `${user.firstName} ${user.lastName}`;
            } else if (name) {
                return name;
            }
        }

        return '';
    }

    constructor(private titlePipe: TitleCasePipe) {
    }

    transform(user: IHumanResource, priority: UserNamePipePriority = 'fullName'): any {
        if (user) {
            return this.titlePipe.transform(UserNamePipe.getName(user));
        }

        return '';
    }
}
