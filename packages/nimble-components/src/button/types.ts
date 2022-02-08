/**
 * Types of button appearance.
 * @public
 */
import type { Button } from '@microsoft/fast-foundation';

export enum ButtonAppearance {
    Outline = 'outline',
    Ghost = 'ghost',
    Block = 'block'
}
export type ButtonAppearanceAttribute = `${ButtonAppearance}`;

export type ButtonType = Button['type'];
