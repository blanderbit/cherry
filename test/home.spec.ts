import { expect } from 'chai';

const request = require('./request-service');
let body: string;
const page = '/home';
const url = `http://localhost:4000${page}`;

describe(`test work ${page} with ssr`, () => {
    it('Should be exist', async () => {
        body = await request(url);
        return expect(body.includes('a')).to.equal(true);
    });

    it('Should be translated', async () => {
        body = await request(url);
        return expect(body.includes('home.title')).to.equal(false);
    });

});
