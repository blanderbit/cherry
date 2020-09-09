import { IPaginationParams } from '../../../projects/communication/src/lib/models/pagination';
import { ITaskCommentsParams } from '../task-comments/task-comments/task-comments.component';

export interface ITaskCommentsComponent {
    loadData: (params?) => void;
}

export type TaskCommentsParams = IPaginationParams & ITaskCommentsParams;

export const COMMENTS_PAGE_SIZE = 25;

export const FIRST_PAGE_PARAMS: IPaginationParams = {
    skip: 0,
    take: COMMENTS_PAGE_SIZE,
};

export const FIRST_PAGE_ASC_PARAMS = {
    ...FIRST_PAGE_PARAMS,
    descending: false,
} as TaskCommentsParams;

export const FIRST_PAGE_DESC_PARAMS = {
    ...FIRST_PAGE_PARAMS,
    descending: true,
} as TaskCommentsParams;
