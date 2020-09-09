import { CommunicationConfig, IGenericResource } from 'communication';
import { HttpResourcesProvider } from './http-resources.provider';
import { RealtimeSuffix } from '../common/realtime.provider';

export class HttpGenericResourcesProvider extends HttpResourcesProvider<IGenericResource> {
    protected _getURL(config: CommunicationConfig): string {
        return `${super._getURL(config)}/generic`;
    }

    protected _getType(): string {
        return RealtimeSuffix.GenericResource;
    }
}
