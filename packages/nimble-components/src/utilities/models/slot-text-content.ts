export const slotTextContent = (slot: HTMLSlotElement): string => {
    return slot
        .assignedNodes()
        .map(node => node.textContent?.trim())
        .filter(content => content !== undefined && content !== '')
        .join(' ');
};
