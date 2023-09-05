import { addons } from '@storybook/addons';
import theme from './theme';

addons.setConfig({
    enableShortcuts: false,
    sidebar: {
        filters: {
            patterns: item => {
                return (
                    !item.title.startsWith('Internal/')
                    && !item.title.startsWith('patterns/')
                );
            }
        }
    },
    theme
});
