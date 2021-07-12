import './index';
import { withXD } from 'storybook-addon-xd-designs';

export default {
    title: 'Button',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
        'https://xd.adobe.com/view/2a5a7401-925e-4fcc-9230-39d8e3c56729-7f09/screen/0fbfcd67-b185-4c93-864f-d86a86c5476f/specs/'
        }
    }
};

const buttonTemplate = '<nimble-button>Button</nimble-button>';

export const button = (): string => buttonTemplate;
