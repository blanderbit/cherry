import { CommunicationConfig, IMaterialResource } from 'communication';
import { HttpResourcesProvider } from './http-resources.provider';
import { RealtimeSuffix } from '../common/realtime.provider';

export class HttpMaterialResourcesProvider extends HttpResourcesProvider<IMaterialResource> {
    protected _getURL(config: CommunicationConfig): string {
        return `${super._getURL(config)}/material`;
    }

    protected _getType(): string {
        return RealtimeSuffix.MaterialResource;
    }
}
