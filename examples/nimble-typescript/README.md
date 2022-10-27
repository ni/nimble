# Nimble Typescript Getting Started

This example project creates a simple counter application using Vanilla (no framework) Typescript and the Nimble Design System.

## Prerequisites

1. Install VSCode  (or your editor of choice) - https://code.visualstudio.com/  

VSCode is a free editor (borderline IDE) that is very popular in web development.

2. Install nodejs - https://nodejs.org/en/download/  

Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a web browser.

## Start

https://stackblitz.com/edit/typescript-2rzao1?file=index.ts

Use the Stackblitz link to launch the starting point of the example. You can download the example as a zip file, extract it and open it in your local editor.

![Screenshot of Download project button in StackBlitz](download-project.png)

Start Example:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ni/nimble/tree/typescript-example/examples/nimble-typescript/start)

## Finish

Incorporate Nimble to use the components and style provided by Nimble.

See the Finished Example

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ni/nimble/tree/typescript-example/examples/nimble-typescript/finish)

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

**Before**

```html
 <button id="counter" type="button"></button>
 ```

**After**

```html
 <nimble-button id="counter" type="button"></nimble-button>
 ```

Update `style.css` to use Nimble font and color tokens

```css
:root {
  font: var(--ni-nimble-body-font);
  background-color: var(--ni-nimble-application-background);
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

.main-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font: var(--ni-nimble-headline-font);
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em var(--ni-nimble-border-hover-color));
}
.logo.vanilla:hover {
  filter: drop-shadow(0 0 2em #3178c6aa);
}
```
