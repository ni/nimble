import { withXD } from 'storybook-addon-xd-designs';
import { ButtonAppearance } from '../types';
import '../index';

export default {
    title: 'Button',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
        'https://xd.adobe.com/view/6fdbdacb-b624-4d2c-950e-a58f3fd7ebac-3a88/screen/aeff5951-0982-4f82-a471-a9e5a0675a63/specs'
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
    render: ({
        label,
        appearance,
        disabled
    }: {
        label: string,
        appearance: string,
        disabled: string
    }): string => `<nimble-button ${disabled} appearance="${appearance}">${label}</nimble-button>`,
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
