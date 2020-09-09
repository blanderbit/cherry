if (!process.env.IDENTITY)
    require('dotenv').config();

const env = process.env;
const identity = env.IDENTITY;

const config = {
    restapi: env.GANTT,
    identity: identity,
    i: `${identity}/api`,
    u: `${identity}/api`,
    c: env.COMPANIES,
    a: env.ATTACHMENTS || 'http://attachments-lb/api',
    s: env.SETTINGS,
    p: env.PROJECTS,
    r: env.RESOURCES,
    n: env.NOTIFICATIONS || 'http://notifications-lb/api',
    t: env.TASKS,
    pr: env.PERMISSIONS || 'http://permissions-lb/api',
    k: env.KANBAN || 'http://kanban-lb/api',
    rt: env.REALTIME,
};

console.log('process.env.NODE_ENV', process.env.NODE_ENV, process.env.IDENTITY);

export const proxyConfig = config;

