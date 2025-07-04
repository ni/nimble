import { html, ref } from '@ni/fast-element';
import type { AutoUpdateMode } from '@ni/fast-foundation';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
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

const simpleContent = html<TooltipArgs>`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur rhoncus facilisis. Mauris in neque in nulla ultricies feugiat a eu lorem. Praesent commodo ligula eu sapien laoreet consequat in eget massa. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce accumsan, dui vitae commodo condimentum, arcu lorem ornare nulla, non dignissim risus orci quis nisi. Praesent tempus nunc at semper placerat. Donec in laoreet lectus, et bibendum sapien.

Suspendisse cursus tempus consequat. Curabitur euismod a leo vitae condimentum. Integer consequat ante sit amet enim ornare rutrum fringilla et purus. Etiam ut dolor quis libero eleifend ornare. Suspendisse posuere mauris eget ex fringilla laoreet. Mauris tempor dignissim justo sed aliquet. Sed nunc lorem, posuere vitae ipsum quis, suscipit semper tellus. Integer luctus tempus arcu sed sodales. Proin porta, tortor quis molestie hendrerit, augue massa pellentesque neque, at dignissim lorem nibh eu urna. Quisque aliquet consequat odio, sit amet ornare nisl pharetra quis. Ut bibendum erat dolor. Vestibulum vulputate maximus massa, ut ornare turpis scelerisque quis. Etiam tempor dictum lectus, vitae posuere mauris pellentesque at. Curabitur aliquet iaculis efficitur. Nullam velit arcu, suscipit et eros vel, tempus efficitur magna. Morbi lobortis, diam id tempus sodales, nibh tellus cursus nibh, non cursus lacus arcu dignissim tortor.

Aliquam porta nisi quis ipsum placerat elementum. Nulla sed scelerisque tortor, quis porttitor mauris. Vivamus sollicitudin scelerisque lacus, ac pellentesque nisi porta non. Morbi ut tempus libero. Curabitur tristique risus non lorem convallis tincidunt. Vivamus molestie, dolor vel pellentesque gravida, neque velit varius justo, ac aliquet quam turpis ac velit. Nulla scelerisque urna a nunc vestibulum elementum. Duis consectetur vitae risus eget hendrerit. Cras pulvinar purus risus, nec finibus risus facilisis at. Aenean fermentum eleifend neque in posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam lobortis justo ultrices lectus pharetra posuere vitae vitae quam. Praesent sodales ipsum nec vehicula mollis. Maecenas in euismod mi.

Nullam bibendum ipsum nec felis cursus finibus. Ut suscipit mollis mi, in suscipit arcu rhoncus eget. Vestibulum dapibus lacus sed eros mattis bibendum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus eleifend ligula sem, et placerat risus consectetur eu. Suspendisse rutrum leo varius ipsum aliquam aliquet. Suspendisse ut aliquet neque. Cras semper tellus ac tellus lacinia commodo. Donec at scelerisque sem.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur rhoncus facilisis. Mauris in neque in nulla ultricies feugiat a eu lorem. Praesent commodo ligula eu sapien laoreet consequat in eget massa. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce accumsan, dui vitae commodo condimentum, arcu lorem ornare nulla, non dignissim risus orci quis nisi. Praesent tempus nunc at semper placerat. Donec in laoreet lectus, et bibendum sapien.

Suspendisse cursus tempus consequat. Curabitur euismod a leo vitae condimentum. Integer consequat ante sit amet enim ornare rutrum fringilla et purus. Etiam ut dolor quis libero eleifend ornare. Suspendisse posuere mauris eget ex fringilla laoreet. Mauris tempor dignissim justo sed aliquet. Sed nunc lorem, posuere vitae ipsum quis, suscipit semper tellus. Integer luctus tempus arcu sed sodales. Proin porta, tortor quis molestie hendrerit, augue massa pellentesque neque, at dignissim lorem nibh eu urna. Quisque aliquet consequat odio, sit amet ornare nisl pharetra quis. Ut bibendum erat dolor. Vestibulum vulputate maximus massa, ut ornare turpis scelerisque quis. Etiam tempor dictum lectus, vitae posuere mauris pellentesque at. Curabitur aliquet iaculis efficitur. Nullam velit arcu, suscipit et eros vel, tempus efficitur magna. Morbi lobortis, diam id tempus sodales, nibh tellus cursus nibh, non cursus lacus arcu dignissim tortor.

Aliquam porta nisi quis ipsum placerat elementum. Nulla sed scelerisque tortor, quis porttitor mauris. Vivamus sollicitudin scelerisque lacus, ac pellentesque nisi porta non. Morbi ut tempus libero. Curabitur tristique risus non lorem convallis tincidunt. Vivamus molestie, dolor vel pellentesque gravida, neque velit varius justo, ac aliquet quam turpis ac velit. Nulla scelerisque urna a nunc vestibulum elementum. Duis consectetur vitae risus eget hendrerit. Cras pulvinar purus risus, nec finibus risus facilisis at. Aenean fermentum eleifend neque in posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam lobortis justo ultrices lectus pharetra posuere vitae vitae quam. Praesent sodales ipsum nec vehicula mollis. Maecenas in euismod mi.

Nullam bibendum ipsum nec felis cursus finibus. Ut suscipit mollis mi, in suscipit arcu rhoncus eget. Vestibulum dapibus lacus sed eros mattis bibendum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus eleifend ligula sem, et placerat risus consectetur eu. Suspendisse rutrum leo varius ipsum aliquam aliquet. Suspendisse ut aliquet neque. Cras semper tellus ac tellus lacinia commodo. Donec at scelerisque sem.

Nunc dapibus laoreet quam vitae laoreet. Mauris eu vehicula felis, nec egestas odio. Vestibulum sit amet nulla nisi. Nullam pharetra massa vel mollis fermentum. Integer eu est accumsan, egestas tortor in, tristique eros. Vestibulum non libero dictum, convallis ipsum vel, commodo est. Cras vulputate quam non eros placerat, ut auctor lectus volutpat. Aliquam erat volutpat. Pellentesque at augue bibendum, ullamcorper turpis non, imperdiet metus. Sed ac mi lacus. Integer vitae fermentum nisl.
Nunc dapibus laoreet quam vitae laoreet. Mauris eu vehicula felis, nec egestas odio. Vestibulum sit amet nulla nisi. Nullam pharetra massa vel mollis fermentum. Integer eu est accumsan, egestas tortor in, tristique eros. Vestibulum non libero dictum, convallis ipsum vel, commodo est. Cras vulputate quam non eros placerat, ut auctor lectus volutpat. Aliquam erat volutpat. Pellentesque at augue bibendum, ullamcorper turpis non, imperdiet metus. Sed ac mi lacus. Integer vitae fermentum nisl.`;
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
        visible: true,
        severity: 'default',
        iconVisible: true,
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
