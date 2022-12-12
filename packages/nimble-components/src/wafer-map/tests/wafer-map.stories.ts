import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { bodyFont } from '../../theme-provider/design-tokens';

import '../../all-components';
import type { WaferMapDie, WaferMapColorsScale } from '../types';
import {
    WaferMapQuadrant,
    WaferMapOrientation,
    WaferMapColorsScaleMode
} from '../types';
import {
    highLightedValueSets,
    wafermapDieSets,
    waferMapColorsScaleSets
} from './sets';

interface WaferMapArgs {
    colorsScale: WaferMapColorsScale;
    colorsScaleMode: WaferMapColorsScaleMode;
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
    sets: WaferMapDie[][]
): WaferMapDie[] | undefined => {
    let returnedValue: WaferMapDie[];
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
            returnedValue = [] as WaferMapDie[];
            break;
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
        }
    },
    render: createUserSelectedThemeStory(html`
        <div id="usage-warning">
            WARNING - The wafermap is still in development and considered
            experimental. It is not recommended for application use.
        </div>
        <nimble-wafer-map
            colors-scale-mode="${x => x.colorsScaleMode}"
            ?die-labels-hidden="${x => x.dieLabelsHidden}"
            die-labels-suffix="${x => x.dieLabelsSuffix}"
            max-characters="${x => x.maxCharacters}"
            orientation="${x => x.orientation}"
            quadrant="${x => x.quadrant}"
            :colorScale="${x => x.colorsScale}"
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
        </style>
    `),
    args: {
        colorsScale: waferMapColorsScaleSets[0],
        colorsScaleMode: WaferMapColorsScaleMode.linear,
        dies: 'set1',
        dieLabelsHidden: false,
        dieLabelsSuffix: '',
        highlightedValues: 'set1',
        maxCharacters: 4,
        orientation: WaferMapOrientation.left,
        quadrant: WaferMapQuadrant.bottomLeft
    },
    argTypes: {
        colorsScale: {
            description: `Represents the color spectrum which shows the status of the dies on the wafer.
                <details>
                    <summary>Usage details</summary>
                    The \`colorsScale\` element is a public property. As such, it is not available as an attribute, however it can be read or set on the corresponding \`WaferMap\` DOM element.
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
                set1: waferMapColorsScaleSets[0]
            }
        },
        colorsScaleMode: {
            name: 'color-scale-mode',
            description:
                'Enum value that determines if the color scale represents continuous gradient values (linear), or is set categorically (ordinal).',
            options: Object.values(WaferMapColorsScaleMode),
            control: {
                type: 'radio',
                labels: {
                    [WaferMapColorsScaleMode.linear]: 'Linear',
                    [WaferMapColorsScaleMode.ordinal]: 'Ordinal'
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
            options: ['set1', 'set2'],
            control: {
                type: 'radio',
                labels: {
                    set1: 'Set 1',
                    set2: 'Set 2'
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