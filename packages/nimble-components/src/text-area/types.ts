import { TextAreaResize } from '@ni/fast-foundation';

export { TextAreaResize };

export const TextAreaAppearance = {
    outline: 'outline',
    block: 'block'
} as const;
export type TextAreaAppearance =
    (typeof TextAreaAppearance)[keyof typeof TextAreaAppearance];
