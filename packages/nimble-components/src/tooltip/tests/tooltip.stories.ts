import { html, ref } from '@microsoft/fast-element';
import type { AutoUpdateMode } from '@microsoft/fast-foundation';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import {
    borderColor,
    bodyFont,
    bodyFontColor
} from '../../theme-provider/design-tokens';
import { TooltipSeverity } from '../types';
import { tooltipTag } from '..';

const uniqueId = Symbol('unique id');
type HTMLElementWithUniqueID = HTMLElement & { [uniqueId]: string };

interface TooltipArgs {
    visible: boolean;
    severity: keyof typeof TooltipSeverity;
    delay: number;
    value: string;
    autoUpdateMode: AutoUpdateMode;
    iconVisible: boolean;
    anchorRef: HTMLElementWithUniqueID;
    getUniqueId: (x: HTMLElementWithUniqueID) => string;
    content: 'simple' | 'complex';
}

const simpleContent = html<TooltipArgs>`${x => x.value}`;
const complexContent = html<TooltipArgs>`
    <style class="code-hide">
        #complex-anchor {
            border: 1px solid var(${borderColor.cssCustomProperty});
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
            width: 100px;
            height: 55px;
        }

        .grouping {
            display: flex;
        }

        .grouping-left {
            padding-right: 10px;
        }

        .grouping-right {
            padding-left: 10px;
        }

        .section {
            padding-bottom: 5px;
            padding-top: 5px;
        }

        .title {
            margin-block: 0em;
        }
    </style>
    <div class="tooltip-text">
        Wafer 15 - A2CPQ-46B6
        <br />
        <div class="grouping">
            <div class="grouping-left">
                <div class="section">
                    <h4 class="title">Total Units</h4>
                    <span>2800</span>
                </div>
                <div class="section">
                    <h4 class="title">Total Good</h4>
                    <span>2519</span>
                </div>
                <div class="section">
                    <h4 class="title">Total Bad</h4>
                    <span>281</span>
                </div>
            </div>
            <div class="grouping-right">
                <div class="section">
                    <h4 class="title">Yield</h4>
                    <span>89.99%</span>
                </div>
                <div class="section">
                    <h4 class="title">Classification</h4>
                    <span>Bullseye</span>
                </div>
            </div>
        </div>
    </div>
`;

const metadata: Meta<TooltipArgs> = {
    title: 'Incubating/Tooltip',
    tags: ['autodocs'],
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) – A tooltip is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears when Escape is pressed or on mouse out. <br><br> It is recommended to set up aria-describedby, an accessibility feature that sets the description of another element through ID references. To do this, the anchor element (button, text, icon, etc.) of the tooltip must have `aria-describedby= name` in its attributes. To call it, use `id= name` in the nimble-tooltip attributes. More information can be found in the [aria-describedby docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby).'
            }
        },
        actions: {
            handles: ['dismiss']
        }
    },
    render: createUserSelectedThemeStory(html<TooltipArgs>`
        ${incubatingWarning({
        componentName: 'tooltip',
        statusLink: 'https://github.com/ni/nimble/issues/309'
    })}
        <div ${ref('anchorRef')} id="${x => x.getUniqueId(x.anchorRef)}">
            Hover here to see ${x => x.content} tooltip
        </div>
        <${tooltipTag}
            anchor="${x => x.getUniqueId(x.anchorRef)}"
            ?visible="${x => x.visible}"
            delay="${x => x.delay}"
            auto-update-mode="${x => x.autoUpdateMode}"
            severity="${x => TooltipSeverity[x.severity]}"
            ?icon-visible="${x => x.iconVisible}"
        >
            ${x => (x.content === 'complex' ? complexContent : simpleContent)}
        </${tooltipTag}>
        <style class="code-hide">
            #${x => x.getUniqueId(x.anchorRef)} {
                border: 1px solid var(${borderColor.cssCustomProperty});
                font: var(${bodyFont.cssCustomProperty});
                color: var(${bodyFontColor.cssCustomProperty});
                width: 80px;
                height: 60px;
            }
        </style>
    `),
    args: {
        visible: false,
        severity: 'default',
        iconVisible: false,
        value: 'Tooltip label',
        delay: 300,
        autoUpdateMode: 'anchor',
        anchorRef: undefined,
        getUniqueId: (x: HTMLElementWithUniqueID): string => {
            if (x[uniqueId] === undefined) {
                x[uniqueId] = `uniqueNimbleId_${Math.random()
                    .toString(36)
                    .substring(2, 7)}`;
            }
            return x[uniqueId];
        },
        content: 'simple'
    },
    argTypes: {
        autoUpdateMode: {
            options: ['anchor', 'auto'],
            control: { type: 'radio' },
            description:
                'Controls when the tooltip updates its position. The default is `anchor`, which only updates when the anchor is resized. `auto` will update on scroll/resize events.'
        },
        delay: {
            description:
                'The delay in milliseconds before a tooltip is shown after a hover event'
        },
        severity: {
            options: Object.keys(TooltipSeverity),
            control: { type: 'radio' }
        },
        content: {
            options: ['simple', 'complex'],
            control: {
                type: 'radio'
            }
        },
        anchorRef: {
            table: {
                disable: true
            }
        },
        getUniqueId: {
            table: {
                disable: true
            }
        }
    }
};

export default metadata;
export const tooltip: StoryObj<TooltipArgs> = {};
