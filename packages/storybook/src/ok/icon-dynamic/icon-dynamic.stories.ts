import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { IconDynamic, iconDynamicTag } from '@ni/ok-components/dist/esm/icon-dynamic';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../utilities/storybook';

interface OkIconDynamicArgs {
    iconName: string;
}

const dynamicIconDataUri = 'data:image/gif;base64,R0lGODlhFwAaAPIHAPfWre+9e//v3s6EITw+PP////+M/wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAHACwAAAAAFwAaAEADkHi63O5jhEmFBSDCYPq0oNUZGTNgJ6ZiVCC5Tywr70QQn3WD5RKpPMvAMhnMjjOJMcLUnIybVuVygfoot50uq7I2gSEBQGhtnMIgaRnJbifXEDjNVWv95If6lCfXT8ZhPVc2BAU4W4ZVJhwFBjcBAgRiNwaNgnMVgIGXKWBhQygxZ2gRdnEYaAJqZU2trq0HCQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkECQoAAAAsAAAAABMABwAAAgqEj6nL7Q+jnLEAACH5BAkKAAIALAIABgATAAQAAAIQlD+pc6gNzRohxAsAY/eyAgAh+QQJCgAEACwEAAUADwAFAAADGThD3E5qhBUrBGrKwLvCWccJJABuYkCuWAIAIfkECQoABAAsAgAGABMABAAAAxhIutM+i70Rqg2zVXqD+AAwhJDWeR/YEAkAIfkEBQoABAAsBAAFAA8ABQAAAxk4Q9xOaoQVKwRqysC7wlnHCSQAbmJArlgCACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAEAAAICRAEAIfkEBQoAAwAsBgAIAAsABwAAAhKMD6PL7SveSsM0gU+AOFqGDQUAIfkEBQoAAQAsBgAIAAsABwAAAxMYurL+EILIFCHviluwJd3lLWICACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAEAAAICRAEAOw==';

const metadata: Meta<OkIconDynamicArgs> = {
    title: 'Ok/Icon Dynamic',
    render: (args, context) => {
        const renderStory = createUserSelectedThemeStory(html`
            <div data-dynamic-icon-placeholder></div>
        `);
        const content = renderStory(args, context);

        void customElements.whenDefined(iconDynamicTag).then(() => {
            const iconDynamic = customElements.get(iconDynamicTag) as typeof IconDynamic | undefined;
            if (!iconDynamic) {
                return;
            }

            const tagName = `ok-icon-dynamic-${args.iconName}`;
            if (!customElements.get(tagName)) {
                iconDynamic.registerIconDynamic(args.iconName, dynamicIconDataUri);
            }

            const previewIcon = document.createElement(tagName);

            const placeholder = content.querySelector('[data-dynamic-icon-placeholder]');
            if (placeholder) {
                placeholder.replaceWith(previewIcon);
            } else {
                content.prepend(previewIcon);
            }
        });

        return content;
    },
    argTypes: {
        iconName: {
            description: 'The dynamic icon name (lowercase letters, at least two characters).',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        iconName: 'awesome'
    }
};

export default metadata;

export const iconDynamic: StoryObj<OkIconDynamicArgs> = {};
