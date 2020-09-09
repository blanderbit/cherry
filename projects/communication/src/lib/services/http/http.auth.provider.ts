import { HttpProvider } from './http.provider';
import { CommunicationConfig } from '../../communication.config';
import { AuthProvider } from '../common/auth.provider';

export abstract class HttpAuthProvider extends HttpProvider<any> implements AuthProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.attachments}`;
    }
}
