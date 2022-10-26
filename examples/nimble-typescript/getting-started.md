# Nimble Typescript Getting Started

This example project creates a simple counter application using Vanilla (no framework) Typescript and the Nimble Design System.

## Start

Use the Stackblitz link to launch the starting point of the example.
Start Example:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ni/nimble/tree/typescript-example/examples/nimble-typescript/start?file=package.json)

## Finish

Incorporate Nimble to use the components and style provided by Nimble.

Add the bundled distribution file to the head tag of `index.html`.

```html
<html>
    <head>
    ...
     <script src="https://unpkg.com/@ni/nimble-components/dist/all-components-bundle.min.js"></script>
   ...
    </head>
</html>
```

Swap the `<button>` for `<nimble-button>`
Before

```html
 <button id="counter" type="button"></button>
 ```

After

```html
 <nimble-button id="counter" type="button"></nimble-button>
 ```



Finished Example:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ni/nimble/tree/typescript-example/examples/nimble-typescript/start?file=package.json)