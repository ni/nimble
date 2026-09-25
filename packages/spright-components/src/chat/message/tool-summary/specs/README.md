# Chat Tool Status

## Overview

`spright-chat-message-tool-summary` is a chat message type that presents the status of one or more tool calls invoked during a chat turn. It uses a reusable `spright-chat-tool-call` child component to represent each tool call.

### Background

Multiple users of the Spright chat components have created custom tool summaries for their applications. These components unify the presentation of tool-call status and details.

### Containing Library

These components will go in Spright along with existing chat components.

### Non-goals

- **Feature gap vs. the testhub reference:** presenting approval requests or rendering approval decision and preference actions. This has a complex API so is deferred to a future pass.
- **Feature gap vs. the testhub reference:** rendering optional Nigel plot content. This capability seems outside the core purpose of this component so needs further research.

### Features

- Compact status presentation for an ordered group of tool call children.
- A separately reusable child for one tool call, with individual attributes and properties for its runtime state and detailed disclosure.
- Expandable details with disclosure behavior that is accessible by keyboard.
- Pending, success, warning, error, canceled, declined, and terminated states.
- Declarative display of command, arguments, result, working directory, duration, exit code, stdout, stderr, diffs, plans, and raw payloads.
- Output is shown in a short, truncated form by default, with an action to expand and show the complete output. Live output is also supported.
- User-input and MCP elicitation request/result presentation.
- User-visible labels supplied by a chat label provider so applications can localize or replace them.

### Risks and Challenges

- The React implementation has a much larger capability surface than the Angular summary. One large object would be difficult to use and would violate the custom element API guidance. The child therefore exposes each tool call value as its own attribute or property, while the parent composes children through the default slot.
- Live output can update frequently. Rendering and scrolling must avoid rebuilding expensive content unnecessarily and must preserve the user's intentional scroll position.
- Large output and raw payloads can make the component expensive and expose sensitive information. Output is limited by default, and raw payload display must be enabled explicitly.

### Prior Art/Examples

