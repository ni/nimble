/**
 * Verifies that a particular element is fully visible (no hidden overflow) in the viewport
 */
export async function checkFullyInViewport(
    element: HTMLElement
): Promise<boolean> {
    return new Promise((resolve, _reject) => {
        const intersectionObserver = new IntersectionObserver(
            entries => {
                intersectionObserver.disconnect();
                if (
                    entries[0]?.isIntersecting
                    && entries[0].intersectionRatio === 1.0
                ) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            // As of now, passing a document as root is not supported on Safari:
            // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#browser_compatibility
            // If we begin running these tests on Safari, we may need to skip those that use this function.
            // This issue tracks expanding testing to Safari: https://github.com/ni/nimble/issues/990
            { threshold: 1.0, root: document }
        );
        intersectionObserver.observe(element);
    });
}
