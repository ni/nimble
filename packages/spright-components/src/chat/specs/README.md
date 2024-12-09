# Chat components

## Overview

This spec describes a set of components that can be used to compose a chat interface. This includes:
 - chat message: a single entry in a chat conversation, including some content and metadata about the message
 - chat conversation: a collection of messages that are laid out to convey the order the messages were sent

### Background

Some Intelligent Test application teams are beginning development on chat interfaces in early 2025.

Initial designer-vetted visual designs exist in [Nimble_Components Figma](https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=12342-81782&node-type=canvas&t=L5GvLaC3injrqWrR-0).

There is not yet an interaction design specification for these components.

This work started with an innovation project ([branch](https://github.com/ni/nimble/compare/main...spright-chat-components)) and is not yet tracked with an issue.

### Containing Library

These components will initially be added to Spright. Per [Spright contributing guidelines](/packages/spright-components/CONTRIBUTING.md):
1. there is not yet an approved interaction design
2. we are unsure if the components are sufficiently atomic or general purpose to belong in Nimble
3. there is a short development timeline so it may be necessary to defer fulfilling other Nimble requirements like accessibility and support for all frameworks

### Non-goals

The components will only provide the presentation layer, not logic for interacting with each other or any service to add messages to a conversation.

The message component will allow slotting arbitrary content, but any efforts to add content types to Nimble are out of scope of this document. For example, adding capabilities to the rich text viewer or adding styling for specific content types.
  
### Features

#### Chat message

1. Display arbitrary slotted content. For example: text, rich text, buttons, or a spinner.
1. Layout content to the right, center, or left of parent container depending on metadata about who sent the message.
1. Size based on content size with maximum width (but not height) based on parent's width.
1. Change the styling of the message depending on metadata about who sent the message. For example: render user messages in a bubble with the tail pointing to the right but render system messages with no styling.

#### Chat conversation

1. Lays out messages vertically based on their order.
1. Displays a vertical scrollbar if there are more messages than fit in the height allocated to the conversation.
1. Only appearance of its own is to set a background color.

### Risks and Challenges

These components are competing against possible implementations within applications. Depending on who implements these components, the overhead of learning the Nimble repo's tech stack could introduce a small risk.

### Prior Art/Examples

*Screenshots and/or links to existing, canonical, or exemplary implementations of the component.*

---

## Design

*Describe the design of the component, thinking through several perspectives:*

- *A customer using the component on a web page.*
- *A developer building an app with the component and interacting through HTML/CSS/JavaScript.*
- *A designer customizing the component.*

*Include code snippets showing basic component use and any interesting configurations.*

*For each section below, consider adding an "Alternatives" sub-section to describe any design alternatives and discuss why they were rejected.*

### API

*The key elements of the component's public API surface:*

- *Component Name*
- *Props/Attrs: to match native element APIs, prefer primitive types rather than complex configuration objects and expose fields as both properties on the TypeScript class and attributes on the HTML element*
- *Methods*
- *Events*
- *CSS Classes and CSS Custom Properties that affect the component*
- *How native CSS Properties (height, width, etc.) affect the component*

*Consider high and low-level APIs. Attempt to design a powerful and extensible low-level API with a high-level API for developer/designer ergonomics and simplicity.*

### Anatomy 

*Outline the component structure with a diagram of its visual tree (shadow DOM). Enumerate key areas of visual customization, such as:*

- *Slot Names*
- *Host Classes*
- *Slotted Content/Slotted Classes*
- *CSS Parts*

### Native form integration

Native form integration is not needed for these components.

### Angular integration

Angular integration has not yet been evaluated.

*Describe the plan for Angular support, including directives for attribute binding and ControlValueAccessor for form integration. Depending on the contributor's needs, implementing Angular integration may be deferred but the initial spec should still document what work will be needed.*

### Blazor integration

Blazor integration has not yet been evaluated.

*Describe the plan for Blazor support, including form integration. See the [nimble-blazor CONTRIBUTING.md](/packages/blazor-workspace/NimbleBlazor/CONTRIBUTING.md) for details. Depending on the contributor's needs, implementing Blazor integration may be deferred but the initial spec should still document what work will be needed.*

### Visual Appearance

Initial designer-vetted visual designs exist in [Nimble_Components Figma](https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=12342-81782&node-type=canvas&t=L5GvLaC3injrqWrR-0).

---

## Implementation

*Important aspects of the planned implementation with careful consideration of web standards and integration.*

*Highlight any alternative implementations you considered in each section.*

*If you think a section doesn't apply or don't know what to write, please DO NOT delete it. Either mark it "N/A" or leave it blank and the Nimble team can help you fill it in.*

### States

*Key component states, valid state transitions, and how interactions trigger a state transition.*

### Accessibility

Accessibility has not yet been evaluated.

*Consider the accessibility of the component, including:*

- *Keyboard Navigation and Focus*
- *Form Input and Autofill*
- *Use with Assistive Technology. For example:*
  - *All components should define a role and support labels / being labelled so that assistive technology can identify them*
  - *The implications shadow dom might have on how roles and attributes are presented in the accessibility tree*
  - *Components which delegate focus require all global ARIA attributes to be enumerated*
  - *Components should either follow an existing [ARIA Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/) or provide thorough research indicating why a new pattern is appropriate. Research should include sources like [Open UI Community Group](https://github.com/openui/open-ui) and other popular design systems.*
- *Behavior with browser configurations like "Prefers reduced motion"*
- *Support for standard link behaviors if the component is an anchor or contains an anchor. These behaviors are enumerated in the [anchor-patterns story](/packages/nimble-components/src/patterns/anchor/tests/anchor-patterns.mdx). The story should be updated to include the new component.*

### Mobile

Component layout will be tested at small screen sizes. The plans for content sizing and showing scrollbars should allow for adequate mobile layout.

### Globalization

The content is provided by applications so they are responsible for localization.

Defining the behavior for RTL languages is initially out of scope. But the API can easily be extended to support changing the layout for an RTL language when that is desired.

### Security

Applications are responsible for the security of the content added to messages. These components will not provide any validation or sanitization.

### Performance

Applications should consider the performance of conversations with large, complex, or numerous messages. Applications can add virtualization features like a "load more messages" button with no change to the chat components. Other virtualization features like loading more messages when scrolling near the end of a conversation should be trivial to add but are out of scope of this document.

### Dependencies

No new dependencies.

### Test Plan

Typical unit tests and Chromatic visual tests. Spright maintains the same testing standards as Nimble.

### Tooling

This is likely the first Spright components most applications will adopt so they will need to add a new dependency. Blazor applications should follow [the Spright Blazor README](https://github.com/ni/nimble/blob/spright-chat-components/packages/blazor-workspace/SprightBlazor/README.md#getting-started) to set up this dependency. 

### Documentation

Standard Storybook documentation. Since these are a Spright components we should ensure the documentation conveys 

There are parallel efforts to standardize and document other aspects of chat applications (for example the tone and language used by automated conversation participants) that are out of scope of this document.

---
## Open Issues

1. Should we introduce an input toolbar component where a user can type messages and interact with related buttons? Or should applications construct this using the existing Nimble toolbar?
   - Pros of dedicated component:
      1. consistent layout and reduced implementation effort across applications
      1. single implementation to change if requirements change
   - Pros of applications leveraging Nimble toolbar:
      1. dedicated component would require a large API surface area for configuring the visibility and enabled state of numerous buttons