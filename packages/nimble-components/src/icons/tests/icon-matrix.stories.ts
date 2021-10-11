import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    themeWrapper
} from '../../tests/utilities/theme-test-helpers';
import '../index';
import '../check/index';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import { IconStatus } from './types';

const metadata: Meta = {
    title: 'Tests/Icon',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs'
        },
        controls: { hideNoControlsWarning: true }
    }
};

export default metadata;

const iconStates = [
    ['Pass', IconStatus.Pass],
    ['Fail', IconStatus.Fail],
    ['Warning', IconStatus.Warning],
    ['Regular', IconStatus.Regular]
];
type IconState = typeof iconStates[number];

const component = ([stateName, state]: IconState): ViewTemplate => html`
    <nimble-text-field readonly value="${stateName}"></<nimble-text-field>
    <nimble-check-icon class="${state}"> </nimble-check-icon>
`;

export const iconThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component, [iconStates]))
);
