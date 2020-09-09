import { ReplaySubject } from 'rxjs';

export abstract class ModulesContainer {
    moduleChange = new ReplaySubject<string>(1);
}
