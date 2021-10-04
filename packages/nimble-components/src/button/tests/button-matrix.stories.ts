import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { ButtonAppearance } from '../types';
import {
    matrixThemeWrapper,
    disabledStates,
    DisabledState,
    iconStates,
    IconState
} from '../../tests/utilities/theme-test-helpers';
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
const noContent = 'NO_CONTENT';
const appearanceStates = [...Object.entries(ButtonAppearance), [noContent, '']];
type AppearanceState = typeof appearanceStates[number];

const component = (
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    icon: IconState
): string => `
    <nimble-button appearance="${appearance}" ${disabled}>
        ${icon}
        ${
    appearanceName === noContent
        ? ''
        : `${appearanceName} Button ${disabledName}`
}
    </nimble-button>
    `;

export const buttonThemeMatrix: Story = (): string => matrixThemeWrapper(component, [
    disabledStates,
    appearanceStates,
    iconStates
]);
