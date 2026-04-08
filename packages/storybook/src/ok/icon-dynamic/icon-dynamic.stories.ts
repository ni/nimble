import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { IconDynamic } from '@ni/ok-components/dist/esm/icon-dynamic';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../utilities/storybook';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface OkIconDynamicArgs {}

const tagName = 'ok-icon-dynamic-awesome';
const url = 'data:image/gif;base64,R0lGODlhFwAaAPIHAPfWre+9e//v3s6EITw+PP////+M/wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAHACwAAAAAFwAaAEADkHi63O5jhEmFBSDCYPq0oNUZGTNgJ6ZiVCC5Tywr70QQn3WD5RKpPMvAMhnMjjOJMcLUnIybVuVygfoot50uq7I2gSEBQGhtnMIgaRnJbifXEDjNVWv95If6lCfXT8ZhPVc2BAU4W4ZVJhwFBjcBAgRiNwaNgnMVgIGXKWBhQygxZ2gRdnEYaAJqZU2trq0HCQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkECQoAAAAsAAAAABMABwAAAgqEj6nL7Q+jnLEAACH5BAkKAAIALAIABgATAAQAAAIQlD+pc6gNzRohxAsAY/eyAgAh+QQJCgAEACwEAAUADwAFAAADGThD3E5qhBUrBGrKwLvCWccJJABuYkCuWAIAIfkECQoABAAsAgAGABMABAAAAxhIutM+i70Rqg2zVXqD+AAwhJDWeR/YEAkAIfkEBQoABAAsBAAFAA8ABQAAAxk4Q9xOaoQVKwRqysC7wlnHCSQAbmJArlgCACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAEAAAICRAEAIfkEBQoAAwAsBgAIAAsABwAAAhKMD6PL7SveSsM0gU+AOFqGDQUAIfkEBQoAAQAsBgAIAAsABwAAAxMYurL+EILIFCHviluwJd3lLWICACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAEAAAICRAEAOw==';

IconDynamic.registerIconDynamic(tagName, url);

const metadata: Meta<OkIconDynamicArgs> = {
    title: 'Ok/Icon Dynamic',
    parameters: {
        // Icon example animates so disabling snapshot to prevent intermittency
        chromatic: { disableSnapshot: true },
    },
    render: createUserSelectedThemeStory(html`
        <${tagName}></${tagName}>
    `),
    args: {
        severity: 'default',
    },
    argTypes: {
        severity: {
            control: false,
            description: 'As a type of `Icon`, an `IconDynamic` has a severity property but it is currently ignored if configured.',
            table: { category: apiCategory.attributes }
        }
    },
};

export default metadata;

export const iconDynamic: StoryObj<OkIconDynamicArgs> = {};
