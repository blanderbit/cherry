import { Injectable } from '@angular/core';
import { CurrencyProvider } from '../common/currency.provider';
import { ICurrency } from '../../models/currency';
import { HttpProvider } from './http.provider';
import { CommunicationConfig } from 'communication';
import { Observable } from 'rxjs';

@Injectable()
export abstract class HttpCurrencyProvider extends HttpProvider<ICurrency> implements CurrencyProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.settings}/currencies`;
    }
}

