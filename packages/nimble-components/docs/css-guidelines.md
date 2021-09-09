# CSS Guidelines

[WIP] A super rough brain dump of CSS things to watch out for.

## Use design tokens for values that might be configurable

Some attribute values might need to be configurable in context-specific situations like UIs requring different themes, large touch-friendly UIs, or small information-dense UIs. Examples include colors, typography, sizing, and animation parameters. These attribute values should be specified as shared design tokens rather than literals within an individual component's CSS. This makes it easier to change the values dynamically if required in the future and also improves readability and reduces duplication.

## Prefer modern layouts

Prefer flex and grid for layouts. If you find yourself with position absolute / relative and tricky sizing and offsets from top, etc. it might be worth stepping back and seeing if you can take a different approach.

When stepping back try to start at the top-level of the control which is likely in a flex layout and see where parts go. You can also use display: contents to make an element ignore its own sizing and propagate a child's sizing up. Useful if you are finding yourself in deep layers of nested flex layouts.

## Avoid styling functional elements

Some elements are used just for their function such as the design-system-provider and slot elements. Those elements should not generally be part of layout and given sizing, etc that is important. Instead they should stay display: contents and let their children participate in layout and styling.

## Prefer cascade for state changes

If you find yourself in complex logic with lots of :not() selectors it's possible the code should be reorganized to leverage the CSS cascade for overriding states. States should flow from plain control -> hover -> focus -> active -> error -> disabled (which overrides all the others). [See PR comment for more details and links](https://github.com/ni/nimble/pull/73#discussion_r690792638).

## Group selectors by target

In a CSS file the rules should be organized by the element they are selecting for. Keeping those selectors grouped together makes it easier to scan a file and see the rules impacting a particular element in one location.

### Comments

To comment on CSS inside the `css` tagged template helper, use template literal strings with an empty string. This helps minified code output.

```ts
const styles = css`
    :host {
        ${
            /*
             * Placing comments in template literals removes them from the compiled code and
             * helps to minify the code output.
             */ ''
        }
        color: gold;
    }
`;
```