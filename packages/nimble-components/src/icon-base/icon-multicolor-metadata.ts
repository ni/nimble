/**
 * Metadata for multi-color icons.
 * This list is used by build scripts in nimble-components, angular-workspace,
 * and react-workspace to identify which icons should not be auto-generated.
 *
 * Note: This list must be kept in sync with the multi-color SVGs in
 * packages/nimble-tokens/dist/icons/svg-multicolor.
 */
export const multiColorIcons = ['circle-partial-broken'] as const;

export type MultiColorIconName = (typeof multiColorIcons)[number];
