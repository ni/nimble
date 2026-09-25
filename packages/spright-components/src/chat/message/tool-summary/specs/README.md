# Chat Tool Status

## Overview

`spright-chat-message-tool-summary` is a chat message type that presents the status of one or more tool calls invoked during a chat session. It uses a reusable `spright-chat-tool-call` child component to represent each tool call.

### Background

Multiple clients of the Spright chat components have created custom tool summaries for their applications. These components unify the presentation of tool-call status.

### Containing Library

These components will go in Spright along with existing chat components.

### Non-goals

The following capabilities are feature gaps compared with the React reference below:

- Presenting approval requests or rendering approval decision and preference actions. This has a complex API so is deferred to a future pass.
- Detailed execution-result presentation, including commands, working directories, exit metadata, and standard output streams.
- Live-output management, truncation, and full-output expansion.
- Rich result presentation such as diffs, plans, raw payloads, and optional Nigel plot content.
- Presenting interactive user-input and MCP elicitation requests or their results.

### Features

- Compact status presentation for an ordered group of tool call children.
- A separately reusable child for one tool call, with individual attributes and properties for its runtime state and invocation input.
- Expandable grouped status presentation with disclosure behavior that is accessible by keyboard.
- Pending, success, warning, error, canceled, declined, and terminated states.
- User-visible labels supplied by a chat label provider so applications can localize or replace them.

### Risks and Challenges

- The React implementation has a much larger capability surface than the Angular summary. The shared API therefore starts with the overlapping status, identity, and invocation-input capabilities.

### Prior Art/Examples

