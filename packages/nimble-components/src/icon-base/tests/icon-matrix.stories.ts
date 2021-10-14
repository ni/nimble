import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrix,
    themeWrapper
} from '../../tests/utilities/theme-test-helpers';
import '../index';
import '../../icons/check';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import { IconStatus } from './types';

const metadata: Meta = {
    title: 'Tests/Icon',
    decorators: [withXD],
    parameters: {
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
