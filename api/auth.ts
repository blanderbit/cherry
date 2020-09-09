import * as express from 'express';
import * as request from 'request';
import { proxyConfig } from '../proxy.config';
import { excludeFromAuthRoutes } from '../proxy-exlude-auth.routes';

export const auth = express.Router();

auth.post('/login', login);
auth.post('/logout', setCORSHeaders, logout);
auth.post('/refreshToken', removeToken, refreshTokenIfNeed, (req, res) => res.send(200));
// auth.get('/profile', refreshTokenIfNeed, getProfile);
auth.use('*', setCORSHeaders);

function setCORSHeaders(req, res, next) {
    res.set('access-control-allow-origin', req.headers.origin);
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Headers', 'Content-Type, projectId, companyId');
    next();
}

export async function checkAuth(req, res, next) {
    const {token = ''} = req.cookies || {};

    if (await isTokenValid(token) || excludeFromAuthRoutes.includes(req.url))
        return next();

    redirectToLogin(req, res);
}

function parse(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Parse error', data, e);
    }
}

function parseToken(token) {
    if (!token)
        return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buff = new Buffer(base64, 'base64');
    const payloadinit = buff.toString('ascii');

    return parse(payloadinit);
}

async function isTokenValid(token) {
    if (!token)
        return Promise.resolve(false);
    else
        return Promise.resolve(true);

    return new Promise((resolve) => {
        // const encodedApiData = Buffer.from('identity:identity-api.secret').toString('base64');
        const encodedApiData = Buffer.from('identity:identity-api.secret').toString('base64');

        console.log(token);
        request.post(
            {
                headers: {
                    'Authorization': 'Basic ' + encodedApiData,
                    'content-type': 'application/x-www-form-urlencoded'
                },
                url: `${proxyConfig.identity}/connect/introspect`,
                body: Buffer.from('token=' + token)
            },
            (error, response, body) => {
                if (error) {
                    console.error('Introspect error', error);
                    resolve(false);
                }
                try {
                    console.log('Response returned : ' + response.statusCode + ' status code');

                    if (response.statusCode != 200) {
                        console.error(`Invalid request. Status: ${response.statusCode}`);
                        resolve(false);
                    }
                    const data = JSON.parse(body);

                    resolve(data && data.active);
                } catch (e) {
                    resolve(e);
                }
            });
    });
}

function getTokenData({refresh_token = undefined, userName = '', password = ''}) {
    if (!refresh_token && !(userName && password))
        throw new Error('Invalid data for retrieve token');

    return {
        client_id: 'webclient',
        client_secret: 'webclientSecret',
        ...(refresh_token ?
            {
                refresh_token,
                scope: 'offline_access',
                grant_type: 'refresh_token',
            } :
            {
                userName,
                password,
                grant_type: 'password'
            }),
    };


}

const refreshTokenStore = {};

export function refreshTokenIfNeed(req, res, next, sendError = true) {
    const {cookies} = req,
        refresh_token = cookies['refresh'] || '',
        token = cookies['token'],
        companyId = getCompanyId(req);

    const urlWithoutQueryParams = req.url.split('?')[0];

    if (token || req.method === 'OPTIONS' || req.headers.authorization || excludeFromAuthRoutes.includes(urlWithoutQueryParams)) {
        next();
        return;
    }

    if (sendError && !refresh_token) {
        res.status(401);
        res.send({message: `Invalid refresh token - ${refresh_token}`});
        return;
    }

    try {
        const onData = (data) => {
            refreshTokenStore[refresh_token] = data;
            if (data) {
                data.password = '***';
            }

            console.log('data', data);
            handleConnectTokenResponse(data, req, res, sendError);
            next();
        };

        if (!refreshTokenStore[refresh_token]) {
            const deleteTokenWithDelay = () => setTimeout(() => {
                delete refreshTokenStore[refresh_token];
            }, 2000); // this timeout because some browser postpone some request
            // (this is can't debug only console logs in several places)

            refreshTokenStore[refresh_token] = connectTokenRequest(getTokenData({refresh_token}), {
                companyId
            }).on('response', deleteTokenWithDelay)
                .on('error', deleteTokenWithDelay);

        } else if (refreshTokenStore[refresh_token] instanceof Buffer) {
            onData(refreshTokenStore[refresh_token]);
            return;
        }

        console.log('data ' + req.originalUrl + (refreshTokenStore[refresh_token] != null));
        refreshTokenStore[refresh_token]
            .on('data', onData)
            .on('error', error => {
                console.error('refreshTokenIfNeed', error);
                handleConnectTokenResponse(null, req, res, sendError);
            });
    } catch (e) {
        console.error('refreshTokenIfNeed', e);

        if (sendError)
            throw e;

        next();
    }
}

