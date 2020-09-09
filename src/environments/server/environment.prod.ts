// @ts-ignore
import { BASE_PROD_ENVIRONMENT, SERVER_ENVIRONMENT } from './base-environment';

export const environment = {
    ...BASE_PROD_ENVIRONMENT,
    ...SERVER_ENVIRONMENT,
};
