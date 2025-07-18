import { html, ref } from '@ni/fast-element';
import type { AutoUpdateMode } from '@ni/fast-foundation';
import { withActions } from 'storybook/actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import {
    borderColor,
    bodyFont,
    bodyFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { tooltipTag } from '@ni/nimble-components/dist/esm/tooltip';
import { TooltipSeverity } from '@ni/nimble-components/dist/esm/tooltip/types';
import {
    apiCategory,
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/storybook';

const uniqueId = Symbol('unique id');
type HTMLElementWithUniqueID = HTMLElement & { [uniqueId]: string };

interface TooltipArgs {
    visible: boolean;
    severity: keyof typeof TooltipSeverity;
    delay: number;
    autoUpdateMode: AutoUpdateMode;
    iconVisible: boolean;
    anchorRef: HTMLElementWithUniqueID;
    getUniqueId: (x: HTMLElementWithUniqueID) => string;
    content: 'simple' | 'complex';
}

const simpleContent = html<TooltipArgs>`Tooltip label`;
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
    decorators: [withActions<HtmlRenderer>],
    parameters: {
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
        visible: {
            description: 'Whether the tooltip is visible by default.',
            table: { category: apiCategory.attributes }
        },
        autoUpdateMode: {
            name: 'auto-update-mode',
            options: ['anchor', 'auto'],
            control: { type: 'radio' },
            description:
                'Controls when the tooltip updates its position. The default is `anchor`, which only updates when the anchor is resized. `auto` will update on scroll/resize events.',
            table: { category: apiCategory.attributes }
        },
        iconVisible: {
            name: 'icon-visible',
            description:
                'Whether to show an icon in the tooltip. The icon is determined by the severity of the tooltip.',
            table: { category: apiCategory.attributes }
        },
        delay: {
            description:
                'The delay in milliseconds before a tooltip is shown after a hover event',
            table: { category: apiCategory.attributes }
        },
        severity: {
            options: Object.keys(TooltipSeverity),
            control: { type: 'radio' },
            description:
                'The severity of the message presented by the tooltip.',
            table: { category: apiCategory.attributes }
        },
        content: {
            name: 'default',
            options: ['simple', 'complex'],
            control: {
                type: 'radio'
            },
            description: 'The content to display in the tooltip.',
            table: { category: apiCategory.slots }
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
