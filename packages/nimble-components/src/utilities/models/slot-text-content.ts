/**
 * Finds all text content within a slot and returns it as a space-delimited string.
 */
export const slotTextContent = (slot: HTMLSlotElement): string => {
    return slot
        .assignedNodes()
        .map(node => node.textContent?.trim())
        .filter(content => content !== undefined && content !== '')
        .join(' ');
};
