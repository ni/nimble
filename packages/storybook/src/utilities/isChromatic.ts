// Adapted from https://github.com/chromaui/chromatic-cli/blob/24a3816e956f724e335fe649bb8fa77fda308b40/isChromatic.mjs#L3
// We have our own copy because depending on the chromatic package adds an unreasonably large number of peer dependencies

/**
 * Returns `true` if running within Chromatic, `false` otherwise.
 * @argument window - The window object whose `navigator` and/or `location` is
 * used to determine if running in Chromatic.
 */
export function isChromatic(windowArg?: Window): boolean {
    const windowToCheck = windowArg || (typeof window !== 'undefined' && window);
    return !!(
        windowToCheck
        && (windowToCheck.navigator.userAgent.match(/Chromatic/)
            || windowToCheck.location.href.match(/chromatic=true/))
    );
}
