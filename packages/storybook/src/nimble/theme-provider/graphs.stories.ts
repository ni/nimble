import type { Meta } from '@storybook/html';
import { getTokensStory, TokenName } from './tokens';

const graphTokenNames = [
    'graphGridlineColor',
    'graphTrace1Color',
    'graphTrace2Color',
    'graphTrace3Color',
    'graphTrace4Color',
    'graphTrace5Color',
    'graphTrace6Color',
    'graphTrace7Color',
    'graphTrace8Color'
] as TokenName[];

const metadata: Meta = {
    title: 'Tokens/Graph Styling',
    parameters: {
        docs: {
            source: {
                code: null
            }
        }
    }
};

export default metadata;

export const graphStyling = getTokensStory(graphTokenNames);
