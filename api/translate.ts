import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

export const translate = express.Router();
const i18nPath = path.join('dist', 'assets', 'i18n');
const i18nOverridesPath = path.join(i18nPath, 'override');

translate.get('/', getTranslates);
translate.put('/', updateTranslates);
applyTranslateUpdates();

async function updateTranslates(req, res) {
    const {body: {lang = null, file: file = null, description = null} = {}} = req;
    const path = getPath(lang, file);
    const overridePath = getOverridePath(lang, file);
    let data;
    let overrideData;

    try {
        data = await getTranslationData(path);
        overrideData = await getTranslationData(overridePath);

        await writeTranslationData(overridePath, {description});
        await writeTranslationData(path, {...data, description});
        res.send();
    } catch (err) {
        const originError = await writeTranslationData(path, data)
            .catch((_err) => _err);

        const overrideError = await writeTranslationData(overridePath, overrideData)
            .catch((_err) => _err);

        res.status(400).send({...err, originError, overrideError})
    }
}

async function getTranslates(req, res) {
    const {query: {lang = null, file: file = null} = {}} = req;

    try {
        const data = await getTranslationData(getPath(lang, file));

        res.send([{
            file,
            lang,
            // @ts-ignore
            description: data && data.description
        }]);
    } catch (err) {
        res.status(400).send(err)
    }
}

function safeParse(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Parse error', data, e)
    }
}

function getPath(lang, file) {
    return path.join(__dirname, '.', i18nPath, lang, `${ file }.json`)
}

function getOverridePath(lang, file) {
    return path.join(__dirname, '.', i18nOverridesPath, lang, `${ file }.json`)
}

async function getTranslationData(path) {
    if (!fs.existsSync(path))
        return null;

    return new Promise(((resolve, reject) => {
        fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
            if (err) {
                console.error('getTranslationData error', err);
                return reject(err);
            }
            resolve(safeParse(data))
        });
    }))
}

async function writeTranslationData(_path, data) {
    if (!fs.existsSync(_path)) {
        const index = _path.lastIndexOf(path.sep);
        const pathWithoutFile = _path.slice(0, index > 0 ? index : _path.length);
        mkdirp(pathWithoutFile);
    }

    return new Promise(((resolve, reject) => {
        try {
            fs.writeFile(_path, JSON.stringify(data), (err) => {
                if (err) {
                    console.error('writeTranslationData error', err);
                    return reject(err);
                }
                resolve()
            });
        } catch (e) {
            reject(e);
        }
    }))
}

async function applyTranslateUpdates() {
    if (!fs.existsSync(i18nOverridesPath)) {
        mkdirp(i18nOverridesPath);
    }

    const folders = await readDir(i18nOverridesPath);

    if (!Array.isArray(folders))
        return;

    for (let folder of folders) {
        const files = await readDir(path.join(i18nOverridesPath, folder));

        if (!Array.isArray(files))
            continue;

        for (let _file of files) {
            const file = _file.split('.')[0];

            try {
                const data = await getTranslationData(getPath(folder, file));
                const overrideData = await getTranslationData(getOverridePath(folder, file));

                await writeTranslationData(getPath(folder, file), {...data, ...overrideData});
                console.log('Translates merged', folder, file);
            } catch (err) {
                console.error('Can\'t merge translate overload data', folder, file, err);
            }
        }
    }
}


function readDir(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, function (err, folders) {
            if (err) {
                console.error('Can\'t read directory', dir, err);
                reject(err);
            }

            resolve(Array.isArray(folders) ? folders : []);
        });
    })
}

// https://github.com/nodejs/node/issues/27293
function mkdirp(dir) {
    console.log('mkdirp', dir);
    if (fs.existsSync(dir)) {
        return true
    }
    const dirname = path.dirname(dir);
    mkdirp(dirname);
    fs.mkdirSync(dir);
}
