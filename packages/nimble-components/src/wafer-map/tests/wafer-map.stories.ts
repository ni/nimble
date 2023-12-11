import { html } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { generateWaferData } from './data-generator';
import {
    goodValueGenerator,
    badValueGenerator,
    highlightedValueGenerator
} from './value-generator';
import type {
    WaferMapDie,
    WaferMapColorScale,
    WaferMapValidity
} from '../types';
import {
    WaferMapOriginLocation,
    WaferMapOrientation,
    WaferMapColorScaleMode
} from '../types';
import {
    highlightedTagsSets,
    wafermapDieSets,
    waferMapColorScaleSets
} from './sets';
import { waferMapTag } from '..';

interface WaferMapArgs {
    colorScale: WaferMapColorScale;
    colorScaleMode: WaferMapColorScaleMode;
    dieLabelsHidden: boolean;
    dieLabelsSuffix: string;
    dies: string;
    maxCharacters: number;
    orientation: WaferMapOrientation;
    originLocation: WaferMapOriginLocation;
    gridMinX: number | undefined;
    gridMaxX: number | undefined;
    gridMinY: number | undefined;
    gridMaxY: number | undefined;
    dieHover: unknown;
    validity: WaferMapValidity;
    highlightedTags: string;
}

const getDiesSet = (
    setName: string,
    sets: WaferMapDie[][]
): WaferMapDie[] | undefined => {
    const seed = 0.5;
    let returnedValue: WaferMapDie[];
    switch (setName) {
        case 'fixedDies10':
            returnedValue = sets[0]!;
            break;
        case 'goodDies100':
            returnedValue = generateWaferData(
                100,
                goodValueGenerator(seed),
                highlightedValueGenerator(seed)
            );
            break;
        case 'goodDies1000':
            returnedValue = generateWaferData(
                1000,
                goodValueGenerator(seed),
                highlightedValueGenerator(seed)
            )!;
            break;
        case 'badDies10000':
            returnedValue = generateWaferData(
                10000,
                badValueGenerator(seed),
                highlightedValueGenerator(seed)
            )!;
            break;
        default:
            returnedValue = [] as WaferMapDie[];
    }
    return returnedValue;
};

const getHighlightedTags = (
    setName: string,
    sets: string[][]
): string[] => {
    let returnedValue: string[];
    switch (setName) {
        case 'set1':
            returnedValue = sets[0]!;
            break;
        case 'set2':
            returnedValue = sets[1]!;
            break;
        case 'set3':
            returnedValue = sets[2]!;
            break;
        case 'set4':
            returnedValue = sets[3]!;
            break;
        default:
            returnedValue = [] as string[];
            break;
    }
    return returnedValue;
};

