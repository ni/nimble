import { configureActions } from 'storybook/actions';
import { SyntaxHighlighter } from 'storybook/internal/components';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import '@ni/nimble-tokens/dist/fonts/css/fonts.css';
import './preview.css';
import { transformSource } from './transformSource';
import {
    backgroundStates,
    defaultBackgroundState
} from '../src/utilities/states';
import {
    Container,
    Column,
    Do,
    Dont,
    Frame,
    Divider,
    Tag
} from './blocks/StoryLayout';
import theme from './theme';
import { InlineTableOfContents } from './blocks/InlineTOC';
import { InlineGuideline } from './blocks/InlineGuideline';
import { GuidelinesDo, GuidelinesDont } from './blocks/Guideline';
import { DocsGrid } from './blocks/DocsGrid';
import HyperlinkCard from './blocks/HyperlinkCard';
import ExampleContainer from './blocks/ExampleContainer';

SyntaxHighlighter.registerLanguage('cs', csharp);

const parameters = {
    backgrounds: {
        options: backgroundStates.reduce((obj, curr) => {
            obj[curr.theme] = {
                name: curr.name,
                value: curr.value
            };
            return obj;
        }, {})
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
        toc: { disable: true, headingSelector: 'h1, h2, h3' },
        theme,
        components: {
            Container,
            Column,
            Do,
            Dont,
            Frame,
            Divider,
            Tag,
            InlineGuideline,
            TableOfContents: InlineTableOfContents,
            GuidelinesDo,
            GuidelinesDont,
            DocsGrid,
            HyperlinkCard,
            ExampleContainer
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
    initialGlobals: {
        backgrounds: {
            value: defaultBackgroundState.theme,
        }
    },
    parameters,
    decorators: [
        (story, context) => {
            const defaultBackgroundColorKey = context?.initialGlobals?.backgrounds?.value;
            const defaultBackgroundColor = context?.parameters?.backgrounds?.options[defaultBackgroundColorKey]?.value;
            const currentBackgroundColorKey = context?.globals?.backgrounds?.value;
            const currentBackgroundColor = context?.parameters?.backgrounds?.options[currentBackgroundColorKey]?.value ?? defaultBackgroundColor;
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

// Update the GUID on this line to trigger a turbosnap full rebuild: 4affe2f2-215a-4d52-b841-b4eeb06a9e61
// See https://www.chromatic.com/docs/turbosnap/#full-rebuilds
