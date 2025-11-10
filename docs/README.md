# AI Assistant Documentation for Nimble

This directory contains documentation specifically formatted to help AI code generation tools like GitHub Copilot generate better code using the Nimble Design System.

## Files

### For Repository-Level Copilot Integration

- **`../.github/copilot-instructions.md`** - GitHub Copilot custom instructions for this repository. This file is automatically used by Copilot when working in this repository.

### For Copying to Your Application

The following files can be copied to your application repository to help AI assistants generate better Nimble code:

- **`nimble-api-reference.md`** - Comprehensive API reference for `@ni/nimble-components` (Web Components). Framework-agnostic.
- **`nimble-angular-guide.md`** - Guide for using `@ni/nimble-angular` with Angular applications
- **`nimble-blazor-guide.md`** - Guide for using `NimbleBlazor` with Blazor applications

## How to Use

### Option 1: Copy to Your Application Repository

1. **Choose the right file(s)** for your framework:
   - Web Components (vanilla JS/TypeScript): `nimble-api-reference.md`
   - Angular: `nimble-angular-guide.md`
   - Blazor: `nimble-blazor-guide.md`

2. **Copy to your repository**:
   ```bash
   # From your application repository
   curl -o nimble-guide.md https://raw.githubusercontent.com/ni/nimble/main/docs/nimble-angular-guide.md
   ```
   Or manually copy the file content.

3. **Reference in your code**: GitHub Copilot and other AI assistants will automatically use this context when generating code in your repository.

### Option 2: Use as a Chat Context

When using Copilot Chat or other AI assistants:

1. Open the appropriate guide file
2. Copy the relevant sections
3. Provide them as context in your chat conversation

Example:
```
I'm building an Angular form. Here's the Nimble Angular guide:
[paste relevant sections]

Now help me create a form with name, email, and age fields with validation.
```

### Option 3: GitHub Copilot Custom Instructions

If GitHub supports custom instructions in the future (see [GitHub's documentation](https://docs.github.com/en/copilot)), you could reference these files in your repository's custom instructions configuration.

## What's Included

Each guide includes:

- **Installation instructions** - How to add Nimble to your project
- **Setup steps** - Initial configuration required
- **Component reference** - All available components with attributes, events, and methods
- **Usage patterns** - Common patterns for forms, validation, dialogs, tables, etc.
- **Code examples** - Real-world examples for each component and pattern
- **Best practices** - Recommendations for effective Nimble usage
- **TypeScript/Enum reference** - Type-safe values for properties

## Keeping Documentation Updated

These files are manually maintained and may become outdated as Nimble evolves. Always refer to the official Nimble documentation for the most current information:

- **Storybook Documentation**: https://ni.github.io/nimble/storybook
- **Component Status**: https://ni.github.io/nimble/storybook/?path=/docs/component-status--docs
- **GitHub Repository**: https://github.com/ni/nimble

## Example Usage

### Angular Application

```bash
# Copy the Angular guide to your repository
cd my-angular-app
curl -o nimble-guide.md https://raw.githubusercontent.com/ni/nimble/main/docs/nimble-angular-guide.md
git add nimble-guide.md
git commit -m "Add Nimble AI assistant guide"
```

Now when you write Angular code, Copilot will have context about Nimble components:

```typescript
// Type a comment like this and Copilot will suggest Nimble-aware code:
// Create a form with name and email fields using Nimble components

// Copilot will suggest something like:
import { NimbleTextFieldModule } from '@ni/nimble-angular/text-field';

@Component({
  // ... component setup
})
export class MyFormComponent {
  name: string = '';
  email: string = '';
  // ...
}
```

```html
<!-- In template, Copilot will suggest Nimble components: -->
<nimble-text-field [(ngModel)]="name" placeholder="Name"></nimble-text-field>
<nimble-text-field [(ngModel)]="email" type="email" placeholder="Email"></nimble-text-field>
```

### Blazor Application

```bash
# Copy the Blazor guide
cd my-blazor-app
curl -o nimble-guide.md https://raw.githubusercontent.com/ni/nimble/main/docs/nimble-blazor-guide.md
git add nimble-guide.md
git commit -m "Add Nimble AI assistant guide"
```

## Feedback

If you find these guides helpful or have suggestions for improvement, please:

1. File an issue at https://github.com/ni/nimble/issues
2. Use the "🙋 Feature Request" template
3. Tag it with relevant labels

## Contributing

To improve these guides:

1. Fork the repository
2. Edit the files in `/docs`
3. Submit a pull request with your improvements

Please ensure:
- Examples are accurate and follow best practices
- Documentation is clear and concise
- All three guides are updated consistently when applicable
