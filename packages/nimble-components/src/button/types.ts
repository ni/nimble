/**
 * Types of button appearance.
 * @public
 */
import type { Button } from '@microsoft/fast-foundation';

export type ButtonAppearanceAttribute = 'outline' | 'ghost' | 'block';
export enum ButtonAppearance {
    Outline = 'outline',
    Ghost = 'ghost',
    Block = 'block'
}

export type ButtonType = Button['type'];
