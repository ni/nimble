import type * as TokensNamespace from './label-tokens';

type TokenName = keyof typeof TokensNamespace;

export const chatLabelDefaults: { readonly [key in TokenName]: string } = {
    chatInputSendLabel: 'Send',
    chatInputStopLabel: 'Stop'
};
