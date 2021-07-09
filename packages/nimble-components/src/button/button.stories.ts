import './index';

// eslint-disable-next-line import/no-default-export
export default {
    title: 'Button'
};

const buttonTemplate = '<nimble-button>Button</nimble-button>';

export const nimbleButton = (): string => buttonTemplate;
