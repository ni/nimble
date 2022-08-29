# Blazor Number Field

## Problem Statement

The NumberField presents an array of exposure options in a .NET environment. Here is at least a subset of possibilities:

### Option 1: `NimbleNumberField<Int>`, `NimbleNumberField<Double>`, etc...

Pros: 
- Provides the natural API that a C# developer might expect for a numeric component.

Cons:
- Assymetric API to what the JS `nimble-number-field` offers, which has no concept of various numeric types.

### Option 2: `NimbleNumberField` (no generics)

Pros:
- Symmetrical API to JS `nimble-number-field`
- Simple implementation strategy

Cons:
- Not leveraging possible client expectations for numeric type support

## Links To Relevant Work Items and Reference Material

*Include links to the work items this design addresses.*
*Include links to any other meaningful reference material.*

## Implementation / Design

*Describe the implementation and what systems will be affected. Items to consider include:*
   - *Does the design follow an existing design in this codebase or FAST?*
   - *Does the design align with web standards like web components, ARIA, etc?*
   - *Does the design create new requirements on clients or break any APIs?*
   - *How does the design affect testing, documentation, performance, security, etc?*

## Alternative Implementations / Designs

*Describe any design alternatives and discuss why they were rejected.*

## Open Issues

*Describe any open issues with the design that you need feedback on before proceeding.*
*It is expected that these issues will be resolved during the review process and this section will be removed when this documented in pulled into source.*
