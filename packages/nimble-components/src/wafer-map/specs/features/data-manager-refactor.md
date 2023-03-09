# Nimble Wafer Map ataManager Refactor

## Problem Statement

In the current implementation, the WaferMap component initializes the `DataManager`, and the rest of the modules each time an input is changed.
This is not optimal and causes unwanted computation time especially when zooming on the wafer.

We need an optimal way to refresh the rendering and the metadata based on the changed inputs.
In the following image the inputs and the chain of change dispersion inside the wafer are displayed.

![Input dependencies](resources/input_dependencies.png)

Based on this visualization a new method for recalculating only the needed data can be devised.

## Links To Relevant Work Items and Reference Material

[Wafer Map Spec](../README.md)

## Implementation / Design

## Alternative Implementations / Designs

### Public Update Methods

The `DataManager` will expose public methods for updating the internal state.
These methods will form a hierarchy and will call other methods themselves.

For example:

```TS
// top level function; will call update scales
public updateMargin(): void {
    ...
    this.updateScales();
}

// lower level function; will call update labels
public updateScales(): void;
...
```

When input change, the callbacks can call the methods themselves and the `DataManager` will get updated and not re-initialized.

The downsides to this method are keeping an up to date hierarchy and the level at which every input exerts it's change and given multiple input changes in a small time frame the computation effort will be increased compared to the current method.

### Tagged Pooling

For fixing the multiple input changes in a short period of time we can create a tagging system for queueing updates. The tags will represent the impact of the input in the propagation of change. Each queueing request will update the scope of the update based on the highest tag in the pool of input changes.

```TS
private queueDataUpdate(tag: number): void {
    if (!this.updateQueued) {
        this.updateQueued = true;
        this.updateTag = tag;
        DOM.queueUpdate(() => this.dataUpdate());
    }
    else {
        if (tag > this.updateTag) {
            this.updateTag = tag;
        }
    }
}
```

This approach still needs an up-to-date record of input impact over the changes. This can be implemented as part of the `DataManager` or as part of the main wafer class if we make public update functions.

### Observable Properties

Another option to consider is saving the intermediary computations as observable properties which can be subscribed to by the impacted methods or modules. This creates a flexible hierarchy in which changes will propagate to the impacted components based on each module's list of observed properties.

The downsides to this are again debouncing multiple input changes and the possibility of creating dependency cycles and delayed propagation.

## Open Issues
