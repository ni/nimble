import { observable } from '@microsoft/fast-element';

const prefersColorSchemeDarkMediaQuery: MediaQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)'
);

/**
 * Observable class to subscribe to CSS user preferences
 */
class PrefersObserver {
    /**
     * True if the user prefers a dark color scheme,
     * false if the user preferes light or has no preference
     */
    @observable
    public colorSchemeDark: boolean = prefersColorSchemeDarkMediaQuery.matches;

    public constructor() {
        prefersColorSchemeDarkMediaQuery.addEventListener('change', evt => {
            this.colorSchemeDark = evt.matches;
        });
    }
}

export const prefersObserver = new PrefersObserver();
