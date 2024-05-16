import { configureActions } from '@storybook/addon-actions';
import '@ni/nimble-tokens/dist/fonts/css/fonts.css';
import './preview.css';
import { transformSource } from './transformSource';
import {
    backgroundStates,
    defaultBackgroundState
} from '../dist/esm/utilities/states';
import {
    Container,
    Column,
    Do,
    Dont,
    Frame,
    Divider,
    Tag
} from './blocks/StoryLayout.tsx';

export const parameters = {
    backgrounds: {
        default: defaultBackgroundState.name,
        values: backgroundStates.map(({ name, value }) => ({ name, value }))
    },
    options: {
        storySort: {
            method: 'alphabetical',
            // Items within arrays show the sort order for children of the category above
            // https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#sorting-stories
            order: [
                'Getting Started',
                'Components',
                ['Status Table'],
                'Incubating',
                ['Docs'],
                'Tokens',
                ['Docs'],
                'Tests',
                ['Docs'],
                'Spright',
                ['Docs'],
                'Tests Spright',
                ['Docs'],
                'Internal',
                ['Docs'],
                'Patterns',
                ['Docs']
            ]
        }
    },
    controls: {
        expanded: true
    },
    docs: {
        controls: { sort: 'alpha' },
        source: {
            transform: transformSource
        },
        toc: { headingSelector: 'h1, h2, h3' },
        components: {
            Container,
            Column,
            Do,
            Dont,
            Frame,
            Divider,
            Tag
        }
    }
};

const createOrUpdateBackgroundWorkaround = style => {
    let styleElement = document.querySelector('.nimble-background-workaround');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.classList.add('nimble-background-workaround');
        document.head.append(styleElement);
    }
    styleElement.innerHTML = style;
};

// Storybook background plugin does not support mdx
// Workaround based on: https://github.com/storybookjs/storybook/issues/13323#issuecomment-876296801
export default {
    parameters,
    decorators: [
        (story, context) => {
            const defaultBackgroundColorKey = context?.parameters?.backgrounds?.default;
            const defaultBackgroundColor = context?.parameters?.backgrounds?.values?.find(
                v => v.name === defaultBackgroundColorKey
            )?.value;
            const currentBackgroundColor = context?.globals?.backgrounds?.value ?? defaultBackgroundColor;
            const style = `.docs-story {
                background-color: ${currentBackgroundColor}
            }`;
            createOrUpdateBackgroundWorkaround(style);
            return story();
        }
    ]
};

// Storybook's default serialization of events includes the serialized event target. This can
// be quite large, such as in a table with a lot of records. Therefore, the serialization depth
// should be limited to avoid poor performance.
configureActions({
    depth: 1
});

// Update the GUID on this line to trigger a turbosnap full rebuild: 3e3470f8-2a6c-4474-b409-409c1dfbecea
// See https://www.chromatic.com/docs/turbosnap/#full-rebuilds
