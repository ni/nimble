import { observable } from '@microsoft/fast-element';

const prefersColorSchemeDarkMediaQuery: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Observable class to subscribe to the prefers-color-schema media query
 */
class PrefersColorScheme {
    @observable
    public dark: boolean = prefersColorSchemeDarkMediaQuery.matches;

    public constructor() {
        prefersColorSchemeDarkMediaQuery.addEventListener('change', () => {
            this.dark = prefersColorSchemeDarkMediaQuery.matches;
        });
    }
}

export const prefersColorScheme = new PrefersColorScheme();
