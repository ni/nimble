import type * as TokensNamespace from './label-tokens';

type TokenName = keyof typeof TokensNamespace;

export const coreLabelDefaults: { readonly [key in TokenName]: string } = {
    popupDismissLabel: 'Close',
    numericIncrementLabel: 'Increment',
    numericDecrementLabel: 'Decrement',
    popupIconErrorLabel: 'Error',
    popupIconWarningLabel: 'Warning',
    popupIconInformationLabel: 'Information',
    filterSearchLabel: 'Search',
    filterNoResultsLabel: 'No items found'
};