export function removeToken(req, res, next) {
    const {cookies} = req;

    /**
     * Use for force refreshing token
     * todo think about this
     * */
    cookies['token'] = null;

    next();
}

function logout(req, res) {
    const params = ['', {expires: 0, maxAge: new Date(0), httpOnly: true}];

    res.cookie('token', ...params);
    res.cookie('refresh', ...params);
    res.cookie('companyId', ...params);

    res.send();
}

function login(req, res) {
    const {userName = '', password = ''} = req.body || {};
    let r;

    try {
        r = connectTokenRequest(getTokenData({userName, password}))
            .on('data', data => {
                console.log('data ' + req.originalUrl + data + JSON.stringify(getTokenData({userName, password})));
                handleConnectTokenResponse(data, req, res);
            })
            .on('error', error => res.status(500).send(error));
    } catch (e) {
        res.status(500).send(e);
        return;
    }

    r.pipe(res);
}

function connectTokenRequest(formData, headers = {}) {
    return request({
        method: 'POST',
        uri: proxyConfig.identity + '/connect/token',
        form: formData,
        headers
    });
}

function handleConnectTokenResponse(data, req, res, sendError = true) {
    const body = parse(data);

    if (body && body.access_token) {

        const {company: companyId = ''} = parseToken(body.access_token) || {};

        req.cookies['token'] = body.access_token;
        res.cookie('token', body.access_token, {maxAge: body.expires_in * 1000, httpOnly: true});
        // res.cookie('token', body.access_token, {maxAge: 5 * 1000, httpOnly: true});
        res.cookie('refresh', body.refresh_token, {maxAge: 60 * 1000 * 60 * 24 * 5, httpOnly: true});
        res.cookie('companyId', companyId || '', {maxAge: 60 * 1000 * 60 * 24 * 5, httpOnly: true});
    } 
    // else {
    //     console.error('handleConnectTokenResponse error', body);
    //     try {
    //         if (body && body.error === 'invalid_grant' && sendError) {
    //             res.status(401);
    //             res.send({
    //                 message: 'Possible refresh token was refreshed before',
    //                 ...body
    //             });
    //         }
    //     } catch (e) {
    //         console.error('Handle connect token error');
    //     }
    // }
}

function getProfile(req, res) {
    const token = (req.cookies && req.cookies.token) || getTokenFromHeader(req.headers),
        {sub: id = null} = parseToken(token) || {};

    if (id) {
        console.log('getProfile', `${req.protocol}://${req.headers.host}/api/u/users/${id}`);
        const r = request(`${req.protocol}://${req.headers.host}/api/u/users/${id}`) // see proxy.config
            .on('error', error => res.status(500).send(error));

        r.pipe(res);
        req.pipe(r);
    } else {
        res.sendStatus(401);
    }
}

function getBaseUrl(req) {
    return `${req.protocol}://${req.headers.host}`;
}

function redirectToLogin(req, res) {
    return res.redirect(`/auth/login?redirect=${encodeURIComponent(getBaseUrl(req) + req.originalUrl)}`);
}

function getTokenFromHeader({authorization}) {
    return authorization && authorization.replace('Bearer').trim();
}

export function getCompanyId(req) {
    return req.headers['companyid'] || req.cookies['companyId'] || '';
}
