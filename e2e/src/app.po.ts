import { browser, by, element } from 'protractor';
import { promise as wdpromise } from 'selenium-webdriver';

export class AppPage {
    navigateTo(destination: string): wdpromise.Promise<any> {
        return browser.get(destination);
    }

    getParagraphText(): wdpromise.Promise<string> {
        return element(by.deepCss('app-root ion-content')).getText();
    }
}
