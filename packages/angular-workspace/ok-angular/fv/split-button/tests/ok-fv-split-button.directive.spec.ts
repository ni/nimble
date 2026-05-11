import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvSplitButton, FvSplitButtonAppearance, FvSplitButtonAppearanceVariant, OkFvSplitButtonDirective } from '../ok-fv-split-button.directive';
import { OkFvSplitButtonModule } from '../ok-fv-split-button.module';

describe('Ok fv split button', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvSplitButtonModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-split-button')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <ok-fv-split-button #splitButton></ok-fv-split-button>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('splitButton', { read: OkFvSplitButtonDirective }) public directive: OkFvSplitButtonDirective;
            @ViewChild('splitButton', { read: ElementRef }) public elementRef: ElementRef<FvSplitButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSplitButtonDirective;
        let nativeElement: FvSplitButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSplitButtonModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for label', () => {
            expect(directive.label).toBe('Primary function');
            expect(nativeElement.label).toBe('Primary function');
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBe(false);
            expect(nativeElement.disabled).toBe(false);
        });

        it('has expected defaults for open', () => {
            expect(directive.open).toBe(false);
            expect(nativeElement.open).toBe(false);
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(FvSplitButtonAppearance.outline);
            expect(nativeElement.appearance).toBe(FvSplitButtonAppearance.outline);
        });

        it('has expected defaults for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(FvSplitButtonAppearanceVariant.default);
            expect(nativeElement.appearanceVariant).toBe(FvSplitButtonAppearanceVariant.default);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <ok-fv-split-button #splitButton
                    label="Run action"
                    disabled
                    open
                    appearance="block"
                    appearance-variant="primary">
                </ok-fv-split-button>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('splitButton', { read: OkFvSplitButtonDirective }) public directive: OkFvSplitButtonDirective;
            @ViewChild('splitButton', { read: ElementRef }) public elementRef: ElementRef<FvSplitButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSplitButtonDirective;
        let nativeElement: FvSplitButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSplitButtonModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for label', () => {
            expect(directive.label).toBe('Run action');
            expect(nativeElement.label).toBe('Run action');
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(FvSplitButtonAppearance.block);
            expect(nativeElement.appearance).toBe(FvSplitButtonAppearance.block);
        });

        it('will use template string values for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(FvSplitButtonAppearanceVariant.primary);
            expect(nativeElement.appearanceVariant).toBe(FvSplitButtonAppearanceVariant.primary);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <ok-fv-split-button #splitButton
                    [label]="label"
                    [disabled]="disabled"
                    [open]="open"
                    [appearance]="appearance"
                    [appearanceVariant]="appearanceVariant">
                </ok-fv-split-button>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('splitButton', { read: OkFvSplitButtonDirective }) public directive: OkFvSplitButtonDirective;
            @ViewChild('splitButton', { read: ElementRef }) public elementRef: ElementRef<FvSplitButton>;
            public label = 'Run action';
            public disabled = false;
            public open = false;
            public appearance: FvSplitButtonAppearance = FvSplitButtonAppearance.outline;
            public appearanceVariant: FvSplitButtonAppearanceVariant = FvSplitButtonAppearanceVariant.default;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSplitButtonDirective;
        let nativeElement: FvSplitButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSplitButtonModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for label', () => {
            expect(directive.label).toBe('Run action');
            expect(nativeElement.label).toBe('Run action');

            fixture.componentInstance.label = 'Queue action';
            fixture.detectChanges();

            expect(directive.label).toBe('Queue action');
            expect(nativeElement.label).toBe('Queue action');
        });

        it('can be configured with property binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with property binding for open', () => {
            expect(directive.open).toBeFalse();
            expect(nativeElement.open).toBeFalse();

            fixture.componentInstance.open = true;
            fixture.detectChanges();

            expect(directive.open).toBeTrue();
            expect(nativeElement.open).toBeTrue();
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(FvSplitButtonAppearance.outline);
            expect(nativeElement.appearance).toBe(FvSplitButtonAppearance.outline);

            fixture.componentInstance.appearance = FvSplitButtonAppearance.block;
            fixture.detectChanges();

            expect(directive.appearance).toBe(FvSplitButtonAppearance.block);
            expect(nativeElement.appearance).toBe(FvSplitButtonAppearance.block);
        });

        it('can be configured with property binding for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(FvSplitButtonAppearanceVariant.default);
            expect(nativeElement.appearanceVariant).toBe(FvSplitButtonAppearanceVariant.default);

            fixture.componentInstance.appearanceVariant = FvSplitButtonAppearanceVariant.primary;
            fixture.detectChanges();

            expect(directive.appearanceVariant).toBe(FvSplitButtonAppearanceVariant.primary);
            expect(nativeElement.appearanceVariant).toBe(FvSplitButtonAppearanceVariant.primary);
        });
    });
});
