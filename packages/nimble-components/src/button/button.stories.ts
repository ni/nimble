import './index';
import { withXD } from 'storybook-addon-xd-designs';
import { ButtonAppearance } from './types';

export default {
    title: 'Button',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
        'https://xd.adobe.com/view/6fdbdacb-b624-4d2c-950e-a58f3fd7ebac-3a88/screen/aeff5951-0982-4f82-a471-a9e5a0675a63/specs'
        }
    }
};

const buttonTemplate = `
    <nimble-button>Button</nimble-button>
    <nimble-button appearance="${ButtonAppearance.Ghost}">Ghost button</nimble-button>
    <nimble-button appearance="${ButtonAppearance.Block}">Block button</nimble-button>
`;

export const button = (): string => buttonTemplate;
