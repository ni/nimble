# Nimble Angular – AI Instructions

## Overview
Angular directives that wrap Nimble Web Components to provide first-class Angular integration (Forms, Router, etc.).
- **Pattern**: One Directive per Component
- **State**: Directives are stateless proxies; state lives in the Web Component.

## Build & Test
Run these commands from the repo root:
- **Build**: `npm run build -w @ni/nimble-angular`
- **Test**: `npm run test -w @ni/nimble-angular`

## Key References
- [`nimble-angular/CONTRIBUTING.md`](nimble-angular/CONTRIBUTING.md) – Directive patterns, testing, and versioning.

## Core Patterns

### Directive Skeleton
```typescript
@Directive({
    selector: 'nimble-example'
})
export class NimbleExampleDirective {
    public get myAttribute(): string {
        return this.elementRef.nativeElement.myAttribute;
    }

    @Input()
    public set myAttribute(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'myAttribute', value);
    }

    constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Example>) {}
}
```

### Form Integration
- Implement `ControlValueAccessor` for inputs.
- Use `Renderer2` for property updates.
- Forward events using `@HostListener`.

## Testing
- Test `ControlValueAccessor` with `[(ngModel)]`.
- Verify module imports: `expect(customElements.get('nimble-example')).not.toBeUndefined();`.
- Use `fakeAsync` and `processUpdates()` for async behavior.
