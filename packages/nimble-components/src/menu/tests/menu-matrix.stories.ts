import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import {
    matrixThemeWrapper,
} from '../../tests/utilities/theme-test-helpers';
import '../index';

const metadata: Meta = {
    title: 'Tests/Menu',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e'
        },
    },
};

export default metadata;

// prettier-ignore
const component = (): string => `
    <nimble-menu>
        <nimble-menu-item>Item 1</nimble-menu-item>
        <nimble-menu-item disabled>Item 2</nimble-menu-item>
        <nimble-menu-item>Item 3</nimble-menu-item>
    </nimble-menu>
`;

export const menuThemeMatrix: Story = (): string => matrixThemeWrapper(component);