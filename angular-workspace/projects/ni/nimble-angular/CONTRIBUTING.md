# Contributing to Nimble Angular

## Creating an Angular directive for a Nimble element

In order to get first-class Angular integration for our Nimble elements, we create Angular directives. Each directive targets one or more Nimble elements by their tag names. The directives allow us to specify properties and events, create good Angular form integration behavior, and extend the behavior of the Nimble elements via lifecycle hooks. 

Each Nimble element should have at least one directive which references its tag name (in the `selector` section of the `@Directive` decorator). This registers the element with Angular, so that we don't need to use the `CUSTOM_ELEMENTS_SCHEMA`. The main directive for an element should specify inputs (attributes and properties) and outputs (events). By doing this, we give Angular information about the element so that it can validate usage in Angular components. 

We can potentially create shared directives which target multiple Nimble elements in order to share logic between them.

### Angular forms integration

We can make Nimble components integrate well with Angular forms and `ngModel` binding by implementing the `ControlValueAccessor` interface on directives. 