- [Angular implementation with grouped calls](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=/Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/nigel/src/components/sl-nigel-tool-call-summary/)
- [React implementation with detailed calls](https://github.com/ni/testhub/blob/main/src/frontend/packages/chat-ui/src/ToolCallMessage.tsx)

## Design

A customer can use the components together like this:

```html
<spright-chat-message-tool-summary id="tool-summary">
    <spright-chat-tool-call
        name="query_assets"
        status="pending">
    </spright-chat-tool-call>
    <spright-chat-tool-call
        name="run_command"
        status="success"
        command="npm test"
        stdout="All tests passed"
        exit-code="0"
        duration-ms="842">
    </spright-chat-tool-call>
</spright-chat-message-tool-summary>
```

The parent defaults to a collapsed summary of all slotted calls. Each child can also be used independently when an application needs the detailed presentation for one call. The parent observes the individual child attributes and properties and derives count and aggregate state from them.

### API

_The key elements of the public API surface are described separately for each component._

API evidence: `🔗` required to cover capabilities evidenced by both references, even when the references use different APIs; `🅰️` required only by the Angular reference; `⚛️` required only by the React reference; and `💭` speculative, with no clear reference capability requiring it.

#### `spright-chat-message-tool-summary`

- _Component Name_: Class `ChatMessageToolSummary`, tag `spright-chat-message-tool-summary`, exported tag constant `chatMessageToolSummaryTag` 💭
- _Props/Attrs_:
    - `expanded` - boolean, default `false`; controls whether the grouped child list is shown. User toggles are reflected to the property and attribute. 🔗
    - `disabled` - boolean, default `false`; prevents the grouped disclosure while retaining readable status content. It does not disable child actions. 💭
- _Methods_
    - None. User interaction controls the grouped disclosure, and the host can set `expanded` when it needs to control the state programmatically. 🔗
- _Events_
    - None. Expansion is an internal interaction unless the host sets `expanded` directly. 🔗
- _Slots_
    - `(default)` - ordered `spright-chat-tool-call` child elements. Unrelated slotted nodes are ignored for count and status purposes. 💭
- _CSS Classes, Parts, and CSS Custom Properties that affect the component_
    - No public CSS parts. Initial custom properties should be limited to layout and output constraints agreed with Visual Design, for example `--spright-chat-message-tool-summary-output-max-height`. 💭
    - The host's native `display`, `width`, `max-width`, `margin`, and `padding` properties affect the outer component. The component should not expose internal implementation classes as API. 🔗

The parent does not participate in forms or delegate focus. Focus belongs to its internal disclosure and action controls.

#### `spright-chat-tool-call`

- _Component Name_: Class `ChatToolCall`, tag `spright-chat-tool-call`, exported tag constant `chatToolCallTag` 💭
- _Props/Attrs_:
    - `expanded` - boolean, default `false`. 🔗
    - `disabled` - boolean, default `false`. 💭
    - `show-raw-payload` - boolean, default `false`. ⚛️
    - `max-output-length` - number, default `480`. ⚛️
    - `call-id` - string property used in event details. It defaults to the host element's `id` when omitted. 🔗
    - `name` - string attribute and property identifying the tool and providing its visible label. Clients should assign the localized display value when needed. 🔗
    - `status` - string attribute and property. Supported values are `pending`, `success`, `warning`, `error`, `canceled`, `declined`, `terminated`, and `unknown`. 🔗
    - `input` - independent property containing the invocation input. It is not serialized as an attribute. 🔗
    - `result` - independent property containing completion data. It is not serialized as an attribute. ⚛️
    - `command` and `working-directory` - independent command and location properties. The client resolves any argument vector into the display command before assigning `command`. ⚛️
    - `stdout`, `stderr`, `exit-code`, and `duration-ms` - independent completion properties. `stdout` and `stderr` also accept the current values while a call is streaming. ⚛️
    - `stdout-truncated` and `stderr-truncated` - independent properties indicating that earlier streaming output was truncated. ⚛️
    - `question`, `elicitation`, `diff`, `plan`, and `raw-payload` - independent properties for their respective detail sections. Each property may be absent without affecting the others. ⚛️
- _Methods_
    - None. User interaction controls the detail disclosure, and the host can set `expanded` when it needs to control the state programmatically. 🔗
- _Events_
    - `output-expand` - fired when the user requests full output. Its detail is `{ callId: string; stream: 'stdout' | 'stderr' }`. 💭 The underlying full-output control is ⚛️.
- _Slots_
    - None. The status icon, disclosure control, output, diff, plan, question, elicitation, and raw payload presentation are built into the component. 🔗
- _CSS Classes, Parts, and CSS Custom Properties that affect the component_
    - No public CSS parts. Colors, typography, borders, and spacing are implementation details. 💭
    - Internal rows use available inline size, wrap long commands and expressions, and do not require a fixed height. `overflow` on the host does not replace scrolling in output regions with a maximum height. 🔗
    - The component should not expose internal implementation classes as API. 🔗

The child does not participate in forms or delegate focus. Focus belongs to its internal disclosure and action controls. Events should be composed and bubble so framework wrappers can listen on the custom element. No event is emitted merely because one child value changes.

`status` supports `pending`, `success`, `warning`, `error`, `canceled`, `declined`, `terminated`, and `unknown`. `complete` is not exposed as a status value; a call with no result can use `success` with an absent result or `unknown` while the application determines its final state. Status names follow the Spright guidance and avoid abbreviations.

The initial shared API intentionally normalizes the React implementation's snake_case transport fields (`tool_name`, `exit_code`, and similar) into the individual attributes and properties listed above. Each framework adapter owns that mapping before assigning the child values.

#### API Alternatives

A single element with an `entries` property was rejected because it makes the structured model harder to compose declaratively and forces framework wrappers to manage all child identity and the lifecycle of each call. A child component lets applications update one live call without replacing the entire group and makes the detailed React capability independently reusable.

Using one JSON `data` attribute or object property was rejected because it is hard to bind safely from Angular and Blazor, cannot represent live output and callbacks ergonomically, and conflicts with the guidance for primitive attributes.

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
|  +- disclosure control
 +- details
|  +- command / plan / question / elicitation sections
|  +- output
|  +- diff and raw payload sections
 +- footer
```

Slotted children are rendered in DOM order. Canceled children are visually de-emphasized and have an equivalent text status; status must never be conveyed by color or decoration alone.

### Native form integration

N/A. This is a status and disclosure component that does not accept input. The component does not own form values.

### Angular integration

Add Angular wrappers/directives for both elements. The message wrapper should participate in the same conversation/message APIs as inbound and outbound messages, project `SlNigelToolCall` children into the default slot, and avoid binding an `entries` object. Each child wrapper assigns the individual normalized properties and re-emits typed events. No `ControlValueAccessor` is needed.

The Angular adapter should transform each existing `ToolCallEntry` into the child's individual properties, preserving grouped order. `ToolCallSummary` becomes the parent plus one child per entry. Approval prompts remain outside this shared component and are owned by the application.

### Blazor integration

Add Blazor wrappers for the message and child. The message participates in the same conversation/message composition as inbound and outbound messages and accepts projected child components. The child accepts individual parameters corresponding to `CallId`, `Name`, `Status`, `Input`, `Result`, `Command`, `Stdout`, `Stderr`, `ExitCode`, `DurationMs`, `Expanded`, `Disabled`, `ShowRawPayload`, and `MaxOutputLength`. Assign complex values through JS interop rather than serialize them into HTML attributes. Expose callbacks for `ExpandedChange` and `OutputExpand`.

No form integration is needed. The wrapper should preserve arbitrary entry metadata only if the application requires it; unknown data must not be rendered as executable markup.

### Visual Appearance

Visual Design must define the parent's summary and the child's detail presentation, all status states, long names and commands, empty output, output truncation, raw payload, diff and plan sections, and narrow widths. The compact Angular summary uses a connected list treatment and monospace tool expressions; the child detail view uses a status icon, readable primary label, optional subtitle, and output regions styled for code.

The default presentation should be neutral and fit both light and dark Spright themes. Status colors require text or icons with sufficient contrast and must be paired with labels. Canceled and declined states should not rely only on strikethrough.

### Interactions

- The header is a disclosure button with `aria-expanded` and `aria-controls` when expandable.
- The parent summary starts collapsed by default.
- A child is expandable when command, result, output, question, elicitation, diff, plan, or raw payload content exists. If no detail exists, its header is not presented as an actionable disclosure.
- Live stdout and stderr follow the end of the stream while the user remains at the end. Once the user scrolls away, updates do not force-scroll the region.
- Output longer than `max-output-length` is shown in a short, truncated form with a button or equivalent control to expand and show the complete value. The host may update the child with the full output.
- Escape closes an open detail panel when focus is inside the component, without canceling a tool.

## Implementation

Implement both elements with FAST Element. Use a custom parent template for the grouped disclosure and a custom child template for the status header and optional content sections. Use the existing button, icon, spinner, and relevant text primitives inside the templates.

Keep status normalization and display formatting in small pure utilities. Do not embed parsing for a specific transport in the component. The child should tolerate missing values, unsupported status strings, malformed input, and raw payloads that cannot be serialized by falling back to `unknown`, an empty section, or a safe string representation. The parent should tolerate unrelated slotted nodes and children without a valid status.

### States

- Empty: no tool call children; render no misleading status and no expandable control.
- Pending: at least one slotted child is pending; show the label for the pending state or the tool name.
- Settled summary: all children have terminal states; show `Called 1 tool` or `Called N tools`, with the ordered list available on expansion.
- Detail pending: command or tool name is shown, with live output and question controls as available.
- Detail settled: show the normalized terminal status, result content, and metadata such as exit code and duration.
- Canceled, declined, terminated, warning, and error: show explicit text and status icon. The component remains readable when details are unavailable.
- Disabled: disclosure and action controls are disabled, but status and already-available details remain visible.
- Invalid: invalid configuration does not throw. Unknown statuses render as `unknown`; negative output limits use the default; unrelated slotted nodes and children without a valid status are ignored by the parent.

### Accessibility

- Use a native `<button type="button">` for the disclosure and native buttons for all actions.
- Provide an accessible name for the status and include canceled, declined, or terminated text in the accessible content.
- Use `aria-expanded` and `aria-controls` for disclosure. Do not place `aria-expanded` on a non-interactive container.
- Use an ordered or unordered list with list semantics for grouped entries. Keep tool expressions selectable and wrap long text.
- Give stdout and stderr regions accessible labels. Preserve keyboard scrolling when output is live or limited to a maximum size.
- Do not rely on hover-only controls. The disclosure affordance and status remain visible or available to keyboard and touch users.
- Respect `prefers-reduced-motion`; no motion is required for status changes or expansion. Any permitted opacity transition must be removed or reduced when that setting is enabled.
- Ensure all status colors and focus indicators meet Spright contrast requirements.

### Mobile

The component uses available width and wraps commands, expressions, paths, and labels. Output regions scroll horizontally or vertically only where necessary and have a stable maximum height. The header remains a touch target that fills the available width, with a minimum control height.

### Globalization

All user-visible labels, including the count, pending and completed states, expanded and collapsed states, canceled state, output, and status labels, must come from a chat label provider. The provider supplies default labels that client applications can localize or replace. Use logical CSS properties and `text-align: start`; do not assume LTR ordering. JSON, command, path, and raw payload content remains in its supplied representation and is not localized.

### Security

Treat all input, result, output, raw payload, command, path, URL, and metadata values as untrusted text. Render them as text, never as HTML. Do not execute commands, URLs, markdown, or embedded SVG from child data.

Raw payload display should require explicit activation and should have a maximum size. Applications should avoid passing secrets when they are not needed for diagnosis.

### Performance

The child should update only affected output regions when an individual property changes. Avoid serializing large values during every render; format input and raw payload lazily when their sections are expanded. Limit visible output by default. Do not use stylesheet behavior changes for output that changes frequently.

The parent should observe slot changes and preserve DOM order. Duplicate child data IDs should not throw; generated internal IDs may be used for ARIA relationships.

### Dependencies

- `@ni/fast-element` and the existing component primitives used by the chat message family.
- No dependency on chat transport, markdown, diff, or approval policy.
- No new external dependency is planned.

### Test Plan

- Unit tests for parent empty, pending, settled, canceled, disabled, and invalid child states.
- Unit tests for child tool expression formatting, JSON input truncation, and labels.
- Unit tests for disclosure keyboard behavior, ARIA attributes, focus behavior, and event details.
- Unit tests for stdout/stderr truncation, live output scrolling, explicitly enabled raw payload display, plans, diffs, questions, and elicitation results.
- Security tests confirming input and output are rendered as text rather than interpreted as HTML or SVG.
- Chromatic/Storybook coverage for summary and detail child usage, themes, narrow widths, long content, and every status.
- Angular and Blazor wrapper tests verifying individual property assignment and event translation.

### Tooling

Add both components to `src/all-components.ts`, the generated custom-elements manifest, Storybook, and the component status table. Add page objects and unit test folders following Spright conventions. Provide stories that exercise individual child properties and the separate properties for complex values.

### Documentation

Document the primitive attributes, individual child properties and their types, event detail types, parent/child examples, and the security boundary around untrusted tool data. Add framework examples for Angular, React, Blazor, and plain HTML. Include a migration note explaining how the Angular `ToolCallSummary` and React `ToolCallMessage` models map to slotted children and separate normalized child properties.

## Open Issues

- Confirm the final public names `spright-chat-message-tool-summary` and `spright-chat-tool-call` with the Spright maintainers.
- Approval actions are out of scope for the initial shared component. Applications own approval prompts and authorization decisions outside this component.
- Decide whether rich diff, plan, question, and MCP elicitation rendering is in scope for the initial visual design or should be deferred from the first release.
- Define the exact types for the `question`, `elicitation`, and `plan` properties with the consuming teams.
- Decide whether the parent should ever provide an optional detail mode or remain summary-only while the child owns detail presentation.
- Define output size limits and whether the host may request an unbounded output view.
- Complete Interaction Design, Visual Design, accessibility review, and security review before marking the component ready for general use.
