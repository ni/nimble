import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { IconDynamic } from '@ni/ok-components/dist/esm/icon-dynamic';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';

const tagName = 'ok-icon-dynamic-awesome';
const url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="black"/></svg>';

const metadata: Meta = {
    title: 'Tests Ok/Icon Dynamic',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

IconDynamic.registerIconDynamic(tagName, url);

const component = (): ViewTemplate => {
    return html`<${tagName}></${tagName}>`;
};

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);
