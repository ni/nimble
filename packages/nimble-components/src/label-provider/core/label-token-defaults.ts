import type * as TokensNamespace from './label-tokens';

type TokenName = keyof typeof TokensNamespace;

export const coreLabelDefaults: { readonly [key in TokenName]: string } = {
    popupDismissLabel: 'Close',
    numericIncrementLabel: 'Increment',
    numericDecrementLabel: 'Decrement',
    errorIconLabel: 'Error',
    warningIconLabel: 'Warning',
    informationIconLabel: 'Information',
    selectFilterSearchLabel: 'Search',
    selectFilterNoResultsLabel: 'No items found'
};
