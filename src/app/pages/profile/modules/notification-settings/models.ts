// tslint:disable:no-bitwise

import { IIdObject } from 'communication';

export const enum NotificationSettingType {
    NotSet = 0,
    Web = 1 << 0,
    Email = 1 << 1,
    All = Web | Email
}

export interface INotificationSetting extends IIdObject {
    value: NotificationSettingType;
}

export const NotificationSettingIdsMap: {[key: string]: number[]} = {
    newTask: [1, 2],
    assigmentCompleted: [3],
    taskCompleted: [4, 5, 6, 7],
    taskCancelled: [8, 9],
    assigmentDeleted: [10, 11],
    taskDeleted: [12, 13],
    newComment: [14, 15],
    attachmentAdded: [16, 17],
    projectInvitation: [18],
    yourAssigmentCompleted: [19]
};

export type NotificationSettingKeyType = keyof typeof NotificationSettingIdsMap;

