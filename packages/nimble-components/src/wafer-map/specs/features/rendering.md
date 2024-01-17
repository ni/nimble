# Rendering++

## Problem Statement

The problem we are addressing is the need for faster rendering in our application. Currently, the rendering process is slow and affects the overall performance of the system. This issue is particularly noticeable when dealing with large or complex datasets. Therefore, we need to design a solution that optimizes the rendering process and improves the user experience.

The proposed design should consider the following factors:

-   Efficiently handle large and complex datasets
-   Minimize rendering time and improve overall performance
-   Measure and improve performance metrics
-   Maintain compatibility with existing design patterns and web standards
-   Avoid introducing new requirements on clients or breaking any APIs
-   Address any potential impact on testing, documentation, security, and other relevant areas

By addressing these challenges, we aim to enhance the rendering capabilities of our application and provide a smoother and more responsive user interface.

## Links To Relevant Work Items and Reference Material

_Include links to the work items this design addresses._
_Include links to any other meaningful reference material._

## Implementation / Design

We will change the whole process of ingesting the data and rendering it in the canvas. The main changes are the data structures used and the process from single threaded to multi threaded.

### Data Structure and Interface

This is the proposed representation of the wafer information in memory

```TS
class WaferData {
    // the x coordinates of each column of dies
    dieColIndexArray: Int32Array;
    // the lengths of each row of dies
    rowLengthsArray: Int32Array;
    // the y coordinates of each die as a matrix row by row
    dieRowIndexLayer: Int32Array;
    // the value of each die as a matrix row by row
    dieValuesLayer: Int32Array;
    // the highlight state of each die as a matrix row by row
    dieHighlightsLayer: Int8Array;
    // extra values layers
    extraLayers : {
        name: string;
        type: string;
        buffer: TypedArray;
    }[]
}
```

It will be used to store the information and it can be transferred to a worker thread with minimal effort by copying the arrayBuffers and reconstructing the object.

Other benefits include the low access time to the values and the possibility to extend the layers of values.

The previous inputs can be adapted to this new structure to maintain backwards compatibility.

### Rendering

The rendering will also be changed to take place inside a worker thread. The worker will be responsible for parsing each layer of the data set and it will render the information contained with the specific color codes and opacity.

We will be using the [threads.js](https://threads.js.org/) library to spin up the worker and communicate with it.

The worker will function as a state automaton which will need some data after initialization, and it will render everything using an [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas).

The main thread will communicate with the worker by signaling any data changes or user events which will trigger full or partial renders.

## Alternative Implementations / Designs

### Alternative Data Structures and Interfaces

The above mentioned structure can also be implemented as an [apache arrow](https://arrow.apache.org/docs/js/index.html) table with columns and metadata.

Another option is to break each object property as a separate attribute for the wafer map component.

### Alternative Rendering

Alternatives to the described rendering are splitting the data and canvas and using multiple threads to enhance performance even more.

## Open Issues

_Describe any open issues with the design that you need feedback on before proceeding._
_It is expected that these issues will be resolved during the review process and this section will be removed when this documented in pulled into source._
