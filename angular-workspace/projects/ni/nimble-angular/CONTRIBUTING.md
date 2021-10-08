# Contributing to Nimble Angular

## Creating an Angular directive for a Nimble element

In order to provide first-class Angular integration for our Nimble elements, we create Angular directives. Each directive targets one or more Nimble elements by their tag names. The directives allow us to specify properties and events for binding, create good Angular form integration behavior, and extend the behavior of the Nimble elements via lifecycle hooks. 

Each Nimble element should have at least one directive which references its tag name (in the `selector` section of the `@Directive` decorator). This registers the element with Angular, so that client applications don't need to use the `CUSTOM_ELEMENTS_SCHEMA`. The main directive for an element should specify inputs (attributes and properties) and outputs (events). Inputs can use the `HostBinding` decorator to apply the property value to the Nimble element via a property or attribute. Outputs can use the `HostListener` decorator to forward the event through the directive to the consumer of the element.

We can potentially create shared directives which target multiple Nimble elements in order to share logic between them.

### Angular forms integration

We can make Nimble components integrate well with Angular forms and `ngModel` binding by implementing the `ControlValueAccessor` interface on directives. Unless custom behavior is needed, we extend Angular's built-in `ControlValueAccessor`s to target our controls.

## Testing

The Angular directives need code coverage via unit tests.
* We should test the `ControlValueAccessor` behavior:
  * Using form value binding (e.g. `[(ngModel)]` binding)
  * Using manual value binding (e.g. `[value]` and `(change)` binding)
* Any other custom behavior implemented in the directives (lifecycle hooks, new properties) should be tested.
  *  However, it shouldn't be necessary to test properties which only use a simple `HostBinding` decorator.