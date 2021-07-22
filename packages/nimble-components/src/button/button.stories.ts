import './index';
import { withXD } from 'storybook-addon-xd-designs';
import { ButtonAppearance } from './types';

export default {
    title: 'Button',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
        'https://xd.adobe.com/view/6fdbdacb-b624-4d2c-950e-a58f3fd7ebac-3a88/screen/aeff5951-0982-4f82-a471-a9e5a0675a63/specs'
        }
    },
    argTypes: {
        appearance: {
            options: Object.values(ButtonAppearance),
            control: { type: 'radio' }
        }
    },
    render: ({
        label,
        appearance
    }: {
        label: string,
        appearance: string
    }): string => `<nimble-button appearance="${appearance}">${label}</nimble-button>`,
    args: {
        label: 'Ghost Button',
        appearance: 'ghost'
    }
};

export const outlineButton = {
    args: { label: 'Outline Button', appearance: ButtonAppearance.Outline }
};
export const ghostButton = {
    args: { label: 'Ghost Button', appearance: ButtonAppearance.Ghost }
};
export const blockButton = {
    args: { label: 'Block Button', appearance: ButtonAppearance.Block }
};
