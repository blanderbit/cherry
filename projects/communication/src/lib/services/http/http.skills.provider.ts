import { ISkill } from '../../models/skill';
import { CommunicationConfig, SkillsProvider } from 'communication';
import { HttpProvider } from './http.provider';
import { RealtimeSuffix } from '../common/realtime.provider';

export abstract class HttpSkillsProvider extends HttpProvider<ISkill> implements SkillsProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.resources}/skills`;
    }

    protected _getType(): string {
        return RealtimeSuffix.Skill;
    }
}
