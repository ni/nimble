# API Documentation Generator Plan for LLM Context

## Overview

This document outlines the plan for creating an automated API documentation generator for the Nimble Design System. The generator will extract component API information from existing Storybook stories and MDX files to create a comprehensive reference document specifically designed for LLM consumption.

## Goals

- **LLM-Optimized Format**: Structured, comprehensive data optimized for AI understanding
- **Complete API Coverage**: Captures all component APIs, properties, methods, events, and usage patterns
- **Contextual Information**: Includes implementation details, constraints, and relationships between components
- **Automated Updates**: Regenerates automatically when component APIs change
- **Searchable Content**: Single document that LLMs can search and reference efficiently

## Technical Approach

### Data Sources

1. **Storybook Stories** (`*.stories.ts` files)
   - Extract `argTypes` metadata containing:
     - Attribute descriptions and types
     - Event information
     - Slot definitions
     - Control configurations and options
   - Parse render templates for usage examples
   - Extract framework-specific binding patterns

2. **MDX Documentation** (`*.mdx` files)
   - Component overviews and descriptions
   - Styling guidelines and appearance information
   - Accessibility guidance
   - Usage examples and best practices
   - Framework-specific implementation notes

3. **Pattern Documentation** (shared MDX files)
   - Common styling patterns (e.g., button appearances)
   - Shared accessibility guidance
   - Reusable component behaviors

4. **Framework Example Applications**
   - **Angular**: `packages/angular-workspace/example-client-app/`
   - **Blazor**: `packages/blazor-workspace/Examples/`
   - **React**: `packages/react-workspace/react-client-app/`
   - Extract real-world usage patterns and code snippets
   - Document framework-specific implementation differences
   - Capture integration patterns and best practices

5. **Component Library Classification**
   - **Nimble**: `packages/nimble-components/` - Core design system components
   - **Spright**: `packages/spright-components/` - Specialized domain components  
   - **OK**: `packages/ok-components/` - Extended component variants
   - Extract library metadata and component categorization

### Implementation Strategy

#### Phase 1: Story File Parser
- Use TypeScript AST to parse `.stories.ts` files
- Extract component metadata from imports and exports
- Parse `argTypes` objects to extract API information
- Resolve description functions and imported constants

#### Phase 2: MDX Content Extractor
- Parse MDX files to extract component documentation sections
- Handle imported MDX components and shared content
- Extract styling guidelines, accessibility info, and examples
- Resolve cross-references between components

#### Phase 3: Framework Example Analyzer
- Scan Angular example app for component usage patterns
- Parse Blazor example components for implementation examples
- Extract React usage patterns and JSX examples
- Identify framework-specific patterns and best practices

#### Phase 4: Library Classification System
- Determine component library origin (Nimble/Spright/OK)
- Extract package metadata and dependencies
- Categorize components by domain and usage

#### Phase 5: API Information Consolidation
- Combine data from stories and MDX files
- Group information by component
- Resolve conflicts and merge duplicate information
- Generate comprehensive API summaries

#### Phase 6: Markdown Generation
- Create single consolidated markdown document
- Include table of contents with component links
- Format API information in consistent tables
- Preserve styling and accessibility guidance
- Add framework-specific usage examples

## Output Format

### LLM-Optimized Documentation Structure
- **Format**: Structured markdown optimized for AI parsing
- **Content**: Complete API reference with implementation context
- **Organization**: Hierarchical structure with clear component boundaries
- **Metadata**: Rich type information, constraints, and relationships

