# Blazor Number Field

## Problem Statement

The NumberField presents an interesting array of exposure options in a .NET environment. Here is at least a subset of possibilities:
1. Provide a generic-typed interface ala `NumericTextField<Int>`, thereby leveraging the Blazor means of supplying generic type parameters
to Razor files.
    - This approach creates a notable difference in usage between different UI frameworks. Blazor apps would be able to deal in specific
    numeric types, while JS-based frameworks would not. One of the consequences of this could be that improperly formatted values (such as
    entering "1.5" for an integer via text entry) could/should result in form invalidation.
2. Implement an API that crosses all UI frameworks allowing users to specify the desired numeric representation for the `NumberField`.
    - While this may be the most desirable approach in the long run, this seems like a potentially non-trivial effort, and shouldn't keep
    us from having a usable `NumberField` until that time.
3. Provide a `NimbleNumber

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
