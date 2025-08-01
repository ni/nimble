import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import type { Table } from 'apache-arrow';
import { waferMapTag } from '@ni/nimble-components/dist/esm/wafer-map';
import type {
    WaferMapDie,
    WaferMapColorScale,
    WaferMapValidity
} from '@ni/nimble-components/dist/esm/wafer-map/types';
import {
    WaferMapOriginLocation,
    WaferMapOrientation,
    WaferMapColorScaleMode
} from '@ni/nimble-components/dist/esm/wafer-map/types';
import {
    generateWaferData,
    generateWaferTableData
} from '@ni/nimble-components/dist/esm/wafer-map/tests/data-generator';
import {
    goodValueGenerator,
    badValueGenerator,
    highlightedValueGenerator
} from '@ni/nimble-components/dist/esm/wafer-map/tests/value-generator';
import {
    highlightedTagsSets,
    wafermapDieSets,
    waferMapColorScaleSets,
    wafermapDiesTableSets
} from './sets';
import {
    apiCategory,
    checkValidityDescription,
    createUserSelectedThemeStory,
    incubatingWarning,
    validityDescription
} from '../../utilities/storybook';

interface WaferMapArgs {
    colorScale: WaferMapColorScale;
    colorScaleMode: WaferMapColorScaleMode;
    dieLabelsHidden: boolean;
    dieLabelsSuffix: string;
    apiVersion: 'stable' | 'experimental';
    dies: string;
    highlightedTags: string;
    diesTable: string;
    maxCharacters: number;
    orientation: WaferMapOrientation;
    originLocation: WaferMapOriginLocation;
    gridMinX: number | undefined;
    gridMaxX: number | undefined;
    gridMinY: number | undefined;
    gridMaxY: number | undefined;
    dieHover: unknown;
    validity: WaferMapValidity;
    checkValidity: undefined;
    setData: undefined;
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
            returnedValue = [];
    }
    return returnedValue;
};

const getDiesTableSet = (setName: string, sets: Table[]): Table | undefined => {
    const seed = 0.5;
    let returnedValue: Table | undefined;
    switch (setName) {
        case 'fixedDies10':
            returnedValue = sets[0]!;
            break;
        case 'goodDies100':
            returnedValue = generateWaferTableData(
                100,
                goodValueGenerator(seed)
            );
            break;
        case 'goodDies1000':
            returnedValue = generateWaferTableData(
                1000,
                goodValueGenerator(seed)
            )!;
            break;
        case 'badDies10000':
            returnedValue = generateWaferTableData(
                10000,
                badValueGenerator(seed)
            )!;
            break;
        default:
            returnedValue = undefined;
    }
    return returnedValue;
};

const getHighlightedTags = (setName: string, sets: string[][]): string[] => {
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
            returnedValue = [];
            break;
    }
    return returnedValue;
};

