export async function waitUntilCustomElementsDefinedAsync(
    elements: Element[]
): Promise<void> {
    const definedElements = elements.map(async item => {
        if (item.matches(':not(:defined)')) {
            await customElements.whenDefined(item.localName);
        }
    });
    await Promise.all(definedElements);
}
