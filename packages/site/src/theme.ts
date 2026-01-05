import { themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';

export function themify(): void {
    const themeProvider = document.querySelector(themeProviderTag)!;
    const prefersColorSchemeDarkMediaQuery: MediaQueryList = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );
    themeProvider.theme = prefersColorSchemeDarkMediaQuery.matches ? 'dark' : 'light';
    prefersColorSchemeDarkMediaQuery.addEventListener('change', evt => {
        themeProvider.theme = evt.matches ? 'dark' : 'light';
    });
}
