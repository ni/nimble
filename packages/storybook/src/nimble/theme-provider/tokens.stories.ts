import type { Meta } from '@storybook/html';
import { tokenNames } from '../../../../nimble-components/src/theme-provider/design-token-names';
import { getTokensStory, TokenName } from './tokens';

const tokenNameKeys = Object.keys(tokenNames) as TokenName[];
tokenNameKeys.sort((a, b) => a.localeCompare(b));

const metadata: Meta = {
    title: 'Tokens/Theme-aware Tokens',
    parameters: {
        docs: {
            source: {
                code: null
            }
        }
    }
};

export default metadata;

export const themeAwareTokens = getTokensStory(tokenNameKeys);
