import { FakeProvider } from './fake.provider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISkill } from '../../models/skill';
import { SkillsProvider } from 'communication';

export abstract class FakeSkillsProvider extends FakeProvider<ISkill> implements SkillsProvider {

    getItems(params): Observable<ISkill[]> {
        const {search = null} = params || {};

        return super.getItems()
            .pipe(map(items => search ? items.filter(({name}) => name.includes(search)) : items));
    }

    protected _getItems(params = {}): ISkill[] {
        return Array.from(new Array(100), (_, id) => ({name: `Skill ${id}`, id}));
    }
}
