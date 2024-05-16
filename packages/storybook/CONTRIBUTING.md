# Creating Storybook Files for a Component

This package contains Storybook files for each component which accomplish two things:
1. provide user facing documentation in the [public Nimble and Spright Storybook](https://nimble.ni.dev/storybook).
2. comprehensively test visual states of the component in [Chromatic](https://www.chromatic.com/builds?appId=60e89457a987cf003efc0a5b).

## Getting Started

From the Nimble repo root directory:

1. Run `npm install`
2. Run `npm run build`
3. To view the component documentation in Storybook: `npm run storybook`

## Folder Structure

Create a folder for each component under `src/nimble` or `src/spright`. The folder should match the name of the component in the corresponding `@ni/nimble-components` or `@ni/spright-components` package.

Each folder should include the following files:

| File                             | Description                          |
| -------------------------------- | ------------------------------------ |
| component-name.stories.ts        | Contains the component hosted in Storybook. This provides a live component view for development and testing along with API documentation.  |
| component-name-matrix.stories.ts | Contains a story that shows all component states for all themes hosted in Storybook. This is used by Chromatic visual tests to verify styling changes across all themes and states.   |
| component-name.mdx               | Contains the Storybook documentation for this component. This should provide design guidance and usage information. See below for more information about the structure of this file. |
| component-name.react.tsx         | Simple React wrapper for the component to be used in Storybook MDX documentation.   |

## Documentation Workflow

Add `component-name.mdx` file in component directory with the following template:

```jsx
import { Canvas, Meta, Controls, Title } from '@storybook/blocks';
import { NimbleComponentName } from './component-name.react';
import * as componentNameStories from './component-name.stories';

<Meta of={componentNameStories} />
<Title of={componentNameStories} />

*Component description*

<Canvas of={componentNameStories.firstStoryName} />

## API

<Controls of={componentNameStories.firstStoryName} />
<ComponentApisLink />

## Usage

## Styling

### Appearances

### Appearance Variants

### Sizing

## Examples

## Accessibility

## Resources

```

Fill out the template with all available information, and comment out any empty sections. E.g. `{/* ## Examples */}`

If the component has a [W3C ARIA description](https://www.w3.org/WAI/ARIA/apg/patterns/), consider using that to describe the component purpose.

### Markdown

The description supports Markdown, so can link to other documents or components. E.g.

```md
[Links to a specific documentation page](?path=/docs/some--id)
[Links to a specific story canvas](?path=/story/some--id)
```

Note: if linking in a story via a native or Nimble anchor component, use the following syntax:

```html
<a href="./?path=/docs/some--id" target="_top">Link</a>
```

All other Markdown formatting is supported. See any [Markdown Cheatsheet](https://www.markdownguide.org/cheat-sheet/) for more information.

### Testing 

When you run Storybook (See **Getting Started** above), you should see the `component-name.mdx` file rendered as the component **Docs** page.