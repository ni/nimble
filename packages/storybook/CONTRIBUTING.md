# Creating Storybook Files for a Component

This package contains Storybook files for each component which accomplish two
things:

1. provide user facing documentation in the
   [public Storybook](https://nimble.ni.dev/storybook).
2. comprehensively test visual states of the component in
   [Chromatic](https://www.chromatic.com/builds?appId=60e89457a987cf003efc0a5b).

## Getting Started

From the Nimble repo root directory:

1. Run `npm install`
2. Run `npm run build`
3. To view the component documentation in Storybook: `npm run storybook`

## Folder Structure

Place components in their own folder in `src` corresponding to their components
library, for example: `src/nimble/<component>` for
`@ni/nimble-components/src/<component>`.

Each folder should include the following files:

| File                             | Description                                                                                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| component-name.stories.ts        | Contains the component hosted in Storybook. This provides a live component view for development and testing along with API documentation.                                            |
| component-name-matrix.stories.ts | Contains a story that shows all component states for all themes hosted in Storybook. This is used by Chromatic visual tests to verify styling changes across all themes and states.  |
| component-name.mdx               | Contains the Storybook documentation for this component. This should provide design guidance and usage information. See below for more information about the structure of this file. |

## Documentation Workflow

Create `component-name.mdx` alongside the component's stories. Use this
structure as a starting point, then keep only sections that apply:

```jsx
import { Canvas, Meta, Controls, Title } from '@storybook/addon-docs/blocks';
import * as componentNameStories from './component-name.stories';
import ComponentApisLink from '../../docs/component-apis-link.mdx';

<Meta of={componentNameStories} />
<Title of={componentNameStories} />

## Overview

Describe what the component does, when to use it, and any important alternative.

{/* Add an anatomy diagram here when it helps explain the component's parts. */}

## Implementation & API

<Canvas of={componentNameStories.firstStoryName} />

<Controls of={componentNameStories.firstStoryName} />
<ComponentApisLink />

## Appearance & Styling (when applicable)

Describe the available appearances, variants, sizing, and layout guidance.

## Guidelines (when useful)

Show concise examples of recommended usage and common mistakes.

## Accessibility (when applicable)

Document accessible naming, keyboard interaction, and consumer responsibilities.
```

Use Markdown headings (`##` for sections and `###` for subsections) with
Storybook's `Title`, `Canvas`, and `Controls` blocks. Replace the sample story
name with the story that best demonstrates the component. Omit empty sections,
and keep each recommendation in one place; examples should illustrate guidance
rather than repeat it.

If the component has a relevant
[W3C ARIA description](https://www.w3.org/WAI/ARIA/apg/patterns/), consider
linking to it from the overview.

See the [Button story](src/nimble/button/button.mdx) for a complete example of
this structure, including appearance guidance, do/don't examples, accessibility
notes, and an anatomy diagram.

### Anatomy diagrams

Add an anatomy diagram after the overview when it clarifies the component's
parts. Label the parts and include a numbered legend. Store SVG artwork in the
component's `images` directory, with its layout and `viewBox` defined in the
asset.

Follow [ButtonAnatomy](src/nimble/button/button-anatomy.tsx) for themed SVGs:
import the asset with `?raw`, map its colors to Nimble design tokens, and render
it once inline so it inherits the theme. Give the diagram an accessible
description with `role="img"` and `aria-label`, and hide decorative SVG artwork
from assistive technology. Keep any required SVG IDs unique.

Wrap inline examples in `NimbleThemeProvider`, using `theme` from
`utilities/story-layout`; shared MDX fragments should provide their own theme
context. `StoryAnatomy` supplies spacing around a diagram.

### Examples and usage guidance

Use `StoryShowcase` for an example paired with explanatory content: its
`example` prop contains the preview, and its children contain the guidance.
Keep example-specific styles with the example. See the shared
[Button styling docs](src/nimble/patterns/button/button-styling-docs.mdx).

Use `StoryGuidanceGrid` with `Do` and `Dont` for contrasting examples. Each card
accepts a `title`, an `example`, and explanatory children. Phrase titles so they
read naturally after "Do" or "Don't"; avoid repeating the same advice in the
card title and description.

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
    - Do: `Light Theme$ Open$ No Filter`
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

Run Storybook (see **Getting Started**) and open the component's **Docs** page.
Check the anatomy labels and legend, live examples, Controls, and links.

Use Chromatic matrix stories for visual coverage across themes and viewport
sizes. The [Story Layout matrix](src/docs/story-layout-matrix.stories.tsx)
covers the Button anatomy diagram, showcase, and guidance cards in light/dark
themes at 480px and 1440px. Add visual coverage for new anatomy diagrams and
shared presentation patterns.
