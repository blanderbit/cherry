import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

export interface IRealtimeMessage<T> {
    type: string;
    payload: T;
    internal?: boolean;
}

export enum RealtimeAction {
    Create = 'created',
    Update = 'updated',
    Delete = 'deleted',
    // TODO: Remove when BE change messages
    Added = 'added',
    Removed = 'removed'
}

export enum RealtimeSuffix {
    ResourceType = 'resourceType',
    Skill = 'skill',
    Projects = 'project',
    Tasks = 'task',
    TaskComment = 'taskComment',
    Assignment = 'assignment',
    Attachments = 'attachment',
    Resource = 'resource',
    MaterialResource = 'materialResource',
    GenericResource = 'genericResource',
    HumanResource = 'humanResource',
    Location = 'location',
    HolidayPolicy = 'holidayPolicy',
    Holiday = 'holiday',
    Holidays = 'holidays',
    Notifications = 'markAsRead',
    KanbanColumns = 'kanbanColumns'
}

@Injectable()
export abstract class RealtimeProvider {
    protected _message = new Subject();

    message = this._message;
    static getType(action, prefix) {
        return `${prefix}${action}Message`;
    }

    init(): Observable<any> {
        // this.providers = this._injector.get<RealtimeProvider[]>(RealtimeHandler as any)
        //     .filter(i => i.handleMessage);
        setInterval(() => {
            console.log('length', this._message.observers.length);
        }, 2000);

        return of(null);
    }
    abstract destroy(): Observable<any>;

    handleMessage(message: IRealtimeMessage<any>) {
        this._message.next(message);
        // this.messages.push(message);
        // console.log('message', message, this.providers);
        //
        // for (const provider of this.providers)
        //     provider.handleMessage(message);
    }

    notifyInternal(message: IRealtimeMessage<any>) {
        message.internal = true;
        this._message.next(message);
    }
}
