# Creating Storybook Component Documentation

## Getting Started

From the `nimble` directory:

1. Run `npm install`
2. Run `npm run build`
3. To view the component documentation in Storybook: `npm run storybook -w @ni/nimble-components`

## Documentation Workflow
Add a `docs.description.component` string to the component `parameters` object. E.g.

```ts
const metadata: Meta<ComponentArgs> = {
    title: 'SomeComponent',
    parameters: {
        docs: {
            description: {
                component: '**Some component description**'
            }
        },
        ...
```

If the component has a [W3C ARIA description](https://w3c.github.io/aria-practices/), consider using that to describe the component purpose.

### Markdown

The description supports Markdown, so can link to other documents or components. E.g.

```md
[Links to a specific documentation page](?path=/docs/some--id)
[Links to a specific story canvas](?path=/story/some--id)
```

All other Markdown formatting is supported. See any [Markdown Cheatsheet](https://www.markdownguide.org/cheat-sheet/) for more information.

### Testing 

When you run Storybook (See **Getting Started** above), you should see the component description within the **Docs** tab. E.g. 

![DocsPage overview](/packages/nimble-components/docs/docsPage-overview.png)

