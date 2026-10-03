# Chat Tool Status

## Overview

`spright-chat-message-tool-summary` is a chat message type that presents the status of one or more tool calls invoked during a chat session. It uses `spright-chat-tool-call` child components to represent each tool call, which use `spright-chat-tool-call-input` children to represent their inputs.

### Background

Multiple clients of the Spright chat components have created custom tool summaries for their applications. These components unify the presentation of tool call status.

### Containing Library

These components will go in Spright along with [existing chat components](../../../specs/README.md).

### Non-goals

The following capabilities are feature gaps compared with the React reference below. They are initially omitted for scoping reasons but may be added in a follow-up.

- Approval requests, approval decisions, and preference actions. (e.g. "Allow once"/"Always allow").
- Detailed execution results including commands, working directories, exit codes, and standard output streams.
- Rich result presentation such as diffs, plans, raw payloads, plot content.

### Features

- Compact summary of multiple tool calls when children are collapsed.
- Ability to expand the summary using disclosure/accordion interactions to see child tool calls.
- When summary is expanded, a list of tool calls show summary information like tool name and status. 
  - Status includes pending, success, warning, error, canceled, declined, and terminated states.
- Ability to expand individual tool calls to see input information. 

### Risks and Challenges

- The React implementation has a larger capability surface than the Angular implementation. The proposed API starts with the overlapping capabilities so will not initially be sufficient for the React application.

### Prior Art/Examples

