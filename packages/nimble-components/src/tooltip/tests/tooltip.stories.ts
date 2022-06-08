import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import type { AutoUpdateMode } from '@microsoft/fast-foundation';

interface TooltipArgs {
    visible: boolean;
    anchor: string;
    delay: number;
    autoUpdateMode: AutoUpdateMode; // ? Can't put in args
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
    render: createUserSelectedThemeStory(html`
        <nimble-tooltip
            
        >
        </nimble-tooltip>
    `),
    argTypes: {
        autoUpdateMode: {
            description: `Whether the checkbox is in the indeterminate (i.e. partially checked) state. Configured programmatically, not by attribute.
<details>
<summary>Usage details</summary>
The \`indeterminate\` state is not automatically changed when the user changes the \`checked\` state. Client applications that use \`indeterminate\` state are responsible for subscribing to the \`change\` event to respond to this situation.
</details>`
        }
    },
    args: {
        tooltip: 'Tooltip label',
        anchor: 'id of element', // how to set to id of element tooltip anchored to
        visible: true,
        delay: 300,
        horiontalViewportLock: false,
        verticalViewportLock: false
    }
};

export default metadata;

export const checkbox: StoryObj<TooltipArgs> = {}; // if checkbox changed to tooltip doesn't work
