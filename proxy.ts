import * as express from 'express';
import * as request from 'request';
import { getCompanyId, refreshTokenIfNeed } from './api/auth';
import { proxyConfig } from './proxy.config';

function setProjectIdHeader(req, res, next) {
    req.headers['projectId'] = req.query.projectId;
    next();
}

export const proxy = express.Router(),
    ganttProxy = express.Router();

const attachmentsKey = Object.keys(proxyConfig).find(key => proxyConfig[key] === proxyConfig.a);

// projectId is required for permissions check
proxy.use(`/${attachmentsKey}`, (req, res, next) => {
    const projectId = req.query.projectId;
    const headersWithProjectId = !!req.headers.projectId;

    if (projectId && !headersWithProjectId) {
        req.headers.projectId = projectId;
    }

    next();
});

proxy.use('/companyId', refreshTokenIfNeed, (req, res, next) => {
    const companyId = getCompanyId(req);

    res.end(companyId);
});

for (const key in proxyConfig) {
    proxy.use(`/${key}`, refreshTokenIfNeed, proxyRequest(key));
}

ganttProxy.use(`/`, refreshTokenIfNeed, setProjectIdHeader, proxyRequest('restapi'));

function proxyRequest(key) {
    return (req, res) => {
        let uri = proxyConfig[key] + req.url;
        let method = req.method;

        console.log('proxyRequest', `${method} ${key} ${uri}`);
        console.time(`${method} ${key} ${uri}`);

        const {token = ''} = req.cookies || {},
            headers = token && {authorization: `Bearer ${token}`},
            r = request({
                followRedirect : !req.url.includes('auth/login'),
                followAllRedirects : false,
                method,
                uri,
                headers,
            }).on('response', () => console.timeEnd(`${method} ${key} ${uri}`))
                .on('error', err => res.status(500).send(err));

        r.pipe(res);
        req.pipe(r);
    };
}

