import { addons } from '@storybook/addons';
import favicon from './nimble-logo-icon.svg';
import theme from './theme';

const link = document.createElement('link');
link.setAttribute('rel', 'shortcut icon');
link.setAttribute('href', favicon);
document.head.appendChild(link);

addons.setConfig({
    enableShortcuts: false,
    theme
});
