export const ToolbarButton = {
    bold: 0,
    italics: 1,
    bulletList: 2,
    numberedList: 3
} as const;
export type ToolbarButton = (typeof ToolbarButton)[keyof typeof ToolbarButton];