### Generated Content Structure
```markdown
# Nimble Design System API Reference

This document contains comprehensive API documentation for all Nimble Design System components, generated from Storybook stories and MDX documentation.

## Component Index
- nimble-button (Nimble): Interactive button element with appearance variants
- nimble-select (Nimble): Dropdown selection control with filtering capabilities
- nimble-table (Nimble): Data table with sorting, grouping, and column configuration
- spright-chat (Spright): Domain-specific chat interface component
- ok-button (OK): Extended button variant with additional styling options
[... complete component list with library classification and brief descriptions]

## Component Specifications

### nimble-button

**Component Library**: Nimble (Core Design System)
**Package**: @ni/nimble-components
**Component Type**: Interactive Control
**Base Class**: FAST Foundation Button
**Framework Support**: Angular, Blazor, React, Vanilla JS
**Custom Element Tag**: nimble-button

**API Surface**:
Attributes:
- appearance: string = "outline" | "ghost" | "block"
  - Controls visual style and emphasis level
  - Default: "outline" 
  - Required: false
- appearance-variant: string = "default" | "primary" | "accent"
  - Additional styling variation, no effect with ghost appearance
  - Default: "default"
  - Required: false
- content-hidden: boolean = false
  - Hides text content, shows only start icon
  - Used for icon-only buttons
  - Requires accessible text content for screen readers
- disabled: boolean = false
  - Prevents interaction, inherited from FAST Foundation

Properties (JavaScript/TypeScript):
- appearance: ButtonAppearance
- appearanceVariant: ButtonAppearanceVariant  
- contentHidden: boolean
- disabled: boolean
- tabIndex: number (override from base class)

Events:
- click: Event
  - Emitted on button activation via mouse or keyboard
  - Standard DOM event, not custom

Slots:
- default: Text content, always provide for accessibility
- start: Icon before text, typically nimble-icon-* components
- end: Icon after text, hidden when content-hidden=true

Methods:
[Inherited from FAST Foundation Button - click(), focus(), blur()]

**Implementation Constraints**:
- Height fixed at 32px (configurable height requested in #610)
- Must provide text content even when content-hidden=true for accessibility
- Icon-only buttons should include title attribute for tooltip
- Ghost appearance doesn't support appearance-variant

**Usage Patterns**:
- Primary actions: appearance="block" appearance-variant="primary"
- Secondary actions: appearance="outline" 
- Tertiary actions: appearance="ghost"
- Icon buttons: content-hidden=true with start slot

**Framework Implementation Examples**:

Angular (from example-client-app):
```typescript
// app.module.ts
import { NimbleButtonModule } from '@ni/nimble-angular/button';

@NgModule({
    imports: [NimbleButtonModule]
})

// component.html
<nimble-button 
    appearance="outline" 
    [disabled]="isSubmitting"
    (click)="handleSubmit()">
    <nimble-icon-save slot="start"></nimble-icon-save>
    Save Changes
</nimble-button>

// reactive forms integration
<nimble-button 
    [disabled]="!form.valid"
    appearance="block" 
    appearance-variant="primary">
    Submit Form
</nimble-button>
```

Blazor (from Demo.Server):
```csharp
@* Page.razor *@
<NimbleButton 
    Appearance="ButtonAppearance.Outline"
    Disabled="@isSubmitting"
    OnClick="HandleSubmit">
    <NimbleIconSave slot="start"></NimbleIconSave>
    Save Changes
</NimbleButton>

@* With event handling *@
<NimbleButton 
    Appearance="ButtonAppearance.Block"
    AppearanceVariant="ButtonAppearanceVariant.Primary"
    OnClick="@(() => NavigationManager.NavigateTo("/next-page"))">
    Continue
</NimbleButton>

@code {
    private bool isSubmitting = false;
    
    private async Task HandleSubmit()
    {
        isSubmitting = true;
        await SubmitData();
        isSubmitting = false;
    }
}
```

React (from react-client-app):
```tsx
// Component.tsx
import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleIconSave } from '@ni/nimble-react/icons/save';

function SubmitForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async () => {
        setIsSubmitting(true);
        await submitData();
        setIsSubmitting(false);
    };
    
    return (
        <NimbleButton 
            appearance="outline"
            disabled={isSubmitting}
            onClick={handleSubmit}>
            <NimbleIconSave slot="start" />
            Save Changes
        </NimbleButton>
    );
}

// Form integration with validation
function FormButton({ isValid }: { isValid: boolean }) {
    return (
        <NimbleButton 
            appearance="block"
            appearanceVariant="primary"
            disabled={!isValid}>
            Submit Form
        </NimbleButton>
    );
}
```

**Related Components**:
- nimble-anchor-button: Navigation variant
- nimble-toggle-button: Toggle state variant
- nimble-menu-button: Dropdown trigger variant

---

### nimble-select
[... complete API specification]
```

## Build Process Integration

### File Structure
```
packages/storybook/
├── scripts/
│   └── generate-llm-context.js       # LLM context generator script
├── src/
│   └── generated-docs/
│       └── llm-api-reference.stories.ts  # Storybook page for viewing
└── dist/
    └── llm-api-reference.md          # Generated LLM context file

# Additional data sources:
packages/angular-workspace/example-client-app/    # Angular examples
packages/blazor-workspace/Examples/              # Blazor examples  
packages/react-workspace/react-client-app/       # React examples
packages/nimble-components/                       # Nimble library
packages/spright-components/                      # Spright library
packages/ok-components/                           # OK library
```

