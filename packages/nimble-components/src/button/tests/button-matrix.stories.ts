import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { ButtonAppearance } from '../types';
import { matrixThemeWrapper } from '../../tests/utilities/theme-test-helpers';
import '../index';

interface ButtonArgs {
    label: string;
    appearance: string;
    disabled: string;
}

const metadata: Meta<ButtonArgs> = {
    title: 'Tests/Button',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/42001df1-2969-438e-b353-4327d7a15102/specs/'
        }
    }
};

export default metadata;

export const defaultButton: Story<ButtonArgs> = (): string => '<nimble-button>Default Button</nimble-button>';

const matrixComponents = `
    <nimble-button appearance="${ButtonAppearance.Outline}">Outline Button</nimble-button>
    <nimble-button appearance="${ButtonAppearance.Ghost}">Ghost Button</nimble-button>
    <nimble-button appearance="${ButtonAppearance.Block}">Block Button</nimble-button>
    <nimble-button disabled appearance="${ButtonAppearance.Outline}">Outline Button Disabled</nimble-button>
    <nimble-button disabled appearance="${ButtonAppearance.Ghost}">Ghost Button Disabled</nimble-button>
    <nimble-button disabled appearance="${ButtonAppearance.Block}">Block Button Disabled</nimble-button>`;

export const buttonThemeMatrix: Story = (): string => matrixThemeWrapper(matrixComponents);
