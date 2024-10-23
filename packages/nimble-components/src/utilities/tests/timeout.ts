/**
 * Timeout for use in async tets.
 */
export async function timeout(ms = 0): Promise<void> {
    await new Promise((resolve, _reject) => {
        window.setTimeout(() => {
            // eslint-disable-next-line no-void
            resolve(void 0);
        }, ms);
    });
}