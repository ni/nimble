import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { TsIconDynamic } from '@ni/ok-components/dist/esm/ts-icon-dynamic';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';

const tagName = 'ok-ts-icon-dynamic-simple';
const url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="black"/></svg>';

const metadata: Meta = {
    title: 'Tests Ok/TS Icon Dynamic',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

TsIconDynamic.registerIconDynamic(tagName, url);

const component = (): ViewTemplate => {
    return html`<${tagName}></${tagName}>`;
};

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);
