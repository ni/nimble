# Nimble Storybook – AI Instructions

## Overview
The documentation and visual testing platform for Nimble.
- **Framework**: Storybook 7+
- **Format**: MDX for docs, TypeScript for stories

## Build & Run
Run these commands from the repo root:
- **Run**: `npm run storybook`
- **Build**: `npm run build-storybook`

## Key References
- [`CONTRIBUTING.md`](CONTRIBUTING.md) – Folder structure, MDX templates, Matrix naming.

## Core Patterns

### Matrix Story Naming
- **Do**: `Light Theme$ Open$ No Filter` (Use `$` delimiter).
- **Don't**: `Light Theme Open No Filter` (Spaces only).
- **Don't**: Include component name in story name.

### MDX Template
```jsx
import { Canvas, Meta, Controls, Title } from '@storybook/addon-docs/blocks';
import * as componentStories from './component.stories';

<Meta of={componentStories} />
<Title of={componentStories} />

<Canvas of={componentStories.firstStoryName} />
<Controls of={componentStories.firstStoryName} />
```
