// Fv angular attributes that SHOULD NOT ever be localized need to be added to ignoreAttributeSets
// See: https://github.com/ni/javascript-styleguide/blob/main/packages/eslint-config-angular/lib/ok/fv/ignore-attributes.js

// Fv angular attributes that SHOULD be localized in production, but we don't want to localize
// in example apps should be added to the following list:
export const fvIgnoreAttributes = [
    'appearance-variant',
    'card-title',
    'count',
    'description',
    'edit-items-button-label',
    'header',
    'initials',
    'interaction-mode',
    'options',
    'selected-values',
    'subtitle',
    'trigger-label',
];
