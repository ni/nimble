import { observable } from '@microsoft/fast-element';

/**
 * Observable class to subscribe to changes in the page's lang attribute
 */
class DocumentElementLang {
    @observable
    public lang: string = document.documentElement.lang;

    public constructor() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (
                    mutation.type === 'attributes'
                    && mutation.attributeName === 'lang'
                ) {
                    this.lang = (mutation.target as HTMLElement).lang;
                }
            }
        });
        observer.observe(document.documentElement, {
            attributeFilter: ['lang']
        });
    }
}

export const documentElementLang = new DocumentElementLang();
