export async function waitForAsync(conditionFn: () => boolean): Promise<void> {
    while (!conditionFn()) {
        // eslint-disable-next-line no-await-in-loop
        await waitAsync();
    }
}

export async function waitAsync(): Promise<void> {
    await new Promise(window.requestAnimationFrame);
}