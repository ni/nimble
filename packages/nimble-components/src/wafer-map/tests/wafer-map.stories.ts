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
    colorscale: WaferMapColorsScale;
    colorscalemode: WaferMapColorsScaleMode;
    dielabelshidden: boolean;
    dielabelsuffix: string;
    dies: string;
    highlightedvalues: string;
    maxcharacters: number;
    orientation: WaferMapOrientation;
    quadrant: WaferMapQuadrant;
}

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
            colorsScaleMode="${x => x.colorscalemode}"
            dieLabelsHidden="${x => x.dielabelshidden}"
            dieLabelsSuffix="${x => x.dielabelsuffix}"
            maxCharacters="${x => x.maxcharacters}"
            orientation="${x => x.orientation}"
            quadrant="${x => x.quadrant}"
            :colorScale="${x => x.colorscale}"
            :dies=${x => {
        let returnedValue: WaferMapDie[] | undefined;
        switch (x.dies) {
            case 'set1':
                returnedValue = wafermapDieSets[0];
                break;
            case 'set2':
                returnedValue = wafermapDieSets[1];
                break;
            case 'set3':
                returnedValue = wafermapDieSets[2];
                break;
            case 'set4':
                returnedValue = wafermapDieSets[2];
                break;
            default:
                returnedValue = undefined;
                break;
        }
        return returnedValue;
    }}
            :highlightedValues="${x => {
        let returnedValue: number[] | undefined;
        switch (x.dies) {
            case 'set1':
                returnedValue = highLightedValueSets[0];
                break;
            case 'set2':
                returnedValue = highLightedValueSets[0];
                break;
            default:
                returnedValue = undefined;
                break;
        }
        return returnedValue;
    }}"
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
        dies: 'set1',
        quadrant: WaferMapQuadrant.bottomLeft,
        orientation: WaferMapOrientation.left,
        colorscale: waferMapColorsScaleSets[0],
        maxcharacters: 4,
        dielabelshidden: false,
        dielabelsuffix: '',
        colorscalemode: WaferMapColorsScaleMode.linear,
        highlightedvalues: 'set1'
    },
    argTypes: {
        dies: {
            description:
                'Represents the input data, an array of `WaferMapDie`, which will be renedered by the wafer map',
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
        maxcharacters: {
            description:
                'Represents the number of characters allowed to be displayed within a single die. As the die values are represented by Floating point numbers, we must have the liberty of limiting how many characters we are willing to display within a single die.',
            control: { type: 'number' }
        },
        dielabelshidden: {
            description:
                'Boolean value that determines if the dies labels in the wafer map view are shown or not. Default value is false.',
            control: { type: 'boolean' }
        },
        dielabelsuffix: {
            description:
                'String that can be added as a label at the end of each wafer map die value',
            control: { type: 'string' }
        },
        colorscalemode: {
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
        highlightedvalues: {
            description:
                'Represents an array of die indexes that will be highlighted in the wafer map view',
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
        colorscale: {
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
                set1: waferMapColorsScaleSets[0]
            }
        }
    }
};

export default metadata;

export const waferMap: StoryObj<WaferMapArgs> = {};