### Build Pipeline
1. **Extract**: Parse all `*.stories.ts` and `*.mdx` files across all component libraries
2. **Scan Examples**: Extract usage patterns from Angular/Blazor/React example applications
3. **Classify**: Determine library origin (Nimble/Spright/OK) for each component
4. **Analyze**: Extract complete API surface including inherited properties
5. **Structure**: Organize data for optimal LLM understanding with library context
6. **Generate**: Create comprehensive markdown document with framework examples
7. **Output**: Save as `llm-api-reference.md` for LLM consumption
8. **Display**: Create Storybook page for human review

### Package.json Integration
```json
{
  "scripts": {
    "generate-llm-context": "node scripts/generate-llm-context.js",
    "build": "npm run generate-llm-context && npm run build-components"
  }
}
```

## LLM Optimization Features

### Comprehensive API Coverage
- **Complete inheritance chain**: Documents both Nimble and FAST Foundation APIs
- **Type information**: Detailed TypeScript types and constraints
- **Implementation context**: How components work internally
- **Relationship mapping**: Dependencies and related components

### Structured Information
- **Consistent format**: Same structure for every component
- **Rich metadata**: Component categories, framework support, base classes
- **Usage patterns**: Common implementation approaches
- **Constraint documentation**: Limitations and requirements

### Contextual Understanding
- **Design system principles**: How components fit together
- **Framework specifics**: Angular/Blazor binding differences
- **Accessibility requirements**: ARIA patterns and screen reader support
- **Styling system**: Appearance modes and theming

## Advantages for LLM Consumption

### Optimal AI Understanding
- **Structured format**: Consistent patterns LLMs can easily parse
- **Complete context**: All necessary information for accurate code generation
- **Relationship mapping**: How components interact and depend on each other
- **Implementation details**: Constraints and requirements for proper usage

### Comprehensive Coverage
- **Multi-library support**: Documents Nimble, Spright, and OK component libraries
- **Full API surface**: Includes inherited FAST Foundation functionality
- **Framework examples**: Real code snippets from Angular/Blazor/React applications
- **Library context**: Clear indication of component origin and package location
- **Type safety**: Complete TypeScript type information
- **Real-world usage**: Patterns extracted from actual example applications

### Maintenance Benefits
- **Always current**: Updates automatically with component changes
- **Single source**: One document contains all component information
- **Verifiable**: Can be cross-referenced against actual implementations
- **Extensible**: Easy to add new metadata fields for LLM optimization

## Potential Challenges

### Technical Challenges
- **Complex TypeScript parsing**: May need sophisticated AST analysis for complex argTypes
- **MDX dependency resolution**: Handling imported components and shared content
- **Description function evaluation**: Resolving dynamically generated descriptions

### Content Challenges
- **Information consistency**: Ensuring stories and MDX files don't contradict
- **Completeness**: Ensuring all components have adequate documentation
- **Framework accuracy**: Verifying Angular/Blazor examples are correct

## Success Criteria

1. **LLM Effectiveness**: Generated documentation enables accurate code generation and component usage
2. **Completeness**: All component APIs, constraints, and patterns are documented
3. **Accuracy**: Generated content matches actual component implementations
4. **Consistency**: Uniform structure and format across all components
5. **Currency**: Updates automatically without manual intervention
6. **Accessibility**: LLMs can easily parse and understand component relationships

## Use Cases for LLM Context

### Code Generation
- **Library selection**: Help LLMs choose components from appropriate library (Nimble/Spright/OK)
- **Component selection**: Help LLMs choose appropriate components for use cases
- **Property configuration**: Provide correct attribute/property names and values
- **Framework integration**: Generate proper Angular/Blazor/React syntax with real examples
- **Package imports**: Correct import statements for each library and framework
- **Accessibility compliance**: Ensure generated code follows accessibility patterns

### API Understanding
- **Complete interface**: Full picture of component capabilities
- **Constraint awareness**: Understanding of limitations and requirements
- **Pattern recognition**: Common usage patterns and best practices
- **Troubleshooting**: Help diagnose integration issues

### Design System Guidance
- **Component relationships**: How components work together
- **Styling system**: Appearance modes and customization options
- **Framework differences**: Platform-specific considerations
- **Evolution tracking**: How APIs change over time

## Next Steps

1. **Proof of Concept**: Implement basic story file parser for 2-3 components
2. **MDX Integration**: Add MDX content extraction capability
3. **Full Implementation**: Extend to all components
4. **Testing**: Verify accuracy against actual component implementations
5. **Documentation**: Update contributing guidelines for maintaining story documentation
6. **Deployment**: Integrate into CI/CD pipeline for automatic updates