// Fv angular attributes that SHOULD NOT ever be localized need to be added to ignoreAttributeSets
// See: https://github.com/ni/javascript-styleguide/blob/main/packages/eslint-config-angular/lib/ok/fv/ignore-attributes.js

const exampleAppOnlyIgnoreAttributes = [
    // Should be localized in production, but are intentionally not localized in example apps.
    'card-title',
    'description',
    'edit-items-button-label',
    'header',
    'options',
    'selected-values',
    'status-label',
    'status-color',
    'subtitle',
    'title-text',
    'trigger-label',
];

const temporaryAlwaysIgnoreAttributes = [
    // Should not be localized. Keep these here until they move into the shared ignoreAttributeSets.
    'count',
    'initials',
    'interaction-mode',
];

export const fvIgnoreAttributes = [
    ...exampleAppOnlyIgnoreAttributes,
    ...temporaryAlwaysIgnoreAttributes,
];
