import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
} from '@microsoft/fast-foundation';

/**
 * A nimble-styled menu-item
 */
export class MenuItem extends FoundationMenuItem {}
export const menuItemTag = DesignSystem.tagFor(MenuItem);