const metadata: Meta<WaferMapArgs> = {
    title: 'Incubating/Wafer Map',
    parameters: {
        viewMode: 'docs',
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
            :highlightedTags="${x => getHighlightedTags(x.highlightedTags, highlightedTagsSets)}"
            :diesTable="${x => getDiesTableSet(x.diesTable, wafermapDiesTableSets)}"
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
        apiVersion: 'stable',
        colorScale: waferMapColorScaleSets[0],
        colorScaleMode: WaferMapColorScaleMode.linear,
        dies: 'fixedDies10',
        diesTable: undefined,
        highlightedTags: 'set1',
        dieLabelsHidden: false,
        dieLabelsSuffix: '',
        maxCharacters: 4,
        orientation: WaferMapOrientation.left,
        originLocation: WaferMapOriginLocation.bottomLeft,
        gridMinX: undefined,
        gridMaxX: undefined,
        gridMinY: undefined,
        gridMaxY: undefined
    },
    argTypes: {
        apiVersion: {
            name: 'API Version',
            description:
                'Select the API version of the component. The stable version is the one that is recommended for production use, while the experimental version is the one that is still under development and is not recommended for production use. The default value is `stable`. To enable the Experimental API in code, the `diesTable` should be used in place of the `dies`.',
            options: ['stable', 'experimental'],
            control: {
                type: 'inline-radio',
                labels: {
                    stable: 'Stable',
                    experimental: 'Experimental'
                }
            },
            defaultValue: 'stable'
        },
        colorScale: {
            description:
                'Represents the color spectrum which shows the status of the dies on the wafer.',
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
            },
            table: { category: apiCategory.nonAttributeProperties }
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
            },
            table: { category: apiCategory.attributes }
        },
        dies: {
            description:
                'Represents the input data, an array of `WaferMapDie`, which will be rendered by the wafer map. Part of the Stable API.',
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
            defaultValue: 'fixedDies10',
            if: { arg: 'apiVersion', eq: 'stable' },
            table: { category: apiCategory.nonAttributeProperties }
        },
        diesTable: {
            description:
                'Represents the input data, an apache-arrow `Table`, which will be rendered by the wafer map. Part of the Experimental API.',
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
            defaultValue: 'fixedDies10',
            if: { arg: 'apiVersion', eq: 'experimental' },
            table: { category: apiCategory.nonAttributeProperties }
        },
        highlightedTags: {
            description:
                'Represent a list of strings that will be highlighted in the wafer map view. Each die has a tags?: string[] property, if at least one element of highlightedTags equals at least one element of die.tags the die will be highlighted.',
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
            defaultValue: 'set1',
            table: { category: apiCategory.nonAttributeProperties }
        },
        dieLabelsHidden: {
            name: 'die-labels-hidden',
            description:
                'Boolean value that determines if the dies labels in the wafer map view are shown or not. Default value is false.',
            control: { type: 'boolean' },
            table: { category: apiCategory.attributes }
        },
        dieLabelsSuffix: {
            name: 'die-labels-suffix',
            description:
                'String that can be added as a label at the end of each wafer map die value',
            control: { type: 'text' },
            table: { category: apiCategory.attributes }
        },
        maxCharacters: {
            name: 'max-characters',
            description:
                'Represents the number of characters allowed to be displayed within a single die. As the die values are represented by Floating point numbers, we must have the liberty of limiting how many characters we are willing to display within a single die.',
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
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
            },
            table: { category: apiCategory.attributes }
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
            },
            table: { category: apiCategory.attributes }
        },
        gridMinX: {
            name: 'grid-min-x',
            description:
                'Represents the X coordinate of the minimum corner of the the grid bounding box for rendering the wafer map. Leaving the value `undefined` will set the value to the minimum X value of the bounding box of the input dies coordinates.',
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        gridMaxX: {
            name: 'grid-max-x',
            description:
                'Represents the X coordinate of the maximum corner of the the grid bounding box for rendering the wafer map. Leaving the value `undefined` will set the value to the maximum X value of the bounding box of the input dies coordinates.',
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        gridMinY: {
            name: 'grid-min-y',
            description:
                'Represents the Y coordinate of the minimum corner of the the grid bounding box for rendering the wafer map. Leaving the value `undefined` will set the value to the minimum Y value of the bounding box of the input dies coordinates.',
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        gridMaxY: {
            name: 'grid-max-y',
            description:
                'Represents the Y coordinate of the maximum corner of the the grid bounding box for rendering the wafer map. Leaving the value `undefined` will set the value to the maximum Y value of the bounding box of the input dies coordinates.',
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        dieHover: {
            name: 'die-hover',
            description:
                'Event emitted whenever the mouse enters or leaves a die. In the event data, `detail.currentDie` will be set to the `WaferMapDie` element of the `dies` array that is being hovered or `undefined` if the mouse is leaving a die.',
            table: { category: apiCategory.events }
        },
        validity: {
            description: validityDescription({
                colloquialName: 'wafer map',
                validityObjectType: 'WaferMapValidity',
                validityFlags: [
                    {
                        flagName: 'invalidGridDimensions',
                        description:
                            '`true` when some of the `gridMinX`, `gridMinY`, `gridMaxX` or `gridMaxY` are `undefined`, but `false` when all of them are provided or all of them are `undefined`'
                    },
                    {
                        flagName: 'invalidDiesTableSchema',
                        description:
                            '`true` when the `diesTable` does not have all of the three expected columns: `colIndex`, `rowIndex` and `value`, but `false` when all of them are provided or the `diesTable` is `undefined`'
                    }
                ]
            }),
            control: false,
            table: { category: apiCategory.nonAttributeProperties }
        },
        checkValidity: {
            name: 'checkValidity()',
            description: checkValidityDescription({
                componentName: 'wafer map'
            }),
            control: false,
            table: { category: apiCategory.methods }
        },
        setData: {
            name: 'setData(data)',
            description:
                'Used to set data to the wafer map. Part of the Experimental API. The `data` parameter is an apache-arrow `Table`.',
            control: false,
            table: { category: apiCategory.methods }
        }
    }
};

export default metadata;

export const waferMap: StoryObj<WaferMapArgs> = {};
