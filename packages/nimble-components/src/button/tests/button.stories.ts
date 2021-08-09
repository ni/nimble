import { withXD } from 'storybook-addon-xd-designs';
import { ButtonAppearance } from '../types';
import '../index';

interface ButtonArgs {
    label: string;
    appearance: string;
    disabled: string;
}

export default {
    title: 'Button',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
        'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/42001df1-2969-438e-b353-4327d7a15102/specs/'
        },
        actions: {
            handles: ['click']
        }
    },
    argTypes: {
        appearance: {
            options: Object.values(ButtonAppearance),
            control: { type: 'radio' }
        },
        disabled: {
            options: ['disabled'],
            control: { type: 'check' }
        }
    },
    render: ({ label, appearance, disabled }: ButtonArgs): string => `<nimble-button ${disabled} appearance="${appearance}">${label}</nimble-button>`,
    args: {
        label: 'Ghost Button',
        appearance: 'ghost'
    }
};

export const defaultButton = (): string => '<nimble-button>Default Button</nimble-button>';

export const outlineButton = {
    args: { label: 'Outline Button', appearance: ButtonAppearance.Outline }
};
export const ghostButton = {
    args: { label: 'Ghost Button', appearance: ButtonAppearance.Ghost }
};
export const blockButton = {
    args: { label: 'Block Button', appearance: ButtonAppearance.Block }
};
export const outlineButtonDisabled = {
    args: {
        ...outlineButton.args,
        disabled: 'disabled'
    }
};
export const ghostButtonDisabled = {
    args: {
        ...ghostButton.args,
        disabled: 'disabled'
    }
};
export const blockButtonDisabled = {
    args: {
        ...blockButton.args,
        disabled: 'disabled'
    }
};
