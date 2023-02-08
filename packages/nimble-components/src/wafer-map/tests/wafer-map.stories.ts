import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { bodyFont } from '../../theme-provider/design-tokens';

import '../../all-components';
import { generateWaferData } from './data-generator';
import { goodValueGenerator, badValueGenerator } from './value-generator';
import type { WaferMapDie, WaferMapColorScale } from '../types';
import {
    WaferMapQuadrant,
    WaferMapOrientation,
    WaferMapColorScaleMode
} from '../types';
import {
    highLightedValueSets,
    wafermapDieSets,
    waferMapColorScaleSets
} from './sets';

interface WaferMapArgs {
    colorScale: WaferMapColorScale;
    colorScaleMode: WaferMapColorScaleMode;
    dieLabelsHidden: boolean;
    dieLabelsSuffix: string;
    dies: string;
    highlightedValues: string;
    maxCharacters: number;
    orientation: WaferMapOrientation;
    quadrant: WaferMapQuadrant;
}

const getDiesSet = (
    setName: string,
    _sets: WaferMapDie[][]
): WaferMapDie[] | undefined => {
    const seed = 0.5;
    let returnedValue: WaferMapDie[];
    switch (setName) {
        case 'randomDies10':
            returnedValue = generateWaferData(10);
            break;
        case 'randomDies100':
            returnedValue = generateWaferData(100);
            break;
        case 'goodDies1000':
            returnedValue = generateWaferData(1000, goodValueGenerator(seed))!;
            break;
        case 'badDies10000':
            returnedValue = generateWaferData(10000, badValueGenerator(seed))!;
            break;
        default:
            returnedValue = [] as WaferMapDie[];
    }
    return returnedValue;
};

const getHighLightedValueSets = (
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
    title: 'WaferMap',
    parameters: {
        docs: {
            description: {
                component:
                    'A wafer map is a component for visualizing data from the manufacture of semiconductor wafers. Each die on the wafer can show numerical information and be colored to indicate information about that die.'
            }
        },
        actions: {
            handles: ['click', 'die-selected']
        }
    },
    render: createUserSelectedThemeStory(html`
        <div id="usage-warning">
            WARNING - The wafermap is still in development and considered
            experimental. It is not recommended for application use.
        </div>
        <nimble-wafer-map
            id="wafer-map"
            colors-scale-mode="${x => x.colorScaleMode}"
            ?die-labels-hidden="${x => x.dieLabelsHidden}"
            die-labels-suffix="${x => x.dieLabelsSuffix}"
            max-characters="${x => x.maxCharacters}"
            orientation="${x => x.orientation}"
            quadrant="${x => x.quadrant}"
            :colorScale="${x => x.colorScale}"
            :dies="${x => getDiesSet(x.dies, wafermapDieSets)}"
            :highlightedValues="${x => getHighLightedValueSets(
        x.highlightedValues,
        highLightedValueSets
    )}"
        >
        </nimble-wafer-map>
        <style class="code-hide">
            #usage-warning {
                color: red;
                font: var(${bodyFont.cssCustomProperty});
            }
            #wafer-map {
                width: 100%;
                height: 500px;
            }
        </style>
    `),
    args: {
        colorScale: waferMapColorScaleSets[0],
        colorScaleMode: WaferMapColorScaleMode.linear,
        dies: 'randomDies100',
        dieLabelsHidden: false,
        dieLabelsSuffix: '',
        highlightedValues: 'set1',
        maxCharacters: 4,
        orientation: WaferMapOrientation.left,
        quadrant: WaferMapQuadrant.bottomLeft
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
            description: `Represents the input data, an array of \`WaferMapDie\`, which will be renedered by the wafer map
                <details>
                    <summary>Usage details</summary>
                    The \`dies\` element is a public property. As such, it is not available as an attribute, however it can be read or set on the corresponding \`WaferMap\` DOM element.
                </details>
                `,
            options: [
                'randomDies10',
                'randomDies100',
                'goodDies1000',
                'badDies10000'
            ],
            control: {
                type: 'radio',
                labels: {
                    randomDies10: 'Small dies set of random values',
                    randomDies100: 'Medium dies set of random values',
                    goodDies1000: 'Large dies set of mostly good values',
                    badDies10000: 'Very Large dies set of mostly bad values'
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
        highlightedValues: {
            description: `Represents an array of die indexes that will be highlighted in the wafer map view
                <details>
                    <summary>Usage details</summary>
                    The \`highlightedValues\` element is a public property. As such, it is not available as an attribute, however it can be read or set on the corresponding \`WaferMap\` DOM element.
                </details>
                `,
            options: ['set1', 'set2', 'set3', 'set4'],
            control: {
                type: 'radio',
                labels: {
                    set1: 'Set 1',
                    set2: 'Set 2',
                    set3: 'Set 3',
                    set4: 'Set 4'
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
        quadrant: {
            description:
                'Represents the orientation of the dies on the wafer map',
            options: Object.values(WaferMapQuadrant),
            control: {
                type: 'radio',
                labels: {
                    [WaferMapQuadrant.bottomLeft]: 'bottom-left',
                    [WaferMapQuadrant.bottomRight]: 'bottom-right',
                    [WaferMapQuadrant.topLeft]: 'top-left',
                    [WaferMapQuadrant.topRight]: 'top-right'
                }
            }
        }
    }
};

export default metadata;

export const waferMap: StoryObj<WaferMapArgs> = {};
