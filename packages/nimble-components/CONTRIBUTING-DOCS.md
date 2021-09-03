# Contributing to Nimble Component Documentation

## Getting started

From the `nimble` directory:

1. Run `npm install`
1. Run `npm run build`
1. To view the component documentation in Storybook: `npm run storybook -w @ni/nimble-components`

## Documentation Development workflow

1. When documenting a new component, add a `component-name-docs.stories.mdx` file to the `tests` folder. Use the template below, or copy an existing `*.docs.stories.mdx` into this directory. The folder structure is further documented in the [CONTRIBUTING.md](CONTRIBUTING.md) guide.
2. Run the Storybook command from the `nimble` directory:

    `npm run storybook -w @ni/nimble-components`

3. Update the `component-name-docs.stories.mdx` file with design guidance.

    The storybook will hot reload when you save changes, so you can preview changes in Storybook. **If page doesn't look quite right, you may need to refresh the page.**

4. Create changelists for your work by running the following from the `nimble` directory:

    `npm run change`

## Documentation template

All `*.docs.stories.mdx` files require the following lines at the top of the file. The `title` attribute should match the component name (e.g. Button, Checkbox, Number Field, etc.), so that these docs will be associated with the component in Storybook.

```jsx
import { Story, Meta } from '@storybook/addon-docs';

<Meta title="COMPONENT_NAME" />;
```

To show a live component inline with documentation, use the following syntax (where `some--id` can be copied from the URL of the component view in Storybook):

```jsx
<Story id="some--id" />
```

You can also link to other documents or components –

```md
[Links to a specific documentation page](?path=/docs/some--id)
[Links to a specific story canvas](?path=/story/some--id)
```

All other Markdown formatting is supported. See any [Markdown Cheatsheet](https://www.markdownguide.org/cheat-sheet/) for more information.
