export const getTagsFromDocumentFragment = (doc: DocumentFragment | HTMLElement): string[] => {
    const nodes = Array.from(doc.querySelectorAll('*')).map(
        el => el.tagName
    );
    return nodes;
};

export const getLeafContentsFromDocumentFragment = (
    doc: DocumentFragment | HTMLElement
): string[] => {
    const nodes = Array.from(doc.querySelectorAll('*'))
        .filter((el, _) => {
            return el.children.length === 0;
        })
        .map(el => el.textContent || '');
    return nodes;
};