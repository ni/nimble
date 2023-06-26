import type * as TokensNamespace from './label-tokens';

type TokenName = keyof typeof TokensNamespace;

export const coreLabelDefaults: { readonly [key in TokenName]: string } = {
    alertDismissLabel: 'Close',
    numberFieldIncrementLabel: 'Increment',
    numberFieldDecrementLabel: 'Decrement'
};
