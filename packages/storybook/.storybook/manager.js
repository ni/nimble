import { addons } from '@storybook/manager-api';
import theme from './theme';

addons.setConfig({
    enableShortcuts: false,
    sidebar: {
        filters: {
            patterns: item => {
                const isPublicSite = window.location.hostname === 'nimble.ni.dev';
                const title = item.title.toLowerCase();
                const isItemInternal = title.startsWith('tests')
                    || title.startsWith('internal/')
                    || title.startsWith('patterns/');
                const shouldHideInSidebar = isPublicSite && isItemInternal;
                return !shouldHideInSidebar;
            }
        }
    },
    theme,
    toolbar: {
        'storybook/pseudo-states/tool': { hidden: true }
    }
});
