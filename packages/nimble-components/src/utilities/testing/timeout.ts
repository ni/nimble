/**
 * Timeout for use in async tets.
 */
export async function timeout(ms = 0): Promise<void> {
    await new Promise(resolve => {
        window.setTimeout(() => resolve(undefined), ms);
    });
}