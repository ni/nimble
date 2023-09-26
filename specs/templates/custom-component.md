# Nimble Component Name [Template]

## Overview

*The name of the component, along with a high-level description.*

### Background

*Relevant historical or background information*
*Link to Interaction Design spec*
*Link to Visual Design spec*
*Link to relevant work items, related existing issues, etc.*

### Non-goals

*A list of use cases, features, or functionality which are **not** goals for the component.*
  
### Features

*A list of the key features unique to this component.*

### Risks and Challenges

*Notable risks or challenges associated with implementing the component. Would we need to make any breaking changes in order to achieve this component's goals?*

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

*Consider high and low-level APIs. Attempt to design a powerful and extensible low-level API with a high-level API for developer/designer ergonomics and simplicity.*

### Anatomy 

*Outline the component structure with a diagram of its visual tree (shadow dom). Enumerate key areas of visual customization, such as:*

- *Slot Names*
- *Host Classes*
- *Slotted Content/Slotted Classes*
- *CSS Parts*

*Work closely with the visual design partner to co-develop the API and anatomy along side the visual design.*

### Third Party Library Considerations

*When applicable provide a list of third party libraries that are either intended to be leveraged, or were considered but discounted. Provide any reasoning that supports either decision. If no third party libraries were considered, provide a quick note explaining why such an evaluation was unnecessary.*

*Information of interest regarding third party libraries includes:*
    - *APIs we intend to use/considered using.*
    - *Size of library.*
    - *Licensing/Testing/Maturity/Stability/Security.*

### Angular integration 

*Describe the plan for Angular support, including directives for attribute binding and ControlValueAccessor for form integration. Depending on the contributor's needs, implementing Angular integration may be deferred but the initial spec should still document what work will be needed.*

### Blazor integration 

*Describe the plan for Blazor support. See the [nimble-blazor CONTRIBUTING.md](/packages/nimble-blazor/CONTRIBUTING.md) for details. Depending on the contributor's needs, implementing Blazor integration may be deferred but the initial spec should still document what work will be needed.*

### Visual Appearance

*Work with Visual Design to create Figma files and other design assets. Be sure to account for the various component states, including hover, active, etc. as well as validity, and appearance variants.*

---

## Implementation

*Important aspects of the planned implementation with careful consideration of web standards and integration.*

*Highlight any alternative implementations you considered in each section.*

*If you think a section doesn't apply or don't know what to write, please DO NOT delete it. Either mark it "N/A" or leave it blank and the Nimble team can help you fill it in.*

### States

*Key component states, valid state transitions, and how interactions trigger a state transition.*

### Accessibility

*Consider the accessibility of the component, including:*

- *Keyboard Navigation and Focus*
- *Form Input and Autofill*
- *Use with Assistive Technology. For example:*
  - *All components should define a role and support labels / being labelled so that assistive technology can identify them*
  - *The implications shadow dom might have on how roles and attributes are presented in the accessibility tree*
  - *Components which delegate focus require all global ARIA attributes to be enumerated*
- *Behavior with browser configurations like "Prefers reduced motion"*

### Mobile

*Consider how the component will behave on mobile devices, including:*

- *Overflow behavior when screen space is constrained*
- *Interactions that are affected by touch rather than a pointer device (e.g. hover)*
- *Integration with common mobile experiences like native pickers, on-screen keyboards, and dictation*

### Globalization

*Consider whether the component has any special globalization needs such as:*

- *Special RTL handling*
- *Swapping of internal icons/visuals*
- *Localization*

### Security

*Are there any security implications surrounding the component?*

### Performance

*Are there any performance pitfalls or challenges with implementing the component?*

### Dependencies

*Will implementing the component require taking on any dependencies?*

- *3rd party libraries*
- *Upcoming standards we need to polyfill*
- *Dependencies on other fast components or utilities*

*Do any of these dependencies bring along an associated timeline?*

### Test Plan

*What is the plan for testing the component, if different from the normal path? Note that the normal plan includes unit tests for basic state/behavior as well as end-to-end tests to validate the specific user stories described above.*

### Tooling

*Are there any special considerations for tooling? Will tooling changes need to be made? Is there a special way to light up this component in our tooling that would be compelling for developers/designers?*

### Documentation

*What additions or changes are needed for user documentation and demos? Are there any architectural/engineering docs we should create as well, perhaps due to some interesting technical challenge or design decisions related to this component?*

---
## Open Issues

*Highlight any open questions for discussion during the spec PR. Before the spec is approved these should typically be resolved with the answers being incorporated in the spec document.*