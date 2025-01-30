import {
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp
} from '@microsoft/fast-web-utilities';

export const ToolbarButton = {
    bold: 0,
    italics: 1,
    bulletList: 2,
    numberedList: 3
} as const;
export type ToolbarButton = (typeof ToolbarButton)[keyof typeof ToolbarButton];

export const ArrowKeyButton = {
    up: keyArrowUp,
    down: keyArrowDown,
    left: keyArrowLeft,
    right: keyArrowRight
} as const;
export type ArrowKeyButton =
    (typeof ArrowKeyButton)[keyof typeof ArrowKeyButton];

export type LabelProvider =
    | 'toggleBold'
    | 'toggleItalics'
    | 'toggleBulletedList'
    | 'toggleNumberedList';

export type ToolbarButtonKey = keyof typeof ToolbarButton;

export interface MappingConfiguration {
    key?: string;
    displayName?: string;
}
