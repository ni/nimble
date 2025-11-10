/**
 * Metadata for multi-color icons.
 * This list is used by build scripts in nimble-components, angular-workspace,
 * and react-workspace to identify which icons should not be auto-generated.
 *
 * This TypeScript file re-exports from the .js file to provide type safety.
 * The .js file is the source of truth to avoid build ordering issues.
 */
// eslint-disable-next-line import/extensions
export { multiColorIcons } from './icon-multicolor-metadata-data.js';

export type MultiColorIconName =
    (typeof import('./icon-multicolor-metadata-data.js').multiColorIcons)[number];
