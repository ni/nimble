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
    colorScale: WaferMapColorsScale;
    colorsScaleMode: WaferMapColorsScaleMode;
    dieLabelsHidden: boolean;
    dieLabelsSuffix: string;
    dies: WaferMapDie[];
    highlightedValues: number[];
    maxCharacters: number;
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
            colorsScaleMode="${x => x.colorsScaleMode}"
            dieLabelsHidden="${x => x.dieLabelsHidden}"
            dieLabelsSuffix="${x => x.dieLabelsSuffix}"
            maxCharacters="${x => x.maxCharacters}"
            orientation="${x => x.orientation}"
            quadrant="${x => x.quadrant}"
            :colorScale="${x => x.colorScale}"
            :dies=${x => x.dies}
            :highlightedValues="${x => x.highlightedValues}"
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
        dies: wafermapDieSets[0],
        quadrant: WaferMapQuadrant.bottomLeft,
        orientation: WaferMapOrientation.left,
        colorScale: waferMapColorsScaleSets[0],
        maxCharacters: 4,
        dieLabelsHidden: false,
        dieLabelsSuffix: '',
        colorsScaleMode: WaferMapColorsScaleMode.linear,
        highlightedValues: highLightedValueSets[0]
    },
    argTypes: {
        dies: {
            description:
                'Represents the input data, an array of `WaferMapDie`, which will be renedered by the wafer map',
            options: ['set1', 'set2'],
            control: {
                type: 'select',
                labels: {
                    set1: 'Dies Set 1',
                    set2: 'Dies Set 2'
                }
            },
            defaultValue: 'set1',
            mapping: {
                set1: wafermapDieSets[0],
                set2: wafermapDieSets[1]
            }
        },
        quadrant: {
            description:
                'Represents the orientation of the dies on the wafer map',
            options: Object.values(WaferMapQuadrant),
            control: {
                type: 'select',
                labels: {
                    [WaferMapQuadrant.bottomLeft]: 'BottomLeft',
                    [WaferMapQuadrant.bottomRight]: 'BottomRight',
                    [WaferMapQuadrant.topLeft]: 'TopLeft',
                    [WaferMapQuadrant.topRight]: 'TopRight'
                }
            }
        },
        orientation: {
            description: 'Notch orientation',
            options: Object.values(WaferMapOrientation),
            control: {
                type: 'select',
                labels: {
                    [WaferMapOrientation.left]: 'Left',
                    [WaferMapOrientation.top]: 'Top',
                    [WaferMapOrientation.right]: 'Right',
                    [WaferMapOrientation.bottom]: 'Bottom'
                }
            }
        },
        maxCharacters: {
            description:
                'Represents the number of characters allowed to be displayed within a single die. As the die values are represented by Floating point numbers, we must have the liberty of limiting how many characters we are willing to display within a single die.',
            control: { type: 'number' }
        },
        dieLabelsHidden: {
            description:
                'Boolean value that determines if the dies labels in the wafer map view are shown or not. Default value is false.',
            control: { type: 'boolean' }
        },
        dieLabelsSuffix: {
            description:
                'String that can be added as a label at the end of each wafer map die value',
            control: { type: 'string' }
        },
        colorsScaleMode: {
            description:
                'Enum value that determines if the color scale represents continuous gradient values (linear), or is set categorically (ordinal).',
            options: Object.values(WaferMapColorsScaleMode),
            control: {
                type: 'select',
                labels: {
                    [WaferMapColorsScaleMode.linear]: 'Linear',
                    [WaferMapColorsScaleMode.ordinal]: 'Ordinal'
                }
            }
        },
        highlightedValues: {
            description:
                'Represents an array of die indexes that will be highlighted in the wafer map view',
            options: ['set1', 'set2', 'set3', 'set4'],
            control: {
                type: 'select',
                labels: {
                    set1: 'Highlighted Values Set 1',
                    set2: 'Highlighted Values Set 2',
                    set3: 'Highlighted Values Set 3',
                    set4: 'Highlighted Values Set 4'
                }
            },
            defaultValue: 'set1',
            mapping: {
                set1: highLightedValueSets[0],
                set2: highLightedValueSets[1],
                set3: highLightedValueSets[2],
                set4: highLightedValueSets[3]
            }
        },
        colorScale: {
            description:
                'Represents the color spectrum which shows the status of the dies on the wafer.',
            options: ['set1'],
            control: {
                type: 'select',
                labels: {
                    set1: 'Color Scale 1'
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
