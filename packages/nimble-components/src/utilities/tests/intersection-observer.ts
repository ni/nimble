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
            { threshold: 1.0, root: document }
        );
        intersectionObserver.observe(element);
    });
}
