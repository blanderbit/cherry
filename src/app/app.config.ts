import { Config } from 'config';
import { SentryConfig } from 'sentry';
import { CommunicationConfig, HttpConfig, WsConfig } from 'communication';

export interface AppHttpConfig extends HttpConfig {
    auth: string;
}

export interface AuthenticationConfig {
    redirect: string;
    login: string;
}

export class AppConfig extends Config implements CommunicationConfig {
    version: number;
    http: AppHttpConfig;
    ws: WsConfig;
    authentication: AuthenticationConfig;
    sentry?: SentryConfig;
}