- [Angular implementation with grouped calls](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=/Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/nigel/src/components/sl-nigel-tool-call-summary/)
- [React implementation with detailed calls](https://github.com/ni/testhub/blob/main/src/frontend/packages/chat-ui/src/ToolCallMessage.tsx)

## Design

A customer can use the components together like this:

```html
<spright-chat-message-tool-summary>
    <spright-chat-tool-call
        name="query_assets"
        status="pending">
    </spright-chat-tool-call>
    <spright-chat-tool-call
        name="run_command"
        status="success"
        input='{"command":"npm test"}'>
    </spright-chat-tool-call>
</spright-chat-message-tool-summary>
```

The parent defaults to a collapsed summary of all slotted calls. Each child can also be used independently when an application needs status presentation for one call. The parent observes the individual child attributes and properties and derives count and aggregate state from them.

### API

_The key elements of the public API surface are described separately for each component._

#### Chat message tool summary

- _Tag_: `spright-chat-message-tool-summary`
- _Props/Attrs_:
    - `expanded` - boolean, default `false`; controls whether the grouped child list is shown. User toggles are reflected to the property and attribute.
- _Methods_
- _Events_
- _Slots_
    - `(default)` - ordered `spright-chat-tool-call` child elements. Unrelated slotted nodes are ignored for count and status purposes.
- _CSS Classes, Parts, and CSS Custom Properties that affect the component_
    - No public CSS parts.

The parent does not participate in forms or delegate focus. Focus belongs to its internal disclosure and action controls.

#### Tool call

- _Tag_: `spright-chat-tool-call`
- _Props/Attrs_:
    - `name` - string attribute and property identifying the tool and providing its visible label. Clients should assign the localized display value when needed.
    - `status` - string attribute and property. Supported values are `pending`, `success`, `warning`, `error`, `canceled`, `declined`, `terminated`, and `unknown`.
    - `input` - independent property containing the invocation input. It is not serialized as an attribute.
- _Methods_
    - None. The child has no independent disclosure or action methods.
- _Events_
    - None.
- _Slots_
    - None. The status icon, label, and invocation input presentation are built into the component.
- _CSS Classes, Parts, and CSS Custom Properties that affect the component_
    - No public CSS parts.
    - Internal rows use available inline size, wrap long invocation expressions, and do not require a fixed height.
    - The component should not expose internal implementation classes as API.

The child does not participate in forms or delegate focus. It has no internal disclosure or action events in the initial scope. No event is emitted merely because one child value changes.

`status` supports `pending`, `success`, `warning`, `error`, `canceled`, `declined`, `terminated`, and `unknown`. `complete` is not exposed as a status value; a call with no completion data can use `success` or `unknown` while the application determines its final state. Status names follow the Spright guidance and avoid abbreviations.

The initial shared API normalizes each framework's tool identity and invocation input into the individual attributes and properties listed above. Each framework adapter owns transport-specific mapping before assigning the child values.

#### API Alternatives

A single element with an `entries` property was rejected because it makes the structured model harder to compose declaratively and forces framework wrappers to manage all child identity and the lifecycle of each call. A child component lets applications update one live call without replacing the entire group.

Using one JSON `data` attribute or object property was rejected because it is harder to bind safely from Angular and Blazor and conflicts with the guidance for primitive attributes.

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
 +- invocation input
 +- footer
```

Slotted children are rendered in DOM order. Canceled children are visually de-emphasized and have an equivalent text status; status must never be conveyed by color or decoration alone.

### Native form integration

N/A. This is a status and disclosure component that does not accept input. The component does not own form values.

### Angular integration

Add Angular wrappers/directives for both elements. The message wrapper should participate in the same conversation/message APIs as inbound and outbound messages, project `SlNigelToolCall` children into the default slot, and avoid binding an `entries` object. Each child wrapper assigns the individual normalized properties. No `ControlValueAccessor` is needed.

The Angular adapter should transform each existing `ToolCallEntry` into the child's individual properties, preserving grouped order. `ToolCallSummary` becomes the parent plus one child per entry. Approval prompts and detailed execution-result views remain outside this shared component and are owned by the application.

### Blazor integration

Add Blazor wrappers for the message and child. The message participates in the same conversation/message composition as inbound and outbound messages and accepts projected child components. The child accepts individual parameters corresponding to `CallId`, `Name`, `Status`, and `Input`. Assign complex values through JS interop rather than serialize them into HTML attributes.

No form integration is needed. Unknown data must not be rendered as executable markup.

### Visual Appearance

Visual Design must define the parent's summary and the child's status-row presentation, all status states, long names and invocation expressions, empty input, and narrow widths. The compact Angular summary uses a connected list treatment and monospace tool expressions.

The default presentation should be neutral and fit both light and dark Spright themes. Status colors require text or icons with sufficient contrast and must be paired with labels. Canceled and declined states should not rely only on strikethrough.

### Interactions

- The header is a disclosure button with `aria-expanded` and `aria-controls` when expandable.
- The parent summary starts collapsed by default.

## Implementation

Implement both elements with FAST Element. Use a custom parent template for the grouped disclosure and a custom child template for the status row. Use the existing button, icon, spinner, and relevant text primitives inside the templates.

Keep status normalization and display formatting in small pure utilities. Do not embed parsing for a specific transport in the component. The child should tolerate missing values, unsupported status strings, and malformed input by falling back to `unknown` or a safe string representation. The parent should tolerate unrelated slotted nodes and children without a valid status.

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
- Use an ordered or unordered list with list semantics for grouped entries. Keep tool expressions selectable and wrap long text.
- Do not rely on hover-only controls. The disclosure affordance and status remain visible or available to keyboard and touch users.
- Respect `prefers-reduced-motion`; no motion is required for status changes or expansion. Any permitted opacity transition must be removed or reduced when that setting is enabled.
- Ensure all status colors and focus indicators meet Spright contrast requirements.

### Mobile

The component uses available width and wraps invocation expressions and labels. The header remains a touch target that fills the available width, with a minimum control height.

### Globalization

All user-visible labels, including the count, pending and completed states, expanded and collapsed states, canceled state, and status labels, must come from a chat label provider. The provider supplies default labels that client applications can localize or replace. Use logical CSS properties and `text-align: start`; do not assume LTR ordering. Invocation input remains in its supplied representation and is not localized.

### Security

Treat input and tool identity values as untrusted data. Render them as text, never as HTML. Do not execute commands, URLs, markdown, or embedded SVG from child data.

### Performance

The child should update only the affected status row when an individual property changes. Avoid serializing large input values during every render.

The parent should observe slot changes and preserve DOM order. Duplicate child data IDs should not throw; generated internal IDs may be used for ARIA relationships.

### Dependencies

- `@ni/fast-element` and the existing component primitives used by the chat message family.
- No dependency on chat transport, markdown, diff, or approval policy.
- No new external dependency is planned.

### Test Plan

- Unit tests for parent empty, pending, settled, canceled, disabled, and invalid child states.
- Unit tests for child invocation-input formatting and labels.
- Unit tests for disclosure keyboard behavior, ARIA attributes, and focus behavior.
- Security tests confirming input and tool identity are rendered as text rather than interpreted as HTML or SVG.
- Chromatic/Storybook coverage for summary and status-row usage, themes, narrow widths, long content, and every status.
- Angular and Blazor wrapper tests verifying individual property assignment.

### Tooling

Add both components to `src/all-components.ts`, the generated custom-elements manifest, Storybook, and the component status table. Add page objects and unit test folders following Spright conventions. Provide stories that exercise the individual child properties.

### Documentation

Document the primitive attributes, individual child properties and their types, parent/child examples, and the security boundary around untrusted tool data. Add framework examples for Angular, React, Blazor, and plain HTML. Include a migration note explaining how the Angular `ToolCallSummary` and React `ToolCallMessage` models map to slotted children and the shared normalized properties.

## Open Issues

- Confirm the final public names `spright-chat-message-tool-summary` and `spright-chat-tool-call` with the Spright maintainers.
- Approval actions, detailed execution results, live-output handling, rich result views, and interactive follow-up presentation are out of scope for the initial shared component.
- Confirm whether future richer result components should remain separate from this status-only component.
- Complete Interaction Design, Visual Design, accessibility review, and security review before marking the component ready for general use.
