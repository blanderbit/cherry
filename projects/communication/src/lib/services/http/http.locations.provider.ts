import { LocationsProvider } from '../common/locations.provider';
import { ILocation } from '../../models/location';
import { HttpProvider } from './http.provider';
import { CommunicationConfig } from 'communication';
import { RealtimeSuffix } from '../common/realtime.provider';

export abstract class HttpLocationsProvider extends HttpProvider<ILocation> implements LocationsProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.settings}/locations`;
    }

    protected _getType(): string {
        return RealtimeSuffix.Location;
    }
}
