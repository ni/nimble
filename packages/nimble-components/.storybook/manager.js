import { addons } from '@storybook/addons';
import theme from './theme';

addons.setConfig({
    enableShortcuts: false,
    sidebar: {
        filters: {
            patterns: item => {
                return (
                    // Hide docs that aren't useful to clients from the sidebar on public site
                    window.location.hostname !== 'nimble.ni.dev'
                    && !item.title.startsWith('Tests/')
                    && !item.title.startsWith('Internal/')
                    && !item.title.startsWith('patterns/')
                );
            }
        }
    },
    theme
});
