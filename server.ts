import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import './src/custom-polyfills';
import { enableProdMode } from '@angular/core';
import * as express from 'express';
import * as compression from 'compression';
import * as cookieparser from 'cookie-parser';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
// import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader'; // lazy loader
import * as domino from 'domino'; // ssr DOM
import * as fs from 'fs';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as sourceMap from 'source-map-support'; // for debug
import { ROUTES } from './static.paths';
import { auth, checkAuth, refreshTokenIfNeed } from './api/auth';
import { translate } from './api/translate';
import { ganttProxy, proxy } from './proxy';
import * as config from './gantt/info.json';
import { proxyConfig } from './proxy.config';
import { excludeFromAuthRoutes } from './proxy-exlude-auth.routes';
import { NgxRequest, NgxResponce } from '@gorniv/ngx-universal';

sourceMap.install(); // for test
enableProdMode();

const template = fs.readFileSync(path.join(__dirname, '.', 'dist', 'index.html')).toString(), // index from browser build!
  win = domino.createWindow(template), // for mock global window by domino
  files = fs.readdirSync(`${process.cwd()}/dist-server`), // from server build
  mainFiles = files.filter((file) => file.startsWith('main')), // get server main
  hash = mainFiles[0].split('.')[1], // with hash
  { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./dist-server/main.${hash}`), // main from server impl.
  PORT = process.env.PORT || 4000; // port

// not implemented property and functions
Object.defineProperty(win.document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
});
global['window'] = win; // mock
global['document'] = win.document; // mock documnet
global['CSS'] = null; // othres mock
global['Prism'] = null; // global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;

// dynamic renderanyCORS
export function render(req, res) {
  // if (!global['navigator'])
  //     global['navigator'] = {};
  //
  // global['navigator'].userAgent = req['headers']['user-agent'];     // mock navigator from req.

  const http =
      req.headers['x-forwarded-proto'] === undefined ? 'http' : req.headers['x-forwarded-proto'],
    url = req.originalUrl;

  console.time(`GET(render): ${url}`); // tslint:disable-line
  res.render(
    '../dist/index',
    {
      req: req,
      res: res,
      // provers from server
      providers: [
        // for http and cookies
        {
          provide: REQUEST,
          useValue: req,
        },
        {
          provide: RESPONSE,
          useValue: res,
        },
        {
          provide: NgxRequest,
          useValue: req,
        },
        {
          provide: NgxResponce,
          useValue: res,
        },
        {
          provide: 'PROXY_CONFIG',
          useValue: {
            ...proxyConfig,
            auth: `${req.protocol}://${req.headers.host}/api/auth`, // for internal requests during ssr
            translate: `${req.protocol}://${req.headers.host}/api/translate`, // for internal requests during ssr
          },
        },
        {
          provide: 'EXCLUDE_ROUTES_CONFIG',
          useValue: excludeFromAuthRoutes,
        },
        // for absolute path
        {
          provide: 'ORIGIN_URL',
          useValue: `${http}://${req.headers.host}`,
        },
      ],
    },
    (err, html) => {
      if (err) throw err;

      console.timeEnd(`GET: ${url}`); // tslint:disable-line
      res.send(html);
    },
  );
}

const app = express();

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
      // provideModuleMap(LAZY_MODULE_MAP)
    ],
  }),
);

app.use((req, res, next) => {
  if (req.headers.origin) {
    const writeHead = res.writeHead;
    res.writeHead = function(...args) {
      // It might be a little tricky here, because send supports a variety of arguments, and you have to make sure you support all of them!
      res.set('access-control-allow-origin', req.headers.origin);
      res.set('access-control-allow-credentials', true); // Todo: try move to get Profile request when ci/cd will be done

      writeHead.apply(this, args);
    };
  }
  next();
});
app.use(compression()); // gzip
app.use(cookieparser()); // cokies

/**
 * Dont move next two lines
 * If move after bodyParser it doesn't work
 * */

app.use('/api/translate', bodyParser.json(), translate);
app.use('/api/auth', bodyParser.urlencoded({ extended: true }), auth);
app.use('/api', proxy);
app.get('/restapi/info', (req, res) => res.send(config));
app.use('/restapi', ganttProxy);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // create application/json parser

app.get('/gantt/*.*', refreshTokenIfNeed, checkAuth, express.static(path.join(__dirname, '.'))); // all search
app.get('/gantt/*', refreshTokenIfNeed, checkAuth, (req, res) => {
  res.sendFile(__dirname + req.originalUrl.split('?').shift() + '/index.html');
});
app.get('/gantt', (req, res) => res.redirect('/gantt/gp-gantt'));

app.set('view engine', 'html'); // must
app.set('views', 'src');

app.get('/error/*', render);
app.get('/auth/*', render);
app.get('*.*', express.static(path.join(__dirname, '.', 'dist'))); // all search
app.get(ROUTES, refreshTokenIfNeed, checkAuth, express.static(path.join(__dirname, '.', 'static'))); // static
app.get('*', (req, res, next) => refreshTokenIfNeed(req, res, next, false), checkAuth, render);

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}!`));
