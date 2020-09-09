import { Injectable } from '@angular/core';
import { PermissionsProvider } from '../common/permissions.provider';
import { HttpPermissionsProvider } from './http.permissions.provider';
import { CommunicationConfig } from '../../communication.config';

@Injectable()
export class HttpSystemPermissionsProvider extends HttpPermissionsProvider implements PermissionsProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${super._getURL(config)}/systems`;
    }
}
