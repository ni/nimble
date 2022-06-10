import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface TooltipArgs {
    
    delay: number;
    horiontalViewportLock: boolean;
    verticalViewportLock: boolean;
    tooltip: string;
}

const metadata: Meta<TooltipArgs> = {
    title: 'Tooltip',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://w3c.github.io/aria-practices/#checkbox) – The dual-state checkbox is the most common type, as it allows the user to toggle between two choices: checked and not checked.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs'
        },
        actions: {
            handles: ['change']
        }
    },
    render: createUserSelectedThemeStory(html<TooltipArgs>`
        <nimble-button id="anchor">text</nimble-button>

        <nimble-tooltip anchor='anchor'>tooltip text</nimble-tooltip> 
    `),
    args: {
        tooltip: 'Tooltip label',
        delay: 300,
        horiontalViewportLock: false,
        verticalViewportLock: false
    }
};

export default metadata;

export const checkbox: StoryObj<TooltipArgs> = {}; // if checkbox changed to tooltip doesn't work
