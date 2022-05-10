import { TextAreaResize } from '@microsoft/fast-foundation';

export { TextAreaResize };

export const TextAreaAppearance = {
    Outline: 'outline',
    Block: 'block'
} as const;
export type TextAreaAppearance =
    typeof TextAreaAppearance[keyof typeof TextAreaAppearance];
