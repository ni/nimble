import { addons } from '@storybook/manager-api';
import theme from './theme';

addons.setConfig({
    enableShortcuts: false,
    sidebar: {
        filters: {
            patterns: item => {
                const isPublicSite = window.location.hostname === 'nimble.ni.dev';
                const isItemInternal = item.title.startsWith('Tests/')
                    || item.title.startsWith('Internal/')
                    || item.title.startsWith('patterns/');
                const shouldHideInSidebar = isPublicSite && isItemInternal;
                return !shouldHideInSidebar;
            }
        }
    },
    theme
});
