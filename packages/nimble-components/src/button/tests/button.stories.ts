import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, when } from '@microsoft/fast-element';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { ButtonAppearance } from '../types';
import '../index';
import '../../icons/access-control';
import { createRenderer } from '../../utilities/tests/storybook';

interface ButtonArgs {
    label: string;
    appearance: string;
    disabled: boolean;
    icon: boolean;
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
        }
    },
    // prettier-ignore
    render: createRenderer(html`
        <nimble-button ?disabled="${x => x.disabled}" appearance="${x => x.appearance}">
            ${when(x => x.icon, html`<nimble-access-control-icon></nimble-access-control-icon>`)}
            ${x => x.label}
        </nimble-button>
`),
    args: {
        label: 'Ghost Button',
        appearance: 'ghost',
        icon: false,
        disabled: false
    }
};

export default metadata;

export const outlineButton = {
    args: { label: 'Outline Button', appearance: ButtonAppearance.Outline },
    play: () => {
        userEvent.click(screen.getAllByText(/outline button/i)[0]);
        console.log('button play');
    }
};
export const ghostButton = {
    args: { label: 'Ghost Button', appearance: ButtonAppearance.Ghost }
};
export const blockButton = {
    args: { label: 'Block Button', appearance: ButtonAppearance.Block }
};