- [Angular implementation with grouped calls](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=/Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/nigel/src/components/sl-nigel-tool-call-summary/)
    - [Storybook demo](https://stratus-storybook.ni.dev/?path=/story/components-nigel--with-tool-calls)
- [React implementation with detailed calls](https://github.com/ni/testhub/blob/main/src/frontend/packages/chat-ui/src/ToolCallMessage.tsx)

## Design

A customer can use the components together like this:

```html
<spright-chat-message-tool-summary>
    <spright-chat-tool-call
        name="systemlink.systems.search_systems"
        status="pending">
    </spright-chat-tool-call>
    <spright-chat-tool-call
        name="systemlink.assets.search_assets"
        status="success">
        <spright-chat-tool-call-input
            name="filter"
            value="workspace: &quot;engineering&quot;">
        </spright-chat-tool-call-input>
        <spright-chat-tool-call-input
            name="projection"
            value='["id", "name", "serialNumber"]'>
        </spright-chat-tool-call-input>
        <spright-chat-tool-call-input
            name="take"
            value="25">
        </spright-chat-tool-call-input>
    </spright-chat-tool-call>
    <spright-chat-tool-call
        name="systemlink.tags.search_tags"
        status="success">
        <spright-chat-tool-call-input
            name="paths"
            value='["Line1.*", "Line2.*"]'>
        </spright-chat-tool-call-input>
        <spright-chat-tool-call-input
            name="keywords"
            value='["production"]'>
        </spright-chat-tool-call-input>
    </spright-chat-tool-call>
</spright-chat-message-tool-summary>
```

### API

#### Chat message tool summary

- _Tag_: `spright-chat-message-tool-summary`
- _Props/Attrs_:
    - `expanded` - boolean, default `false`; controls whether the grouped child list is shown. User toggles are reflected to the attribute.
- _Methods_
    - None.
- _Events_
    - None.
- _Slots_
    - `(default)` - ordered `spright-chat-tool-call` child elements.
- _CSS Classes, Parts, and CSS Custom Properties that affect the component_
    - No public CSS parts.

#### Tool call

- _Tag_: `spright-chat-tool-call`
- _Props/Attrs_:
    - `name` - string attribute identifying the tool and providing its visible label. Clients should assign the localized display value when needed.
    - `status` - string attribute, default `unknown`. Supported values are `pending`, `success`, `warning`, `error`, `canceled`, `declined`, `terminated`, and `unknown`.
- _Methods_
    - None.
- _Events_
    - None.
- _Slots_
    - `(default)` - ordered `spright-chat-tool-call-input` child elements.
- _CSS Classes, Parts, and CSS Custom Properties that affect the component_
    - No public CSS parts.

#### Tool call input

- _Tag_: `spright-chat-tool-call-input`
- _Props/Attrs_:
    - `name` - string attribute identifying the input.
    - `value` - string attribute containing the input value. Scalar values are represented directly; arrays and objects are serialized as JSON.
- _Methods_
    - None.
- _Events_
    - None.
- _Slots_
    - None.
- _CSS Classes, Parts, and CSS Custom Properties that affect the component_
    - None.

#### API Alternatives

Input values are modeled as any JSON-serializable type: boolean, string, number plus arrays and objects with arbitrary levels of nesting. The component will display them as JSON. There are several options available to provide these values:
1. value is a string attribute, clients provide JSON which the component displays as-is
1. value is a string attribute, clients provide JSON which the component will format for display (indentation, unescaping)
1. value is a property which accepts the unserialized value. Its type would be roughly `JsonObject | JsonArray | string | number | boolean`. To avoid runtime type checking there could be an additional `value-type` attribute.
1. Create several strongly typed input components: `tool-call-input-boolean`, `tool-call-input-string`, `tool-call-input-json`, etc.

### Anatomy

The visual tree is approximately:

```text
spright-chat-message-tool-summary
 +- header
|  +- status icon
|  +- summary/status label
|  +- disclosure control
 +- entry list
|  +- slot (spright-chat-tool-call child elements) *
 +- footer

spright-chat-tool-call
 +- header
|  +- status icon
|  +- label
 +- input list
|  +- slot (spright-chat-tool-call-input child elements) *
 +- footer

spright-chat-tool-call-input
 +- input name
 +- input value
```

Slotted children are rendered in DOM order. Canceled children are visually de-emphasized and have an equivalent text status; status must never be conveyed by color or decoration alone.

### Native form integration

N/A. This is a status and disclosure component that does not accept input. The component does not own form values.

### Angular integration

Add Angular wrappers/directives for all three elements. The message wrapper should participate in the same conversation/message APIs as inbound and outbound messages, project one `spright-chat-tool-call` per Angular `ToolCallEntry` into the default slot, and avoid binding an `entries` object. Each tool-call wrapper projects `spright-chat-tool-call-input` children and assigns the individual normalized properties. No `ControlValueAccessor` is needed.

The Angular adapter should transform each existing `ToolCallEntry` into the child's individual properties and slotted input elements, preserving grouped order. `ToolCallSummary` becomes the parent plus one child per entry. Approval prompts and detailed execution-result views remain outside this shared component and are owned by the application.

### Blazor integration

Add Blazor wrappers for all three elements. The message participates in the same conversation/message composition as inbound and outbound messages and accepts projected child components. The tool call accepts individual parameters corresponding to `Name` and `Status` and accepts projected input children. The input accepts `Name`, `Value`, and `ValueType` parameters, with arrays and objects serialized as JSON in `Value`.

No form integration is needed. Unknown data must not be rendered as executable markup.

### Visual Appearance

Visual Design must define the parent's summary, the tool-call status row, input-name/value presentation, all status states, long names and input values, empty input, and narrow widths. The compact Angular summary uses a connected list treatment and monospace tool names.

The default presentation should be neutral and fit both light and dark Spright themes. Status colors require text or icons with sufficient contrast and must be paired with labels. Canceled and declined states should not rely only on strikethrough.

TODO: truncation and live updating outputs

### Interactions

- The header is a disclosure button with `aria-expanded` and `aria-controls` when expandable.
- The parent summary starts collapsed by default.

## Implementation

Implement all three elements with FAST Element. Use a custom parent template for the grouped disclosure, a custom tool-call template for the status row and input list, and a custom input template for the input name/value row. Use the existing button, icon, spinner, and relevant text primitives inside the templates.

Keep status normalization and display formatting in small pure utilities. Do not embed parsing for a specific transport in the component. The input child should tolerate missing names, unsupported value types, and malformed JSON by falling back to a safe string representation. The parent should tolerate unrelated slotted nodes and children without a valid status.

### States

- Empty: no tool call children; render no misleading status and no expandable control.
- Pending: at least one slotted child is pending; show the label for the pending state or the tool name.
- Settled summary: all children have terminal states; show `Called 1 tool` or `Called N tools`, with the ordered list available on expansion.
- Canceled, declined, terminated, warning, and error: show explicit text and status icon. The component remains readable with status information alone.
- Invalid: invalid configuration does not throw. Unknown statuses render as `unknown`; unrelated slotted nodes and children without a valid status are ignored by the parent.

### Accessibility

- Use a native `<button type="button">` for the grouped disclosure.
- Provide an accessible name for the status and include canceled, declined, or terminated text in the accessible content.
- Use `aria-expanded` and `aria-controls` for the grouped disclosure. Do not place `aria-expanded` on a non-interactive container.
- Use an ordered or unordered list with list semantics for grouped entries. Keep tool names and input values selectable and wrap long text.
- Do not rely on hover-only controls. The disclosure affordance and status remain visible or available to keyboard and touch users.
- Respect `prefers-reduced-motion`; no motion is required for status changes or expansion. Any permitted opacity transition must be removed or reduced when that setting is enabled.
- Ensure all status colors and focus indicators meet Spright contrast requirements.

### Mobile

The component uses available width and wraps tool names, input values, and labels. The header remains a touch target that fills the available width, with a minimum control height.

### Globalization

All user-visible labels, including the count, pending and completed states, expanded and collapsed states, canceled state, and status labels, must come from a chat label provider. The provider supplies default labels that client applications can localize or replace. Use logical CSS properties and `text-align: start`; do not assume LTR ordering. Input names and values remain in their supplied representation and are not localized.

### Security

Treat input names, values, and tool identity values as untrusted data. Render them as text, never as HTML. Do not execute commands, URLs, markdown, or embedded SVG from child data.

### Performance

The child should update only the affected status row or input row when an individual property changes. Avoid serializing large input values during every render.

The parent should observe slot changes and preserve DOM order. Duplicate child data IDs should not throw; generated internal IDs may be used for ARIA relationships.

### Dependencies

- `@ni/fast-element` and the existing component primitives used by the chat message family.
- No dependency on chat transport, markdown, diff, or approval policy.
- No new external dependency is planned.

### Test Plan

- Unit tests for parent empty, pending, settled, canceled, disabled, and invalid child states.
- Unit tests for child input name/value/type parsing, JSON values, and labels.
- Unit tests for disclosure keyboard behavior, ARIA attributes, and focus behavior.
- Security tests confirming input and tool identity are rendered as text rather than interpreted as HTML or SVG.
- Chromatic/Storybook coverage for summary and status-row usage, themes, narrow widths, long content, and every status.
- Angular and Blazor wrapper tests verifying individual property assignment and slotted input projection.

### Tooling

Add all three components to `src/all-components.ts`, the generated custom-elements manifest, Storybook, and the component status table. Add page objects and unit test folders following Spright conventions. Provide stories that exercise the individual child properties and slotted input children.

### Documentation

Document the primitive attributes, individual child properties and their types, parent/child/input examples, and the security boundary around untrusted tool data. Add framework examples for Angular, React, Blazor, and plain HTML. Include a migration note explaining how the Angular `ToolCallSummary` and React `ToolCallMessage` models map to slotted children and the shared normalized properties. Document that React/backend `arguments` objects become one input child per named argument.

## Open Issues

- Supported types for tool call input