# Creating Storybook Files for a Component

This package contains Storybook files for each component which accomplish two
things:

1. provide user facing documentation in the
   [public Nimble and Spright Storybook](https://nimble.ni.dev/storybook).
2. comprehensively test visual states of the component in
   [Chromatic](https://www.chromatic.com/builds?appId=60e89457a987cf003efc0a5b).

## Getting Started

From the Nimble repo root directory:

1. Run `npm install`
2. Run `npm run build`
3. To view the component documentation in Storybook: `npm run storybook`

## Folder Structure

Create a folder for each component under `src/nimble` or `src/spright`. The
folder should match the name of the component in the corresponding
`@ni/nimble-components` or `@ni/spright-components` package.

Each folder should include the following files:

| File                             | Description                                                                                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| component-name.stories.ts        | Contains the component hosted in Storybook. This provides a live component view for development and testing along with API documentation.                                            |
| component-name-matrix.stories.ts | Contains a story that shows all component states for all themes hosted in Storybook. This is used by Chromatic visual tests to verify styling changes across all themes and states.  |
| component-name.mdx               | Contains the Storybook documentation for this component. This should provide design guidance and usage information. See below for more information about the structure of this file. |
| component-name.react.tsx         | Simple React wrapper for the component to be used in Storybook MDX documentation.                                                                                                    |

## Documentation Workflow

Add `component-name.mdx` file in component directory with the following
template:

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

Fill out the template with all available information, and comment out any empty
sections. E.g. `{/* ## Examples */}`

If the component has a
[W3C ARIA description](https://www.w3.org/WAI/ARIA/apg/patterns/), consider
using that to describe the component purpose.

### Markdown

The description supports Markdown, so can link to other documents or components.
E.g.

```md
[Links to a specific documentation page](?path=/docs/some--id)
[Links to a specific story canvas](?path=/story/some--id)
```

Note: if linking in a story via a native or Nimble anchor component, use the
following syntax:

```html
<a href="./?path=/docs/some--id" target="_top">Link</a>
```

Linking to headings within a document doesn't work very well, i.e.
`./page#some-heading`; avoid using links to specific headings and instead link
to the page and refer to the section using **Bold**, i.e.
`See **Some Heading** on [Page](./page)`.

All other Markdown formatting is supported. See any
[Markdown Cheatsheet](https://www.markdownguide.org/cheat-sheet/) for more
information.

### Matrix story naming

The names of stories within matrix tests should conform to the following
guidelines:

1. Do not include component name in the story name.
    - Do: `Hidden`, `Theme Matrix`
    - Don't: `Hidden Text Field`, `Select Theme Matrix`
1. Do not include tests for multiple components under one storybook group.
    - Do: `Radio Group >> Hidden`, `Radio >> Hidden`
    - Don't: `Radio Group >> Hidden Radio Group` and
      `Radio Group >> Hidden Radio`
1. Use `$` as a delimiter in test names that have a constant value for a matrix
   dimension.
    - Do: `LightTheme$ Open$ No Filter`
    - Don't: `Light Theme Open No Filter`
1. Consider including a "false" attribute in a story name when there is a story
   for the value being both "false" and "true". This name should be in the form
   of "BooleanPropertyName" and "BooleanPropertyNameAbsent".
    - Do: `Read Only Absent$ Disabled`, `Read Only$ Disabled Absent`
    - Don't: `Editable$ Disabled`, `ReadOnly$ Enabled`
1. Specify the theme as the first segment of the story name when it is a fixed
   value.
    - Do: `Light Theme$ Open $No Filter`
    - Don't: `Open$ No Filter$ Light Theme`
1. Do not include the theme in the story name if it isn't part of the test
   dimension. If a test is run only for a single theme to test something
   unrelated to theme, the theme should not be included in the story name.
    - Do: `Light Theme$ Open$ No Filter` (if there are also
      `Dark Theme$ Open$ No Filter` and `Color Theme$ Open$ No Filter`)
    - Don't: `Light Theme$ Open$ No Filter` (if there are not also
      `Dark Theme$ Open$ No Filter` and `Color Theme$ Open$ No Filter`)
1. Do not include the background color in the story name.
    - Do: `Light Theme$ Open$ No Filter`
    - Don't: `Light Theme White Background$ Open$ No Filter`,
      `Light Theme$ White Background$ Open$ No Filter`

### Testing

When you run Storybook (See **Getting Started** above), you should see the
`component-name.mdx` file rendered as the component **Docs** page.
