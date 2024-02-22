export const ModalState = {
    opening: 'opening',
    open: 'open',
    closing: 'closing',
    closed: 'closed'
} as const;
export type ModalState = (typeof ModalState)[keyof typeof ModalState];
