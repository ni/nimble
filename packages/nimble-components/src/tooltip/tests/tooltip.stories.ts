import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import type { AutoUpdateMode } from '@microsoft/fast-foundation';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { TooltipStatus } from '../types';

interface TooltipArgs {
    delay: number;
    horiontalViewportLock: boolean;
    verticalViewportLock: boolean;
    tooltip: string;
    status: TooltipStatus;
    autoUpdateMode: AutoUpdateMode; // Need to figure out how to test / make sure this works?
    // anchorIdSet: string; // maybe do this?
}

const metadata: Meta<TooltipArgs> = {
    title: 'Tooltip',
    decorators: [withXD],
    parameters: {
        docs: {
            description: { // to be updated
                component:
                    'Per [W3C](https://w3c.github.io/aria-practices/#tooltip) – A tooltip is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/specs/'
        },
        actions: {
            handles: ['change']
        }
    },
    render: createUserSelectedThemeStory(html<TooltipArgs>`
        <nimble-button id='anchor'>text</nimble-button>

            <nimble-tooltip
                anchor='anchor' 
                delay='${x => x.delay}'
                ?horiontalViewportLock="${x => x.horiontalViewportLock}"
                ?verticalViewportLock="${x => x.verticalViewportLock}"
                autoUpdateMode='anchor'
            >
            ${x => x.tooltip}
            </nimble-tooltip> 
    `),
    args: {
        tooltip: 'Tooltip label',
        delay: 300,
        horiontalViewportLock: false,
        verticalViewportLock: false,
        status: TooltipStatus.default
    },
    argTypes: {
        status: {
            options: Object.values(TooltipStatus),
            control: { type: 'radio' },
        }
    },
};

export default metadata;

export const tooltip: StoryObj<TooltipArgs> = {};