const metadata: Meta<WaferMapArgs> = {
    title: 'Incubating/Wafer Map',
    tags: ['autodocs'],
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component:
                    'A wafer map is a component for visualizing data from the manufacture of semiconductor wafers. Each die on the wafer can show numerical information and be colored to indicate information about that die.'
            }
        },
        actions: {
            handles: ['click', 'die-hover']
        }
    },
    render: createUserSelectedThemeStory(html`
        ${incubatingWarning({
        componentName: 'wafer map',
        statusLink: 'https://github.com/ni/nimble/issues/924'
    })}
        <${waferMapTag} id="wafer-map" colors-scale-mode="${x => x.colorScaleMode}"
            ?die-labels-hidden="${x => x.dieLabelsHidden}" die-labels-suffix="${x => x.dieLabelsSuffix}"
            max-characters="${x => x.maxCharacters}" orientation="${x => x.orientation}"
            origin-location="${x => x.originLocation}" grid-min-x=${x => x.gridMinX}
            grid-max-x=${x => x.gridMaxX}
            grid-min-y=${x => x.gridMinY}
            grid-max-y=${x => x.gridMaxY}
            :colorScale="${x => x.colorScale}"
            :dies="${x => getDiesSet(x.dies, wafermapDieSets)}"
            :highlightedTags="${x => getHighlightedTags(
        x.highlightedTags,
        highlightedTagsSets
    )}"
            >
        </${waferMapTag}>
        <style class="code-hide">
            #wafer-map {
                resize: both;
                overflow: hidden;
            }
        </style>
    `),
    args: {
        colorScale: waferMapColorScaleSets[0],
        colorScaleMode: WaferMapColorScaleMode.linear,
        dies: 'fixedDies10',
        dieLabelsHidden: false,
        dieLabelsSuffix: '',
        highlightedTags: 'set1',
        maxCharacters: 4,
        orientation: WaferMapOrientation.left,
        originLocation: WaferMapOriginLocation.bottomLeft,
        gridMinX: undefined,
        gridMaxX: undefined,
        gridMinY: undefined,
        gridMaxY: undefined
    },
    argTypes: {
        colorScale: {
            description: `Represents the color spectrum which shows the status of the dies on the wafer.

<details>
    <summary>Usage details</summary>
    The \`colorScale\` element is a public property. As such, it is not available as an attribute, however it can be read or set on the corresponding \`WaferMap\` DOM element.
</details>
                `,
            options: ['set1'],
            control: {
                type: 'radio',
                labels: {
                    set1: 'Scale 1'
                }
            },
            defaultValue: 'set1',
            mapping: {
                set1: waferMapColorScaleSets[0]
            }
        },
        colorScaleMode: {
            name: 'color-scale-mode',
            description:
                'Enum value that determines if the color scale represents continuous gradient values (linear), or is set categorically (ordinal).',
            options: Object.values(WaferMapColorScaleMode),
            control: {
                type: 'radio',
                labels: {
                    [WaferMapColorScaleMode.linear]: 'Linear',
                    [WaferMapColorScaleMode.ordinal]: 'Ordinal'
                }
            }
        },
        dies: {
            description: `Represents the input data, an array of \`WaferMapDie\`, which will be rendered by the wafer map

<details>
    <summary>Usage details</summary>
    The \`dies\` element is a public property. As such, it is not available as an attribute, however it can be read or set on the corresponding \`WaferMap\` DOM element.
</details>
                `,
            options: [
                'fixedDies10',
                'goodDies100',
                'goodDies1000',
                'badDies10000'
            ],
            control: {
                type: 'radio',
                labels: {
                    fixedDies10: 'Small dies set of fixed values',
                    goodDies100: 'Medium dies set of mostly good values',
                    goodDies1000: 'Large dies set of mostly good values',
                    badDies10000: 'Very large dies set of mostly bad values'
                }
            },
            defaultValue: 'set1'
        },
        dieLabelsHidden: {
            name: 'die-labels-hidden',
            description:
                'Boolean value that determines if the dies labels in the wafer map view are shown or not. Default value is false.',
            control: { type: 'boolean' }
        },
        dieLabelsSuffix: {
            name: 'die-labels-suffix',
            description:
                'String that can be added as a label at the end of each wafer map die value',
            control: { type: 'text' }
        },
        highlightedTags: {
            description: `Represent a list of strings that will be highlighted in the wafer map view. Each die has a tags?: string[] property, if at least one element of highlightedTags equals at least one element of die.tags the die will be highlighted.

<details>
    <summary>Usage details</summary>
    The \`highlightedTags\` element is a public property. As such, it is not available as an attribute, however it can be read or set on the corresponding \`WaferMap\` DOM element.
</details>
                `,
            options: ['set1', 'set2', 'set3', 'set4'],
            control: {
                type: 'radio',
                labels: {
                    set1: 'No die is highlighted',
                    set2: 'A few dies are highlighted',
                    set3: 'All dies are faded',
                    set4: 'Many dies are highlighted'
                }
            },
            defaultValue: 'set1'
        },
        maxCharacters: {
            name: 'max-characters',
            description:
                'Represents the number of characters allowed to be displayed within a single die. As the die values are represented by Floating point numbers, we must have the liberty of limiting how many characters we are willing to display within a single die.',
            control: { type: 'number' }
        },
        orientation: {
            description: 'Notch orientation',
            options: Object.values(WaferMapOrientation),
            control: {
                type: 'radio',
                labels: {
                    [WaferMapOrientation.left]: 'left',
                    [WaferMapOrientation.top]: 'top',
                    [WaferMapOrientation.right]: 'right',
                    [WaferMapOrientation.bottom]: 'bottom'
                }
            }
        },
        originLocation: {
            name: 'origin-location',
            description:
                'Represents the starting point and the direction of the two axes, X and Y, which are used for displaying the die grid on the wafer map canvas.',
            options: Object.values(WaferMapOriginLocation),
            control: {
                type: 'radio',
                labels: {
                    [WaferMapOriginLocation.bottomLeft]: 'bottom-left',
                    [WaferMapOriginLocation.bottomRight]: 'bottom-right',
                    [WaferMapOriginLocation.topLeft]: 'top-left',
                    [WaferMapOriginLocation.topRight]: 'top-right'
                }
            }
        },
        gridMinX: {
            name: 'grid-min-x',
            description:
                'Represents the X coordinate of the minimum corner of the the grid bounding box for rendering the wafer map. Leaving the value `undefined` will set the value to the minimum X value of the bounding box of the input dies coordinates.',
            control: { type: 'number' }
        },
        gridMaxX: {
            name: 'grid-max-x',
            description:
                'Represents the X coordinate of the maximum corner of the the grid bounding box for rendering the wafer map. Leaving the value `undefined` will set the value to the maximum X value of the bounding box of the input dies coordinates.',
            control: { type: 'number' }
        },
        gridMinY: {
            name: 'grid-min-y',
            description:
                'Represents the Y coordinate of the minimum corner of the the grid bounding box for rendering the wafer map. Leaving the value `undefined` will set the value to the minimum Y value of the bounding box of the input dies coordinates.',
            control: { type: 'number' }
        },
        gridMaxY: {
            name: 'grid-max-y',
            description:
                'Represents the Y coordinate of the maximum corner of the the grid bounding box for rendering the wafer map. Leaving the value `undefined` will set the value to the maximum Y value of the bounding box of the input dies coordinates.',
            control: { type: 'number' }
        },
        dieHover: {
            name: 'die-hover',
            description:
                'The event is fired whenever the mouse enters or leaves a die. In the event data, `detail.currentDie` will be set to the `WaferMapDie` element of the `dies` array that is being hovered or `undefined` if the mouse is leaving a die.'
        },
        validity: {
            description: `Readonly object of boolean values that represents the validity states that the wafer map's configuration can be in.
The object's type is \`WaferMapValidity\`, and it contains the following boolean properties:

-   \`invalidGridDimensions \`: \`true\` when some of the \`gridMinX\`, \`gridMinY\`, \`gridMaxX\` or \`gridMaxY\` are \`undefined\`, but \`false\` when all of them are provided or all of them are \`undefined\``,
            control: false
        }
    }
};

export default metadata;

export const waferMap: StoryObj<WaferMapArgs> = {};
