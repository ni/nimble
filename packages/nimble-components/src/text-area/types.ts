import { TextAreaResize } from '@microsoft/fast-foundation';

export { TextAreaResize };

export const TextAreaAppearance = {
    outline: 'outline',
    block: 'block'
} as const;
export type TextAreaAppearance =
    typeof TextAreaAppearance[keyof typeof TextAreaAppearance];
