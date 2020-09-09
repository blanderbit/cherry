import { Provider } from 'projects/communication/src/lib/services/common/provider';
import { FakeProvider } from './fake.provider';

export class FakeAttachmentsProvider  extends FakeProvider<any> implements Provider<any>  {
    protected _getItems(): any[] {
        return new Array(10).fill('').map((i, id) =>
            ({
                id
            }));
    }
}
