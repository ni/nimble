import { TextAreaResize } from '@microsoft/fast-foundation';

export { TextAreaResize };
export type TextAreaResizeAttribute = `${TextAreaResize}`;

export const TextAreaAppearance = {
    Outline: 'outline',
    Block: 'block'
} as const;
export type TextAreaAppearanceAttribute =
    typeof TextAreaAppearance[keyof typeof TextAreaAppearance];
