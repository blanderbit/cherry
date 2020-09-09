export class Config {
    apply(config: any) {
        Object.assign(this, config);
    }
}

export interface Sentry {
    dsn: string;
    enable: boolean;
}

export class SentryConfig extends Config {
    sentry: Sentry;
}
