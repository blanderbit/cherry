import { Config } from 'config';

export interface HttpConfig {
    realtime: string;
    assignments: string;
    users: string;
    resources: string;
    tasks: string;
    projects: string;
    time: string;
    settings: string;
    translate: string;
    attachments: string;
    permissions: string;
    notifications: string;
    companies: string;
    identity: string;
    kanban: string;
}

export interface WsConfig {
    url: string;
    protocol?: string;
}

export class CommunicationConfig extends Config {
    http: HttpConfig;
    ws: WsConfig;
}
