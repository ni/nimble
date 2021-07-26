import './index';

export default {
    title: 'Image',
    parameters: {
        actions: {
            handles: ['change', 'input']
        }
    },
    render: ({
        source
    }: {
        source: string
    }): string => `<nimble-image source="${source}">`,
    args: {
        source: 'https://media.tenor.com/images/41c62170d703344338b8b7dfe63e4aaa/tenor.gif'
    }

};

export const image = {
    args: { source: 'https://media.tenor.com/images/41c62170d703344338b8b7dfe63e4aaa/tenor.gif' }
};
