import { observable } from '@microsoft/fast-element';
import { Direction } from '@microsoft/fast-web-utilities';

/**
 * Observable class to subscribe to changes on the document element attributes
 */
class DocumentElementObserver {
    @observable
    public lang: string = document.documentElement.lang;

    // TODO should we observe the dir attribute or the computed dir? https://developer.mozilla.org/en-US/docs/Web/CSS/:dir
    // Answer no, it's not cross-browser lol
    @observable
    public dir: string = document.documentElement.dir;

    public constructor() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'lang') {
                        this.lang = (mutation.target as HTMLElement).lang;
                    } else if (mutation.attributeName === 'dir') {
                        this.dir = (mutation.target as HTMLElement).dir;
                    }
                }
            }
        });
        observer.observe(document.documentElement, {
            attributeFilter: ['lang', 'dir']
        });
    }
}

export const documentElementObserver = new DocumentElementObserver();

export const isValidLang = (value: string): boolean => {
    try {
        // We are relying on the Locale constructor to validate the value
        // eslint-disable-next-line no-new
        new Intl.Locale(value);
        return true;
    } catch (e) {
        return false;
    }
};

export const isValidDir = (value: string): boolean => {
    return Direction[value as Direction] !== undefined;
};
