import { FakeProvider } from './fake.provider';
import { Observable } from 'rxjs';

import { ExcludeId, ITaskComment, SkillsProvider } from 'communication';
import { TaskCommentsProvider } from '../common/task-comments.provider';


const comments = [
    'Hello my dear friends',
    'Some random message',
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
    'Amet autem corporis deleniti dolorem, eum exercitationem id iure laborum laudantium molestias mollitia natus nesciunt non,' +
    ' quis reprehenderit repudiandae similique vel vero voluptate, voluptatum! Ad aliquid error' +
    ' eveniet fuga nulla. Accusamus accusantium asperiores commodi consectetur dignissimos exercitationem hic,' +
    ' ipsa iste laborum magni maxime nihil,' +
    ' officia porro quisquam quod, ratione rem sequi ut velit veritatis? ' +
    'Consequatur culpa deserunt, ipsum laborum magni nam qui ratione sequi soluta voluptatibus? ' +
    // tslint:disable-next-line:max-line-length
    'Blanditiis explicabo illo, incidunt labore laboriosam molestiae odit quae quas quidem quod voluptatem voluptates voluptatum! Ab aspernatur dolorem ipsa itaque maiores nisi odio vitae. Accusantium, obcaecati!',
    // tslint:disable-next-line:max-line-length
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae facilis impedit laborum, necessitatibus nostrum quas tempore. Ab accusamus amet aperiam atque autem beatae blanditiis cum cupiditate delectus distinctio dolor ducimus enim eos fuga, labore neque nihil, odit possimus quia suscipit, totam ullam veritatis. Animi consectetur consequatur distinctio dolores eius enim harum, illo ipsum iure magnam magni minus nulla, placeat possimus quibusdam, quidem reiciendis rem sapiente sed sequi.' +
    // tslint:disable-next-line:max-line-length
    ' Ad atque deleniti fugiat modi quasi quisquam voluptatibus! Eveniet laudantium magni mollitia nostrum perspiciatis quae sapiente veritatis! Alias consequuntur fugit omnis vel veritatis? Alias amet culpa cupiditate dicta eaque in inventore molestias nesciunt nihil omnis, tenetur veniam. Aspernatur assumenda cupiditate delectus deserunt distinctio, dolore doloremque ea earum illum impedit inventore iste magnam magni natus necessitatibus nemo nihil nisi obcaecati optio pariatur placeat possimus praesentium quo reprehenderit saepe sunt voluptatum! Aliquid aut ducimus ex quam recusandae repellendus similique! Accusantium consectetur corporis debitis eaque harum id in inventore iure necessitatibus nemo, nostrum omnis quia quo sed ullam unde, ' +
    // tslint:disable-next-line:max-line-length
    'ut vel voluptates. Ab accusantium architecto, aspernatur at cumque dolore exercitationem iusto labore mollitia placeat quam, qui quos reprehenderit similique, temporibus velit voluptate? A animi asperiores consequatur deserunt expedita fugiat inventore neque placeat, possimus quasi qui vero.',
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A amet aperiam iusto maiores natus nulla quasi qui' +
    // tslint:disable-next-line:max-line-length
    ' saepe, soluta totam? Accusamus atque cum deleniti dignissimos ea, eius, eum fugit impedit optio praesentium reprehenderit soluta voluptatum. Amet consequuntur eius esse ipsa minus odio quae repudiandae. A aut commodi corporis cupiditate fugiat illo incidunt ipsa ipsam itaque minus, neque obcaecati odio quaerat quam qui quos sed sequi similique vel voluptatibus. Dolor est et ' +
    // tslint:disable-next-line:max-line-length
    'fugiat fugit illum minima nemo nobis qui quia, repudiandae sed, sit veniam? Ab, adipisci asperiores commodi consectetur consequatur deserunt dolore doloribus enim eveniet modi nam nulla odio officiis, perspiciatis quae reiciendis repellendus reprehenderit repudiandae saepe sed similique ullam, ut velit veritatis vero? Aut beatae consequuntur dicta dolorem doloremque ducimus illum neque nesciunt quidem velit? Alias consectetur cum cumque dicta eum eveniet exercitationem facere inventore laudantium magnam maxime nesciunt nihil numquam possimus quidem quo quos reiciendis repellat sit tempore, temporibus unde ut veritatis voluptatibus voluptatum! Ab accusantium assumenda atque dicta dolore doloribus dolorum eos est expedita explicabo fugiat impedit libero minima modi molestias non odit pariatur quod ratione repudiandae rerum sed suscipit, tempore tenetur ut. Cumque, debitis explicabo facere illum ipsa numquam officia qui similique tenetur? Accusantium commodi debitis, dolor doloremque ea earum hic iusto libero modi nemo quasi quidem quo tempora tenetur ullam ' +
    // tslint:disable-next-line:max-line-length
    'vel voluptatem. At ducimus expedita facere laboriosam minus tenetur. Accusantium commodi debitis deleniti dolores eius enim esse, iste laudantium magni nulla placeat, quia quidem soluta sunt temporibus, unde velit vitae? Ad alias aperiam assumenda aut beatae commodi cumque deleniti distinctio ea earum eligendi ex facere id illum in labore laudantium maiores maxime molestiae, nihil nobis nostrum odit officia perferendis possimus praesentium quod ratione repellendus soluta voluptate! Ab, amet deserunt ducimus eligendi error et facilis illo ipsam ipsum laborum officiis omnis pariatur porro provident quaerat recusandae unde.',
];

export abstract class FakeTasksCommentsProvider extends FakeProvider<ITaskComment> implements TaskCommentsProvider {

    // getItems(params): Observable<ITaskComment[]> {
    // const {search = null} = params || {};
    //
    // return super.getItems()
    //     .pipe(map(items => search ? items.filter(({name}) => name.includes(search)) : items));
    // }

    createItem(item: ExcludeId<ITaskComment>): Observable<ITaskComment> {
        return super.createItem(item);
    }

    protected _getItems(params = {}): ITaskComment[] {
        return Array.from(new Array(20), (_, id) => ({
            id,
            createdAt: Date['toServerDate'](new Date()),
            lastModified: Date['toServerDate'](new Date()),
            resourceId: 1,
            taskId: 11,
            // @ts-ignore
            text: comments[Math.getRandomInteger(1, comments.length - 1)],
        }));
    }
}
