export const getTagsFromElement = (
    doc: DocumentFragment | HTMLElement
): string[] => {
    const nodes = Array.from(doc.querySelectorAll('*')).map(el => el.tagName);
    return nodes;
};

export const getLeafContentsFromElement = (
    doc: DocumentFragment | HTMLElement
): string[] => {
    const nodes = Array.from(doc.querySelectorAll('*'))
        .filter((el, _) => {
            return el.children.length === 0;
        })
        .map(el => el.textContent || '');
    return nodes;
};

export const getLastChildElementAttribute = (
    attribute: string,
    doc: DocumentFragment | HTMLElement
): string => {
    return getLastChildElement(doc)?.getAttribute(attribute) ?? '';
};

export function getLastChildElement(
    doc: DocumentFragment | HTMLElement
): Element | null | undefined {
    let lastElement = doc.lastElementChild;

    while (lastElement?.lastElementChild) {
        lastElement = lastElement.lastElementChild;
    }
    return lastElement;
}
