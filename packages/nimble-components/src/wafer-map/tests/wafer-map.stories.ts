import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import type {WaferMapColorsScaleMode, 
            WaferMapDie, 
            WaferMapColorsScale} from '../types';
import {WaferMapQuadrant, WaferMapOrientation} from '../types';           

interface WafermapArgs {
    quadrant: WaferMapQuadrant;
    orientation: WaferMapOrientation;
    maxCharacters: number;
    dieLabelsHidden:boolean;
    dieLabelsSuffix:string;
    colorsScaleMode: WaferMapColorsScaleMode;
    highlightedValues:  number[];
    dies: WaferMapDie[];
    colorScale: WaferMapColorsScale;
    name: string;
}

const metadata: Meta<WafermapArgs> = {
    title: 'Wafermap',
    parameters: {
        docs: {
            description: {
                component:
                    'A Wafermap description'
            }
        },
        actions: {
            handles: ['click']
        }
    },
    render: createUserSelectedThemeStory(html`
        <nimble-wafer-map>
        </nimble-wafer-map>
    `),
    args: {
        quadrant: WaferMapQuadrant.bottomLeft,
        orientation: WaferMapOrientation.left
    },
    argTypes: {
        name: {
            description:
                'A wafer map identifies the locations of defective integrated circuits (chips) on a silicon wafer and provides important spatial information.'
        },
        quadrant:{
            description:
                'Wafermap axis origin position',
            options: Object.values(WaferMapQuadrant),
            control:{
                type: 'radio',
                labels:{
                    [WaferMapQuadrant.bottomLeft]:'BottomLeft',
                    [WaferMapQuadrant.bottomRight]:'BottomRight',
                    [WaferMapQuadrant.topLeft]:'TopLeft',
                    [WaferMapQuadrant.topRight]:'TopRight'
                }
            }
        },
        orientation:{
            description:'Notch orientation',
            options: Object.values(WaferMapOrientation),
            control:{
                type:'radio',
                labels:{
                    [WaferMapOrientation.left]:'Left',
                    [WaferMapOrientation.top]:'Top',
                    [WaferMapOrientation.right]:'Right',
                    [WaferMapOrientation.bottom]:'Bottom',
                }
            }
        }
    }
};

export default metadata;

export const waferMap: StoryObj<WafermapArgs> = {};
