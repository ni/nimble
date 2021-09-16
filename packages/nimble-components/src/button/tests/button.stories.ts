import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { ButtonAppearance } from '../types';
import { Icons, NimbleIcon } from '../../icons/types';
import '../index';

interface ButtonArgs {
    label: string;
    appearance: string;
    disabled: string;
    icon: string;
}

const metadata: Meta<ButtonArgs> = {
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
        },
        icon: {
            options: Object.values(Icons).map(icon => (icon as NimbleIcon).name),
            control: { type: 'select' }
        }
    },
    render: ({ label, appearance, disabled, icon }: ButtonArgs): string => `<nimble-button ${disabled} appearance="${appearance}" icon="${icon}">${label}</nimble-button>`,
    args: {
        label: 'Ghost Button',
        appearance: 'ghost',
        icon: Icons.locked.name
    }
};

export default metadata;

export const outlineButton: Story<ButtonArgs> = {
    args: { label: 'Outline Button', appearance: ButtonAppearance.Outline, icon: Icons.delete.name }
};
export const ghostButton: Story<ButtonArgs> = {
    args: { label: 'Ghost Button', appearance: ButtonAppearance.Ghost }
};
export const blockButton: Story<ButtonArgs> = {
    args: { label: 'Block Button', appearance: ButtonAppearance.Block }
};
