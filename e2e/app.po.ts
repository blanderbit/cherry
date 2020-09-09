import { browser, by, element } from 'protractor';

export class UniversalDemoPage {
    navigateTo() {
        return browser.get('/');
    }

    getParagraphText() {
        return element(by.css('app-root')).getText();
    }
}
