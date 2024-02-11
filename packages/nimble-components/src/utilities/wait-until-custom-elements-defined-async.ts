export async function waitUntilCustomElementsDefinedAsync(
    elements: Element[]
): Promise<void> {
    const definedElements = elements.map(async item => (item.matches(':not(:defined)')
        ? customElements.whenDefined(item.localName)
        : Promise.resolve()));
    await Promise.all(definedElements);
}
