# Creating Storybook Component Documentation

## Getting Started

From the `nimble` directory:

1. Run `npm install`
2. Run `npm run build`
3. To view the component documentation in Storybook: `npm run storybook -w @ni/nimble-components`

## Documentation Workflow

Add `component-name.mdx` file in component `test` directory with the following template:

```jsx
import { DocsStory, Meta, Controls, Title } from '@storybook/blocks';
import { NimbleComponentName } from './<FTName>.react';
import * as componentNameStories from './<FTName>.stories';

<Meta of={componentNameStories} />
<Title of={componentNameStories} />

*Component description*

<DocsStory of={componentNameStories.firstStoryName} expanded={false} />
<Controls of={componentNameStories.firstStoryName} />

## Appearances

## Appearance Variants

## Usage 

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