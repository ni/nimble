import { observable } from '@microsoft/fast-element';

const prefersColorSchemeDarkMediaQuery: MediaQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)'
);

/**
 * Observable class to subscribe to the prefers-color-schema media query
 */
class PrefersColorScheme {
    /**
     * True if the user prefers a dark color scheme,
     * false if the user preferes light or has no preference
     */
    @observable
    public dark: boolean = prefersColorSchemeDarkMediaQuery.matches;

    public constructor() {
        prefersColorSchemeDarkMediaQuery.addEventListener('change', evt => {
            this.dark = evt.matches;
        });
    }
}

export const prefersColorScheme = new PrefersColorScheme();
