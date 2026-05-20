import type * as TokensNamespace from './label-tokens';

type TokenName = keyof typeof TokensNamespace;

export const coreLabelDefaults: { readonly [key in TokenName]: string } = {
    popupDismissLabel: 'Close',
    numericDecrementLabel: 'Decrement',
    numericIncrementLabel: 'Increment',
    popupIconErrorLabel: 'Error',
    popupIconWarningLabel: 'Warning',
    popupIconCompletedLabel: 'Completed',
    popupIconCurrentLabel: 'Current',
    popupIconInformationLabel: 'Information',
    filterSearchLabel: 'Search',
    filterNoResultsLabel: 'No items found',
    loadingLabel: 'Loading…',
    scrollBackwardLabel: 'Scroll backward',
    scrollForwardLabel: 'Scroll forward',
    itemRemoveLabel: 'Remove'
};
