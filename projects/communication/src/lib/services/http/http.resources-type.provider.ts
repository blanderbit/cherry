import { HttpProvider } from './http.provider';
import { CommunicationConfig, ResourcesTypeProvider } from 'communication';
import { IResourceType } from '../../models/resource-type';
import { RealtimeSuffix } from '../common/realtime.provider';

export abstract class HttpResourcesTypeProvider extends HttpProvider<IResourceType> implements ResourcesTypeProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.resources}/types`;
    }

    protected _getType(): string {
        return RealtimeSuffix.ResourceType;
    }
}
