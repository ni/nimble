# Blocks

This folder contains reusable React components used in Nimble component MDX documentation. Storybook refers to these types of reusable components as [Doc blocks](https://storybook.js.org/docs/writing-docs/doc-blocks).

## File Structure

-   `StoryLayout.tsx`: Main file that exports the components
-   `story-layout.css`: CSS file for styling the components.
-   `assets/`: Folder containing assets used in the components.

## Components

### Container

-   Renders a container with a CSS grid configuration. Use with `<Column>`.
-   Use CSS [grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns) for the config prop to specify the number of columns and their widths.

### Column

-   Renders a column for use with `<Container>`.
-   If you need to put Nimble components in a column, use the stylingClass="controls" prop to apply the correct margins.

### Divider

-   Renders a simple horizontal divider to vertically separate the contents of a `<Column>`.

### Do

-   Renders a "Do" section for MDX documentation.

### Dont

-   Renders a "Don't" section for MDX documentation.

### Frame

-   Renders a frame to match visual design of existing Storybook Doc blocks.

### Tag

-   Renders a tag string in code blocks. Optionally surrounding it with angle brackets to show as HTML elements.

    | Property  | Example                                 |
    | --------- | --------------------------------------- |
    | _default_ | `nimble-component`                      |
    | open      | `<nimble-component>`                    |
    | openClose | `<nimble-component></nimble-component>` |
    | close     | `</nimble-component>`                   |
    | selfClose | `<nimble-components/>`                  |

## Usage

Compose the components to create clear and attractive usage documentation.

To use any Nimble components in MDX documentation, first import the Nimble React wrapper for the component.
E.g. `import { NimbleButton } from './button.react';`

```jsx
<Frame>
    <Container config="375px 1fr">
        <Column stylingClass="controls">
            <NimbleButton appearance="ghost">{`Ghost Button`}</NimbleButton>
            <Divider />
            <NimbleButton appearance="ghost">{`Ghost Button`}</NimbleButton>
        </Column>
        <Column>
            <Do>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Do>
            <Do>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Do>
            <Dont>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Dont>
        </Column>
    </Container>
</Frame>
```

Note: The MDX formatter will apply a `<p>` tag around any text on its own line. To prevent this and from breaking Nimble component styling, add `` {`text content`} `` around Nimble component slot content.

## Contributing

Import new components in the `preview.js` file to make them available in all Nimble component MDX documentation.
