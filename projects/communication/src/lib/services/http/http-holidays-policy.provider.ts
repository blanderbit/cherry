import { CommunicationConfig, HolidaysPolicyProvider, IHolidaysPolicy } from 'communication';
import { HttpProvider } from './http.provider';
import { RealtimeSuffix } from '../common/realtime.provider';

export abstract class HttpHolidaysPolicyProvider extends HttpProvider<IHolidaysPolicy> implements HolidaysPolicyProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.settings}/holiday-policies`;
    }

    protected _getType(): string {
        return RealtimeSuffix.HolidayPolicy;
    }
}
