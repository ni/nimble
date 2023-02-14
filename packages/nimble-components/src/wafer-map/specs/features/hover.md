# Nimble Wafer Map Hover Die

## Problem Statement

Besides zooming and panning, the wafer map component needs to support another user interaction, namely hovering.
This interaction will mark the die beneath the cursor to allow the user to highlight the specific desired value.
More so, the interaction will trigger a custom external event containing the data from the highlighted die
and will also provide the latest highlighted die data to an interface output.
This will allow the wafer map to act as a selector for the provided dies
and could be used for displaying a custom tooltip or other external custom features.

## Links To Relevant Work Items and Reference Material

[Wafer Map Spec](../README.md)

## Implementation / Design

![hover Selected Die Prototype](resources/highlight.png)

### Detection

A new event handler will be created under the event coordinator along with the zoom handler.

This will create mouse move events for the wafer map component which will trigger on hover.

The event handlers will use the mouse position and the canvas '2d' context to filter out use cases.
when the mouse does not hover on top of a colored die.

After passing this filter it will calculate the position of the die relative to the canvas and calculate the
respective coordinates of the die from the input list.

The die coordinates will be then used to locate the original die data in a new Map data structure inside the Data Manager Module.

### Highlight

The highlight of the specific die will be implemented using a svg rectangle which will be a part of the template.

```HTML
<div class="wafer-map-container">
    <svg class="svg-root"></svg>
    <canvas></canvas>
    <svg class="hover-layer">
        <rect style="fill:transparent;stroke:white;stroke-width:2px;outline-style:solid;outline-color:green;" ${ref('rect')} />
    </svg>
</div>
```

This rectangle will be hidden when no highlight events are triggered, and will be displayed above the canvas element when they are.

The rectangle will be resized based on the die dimensions calculated for the input and the zoom transform.

The rectangle will be moved to the specific die coordinates detected previously.

Because the rectangle will be displayed on top of the canvas it will have all pointer events disabled to not block the zooming and panning events.

The rectangle will be transparent and it will have a colored border and outline to highlight the desired die.

### Custom Events

The hover will trigger a outward facing custom event which will contain the data of the highlighted die and will enable the user to subscribe to the hover changes.
This event will also have testing purposes for the hover functionality.

Another output will be a public observable property which will contain the data of the highlighted die from the wafer map.
This will allow for discreet querying of the wafermap about the hover state without the need of subscribing to the custom event.

## Alternative Implementations / Designs

## Open Issues
