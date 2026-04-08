import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { type Chip, ChipAppearance, NimbleChipDirective } from '../nimble-chip.directive';
import { NimbleChipModule } from '../nimble-chip.module';

describe('Nimble chip', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleChipModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-chip')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-chip #chip></nimble-chip>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chip', { read: NimbleChipDirective }) public directive: NimbleChipDirective;
            @ViewChild('chip', { read: ElementRef }) public elementRef: ElementRef<Chip>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleChipDirective;
        let nativeElement: Chip;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleChipModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for removable', () => {
            expect(directive.removable).toBeFalse();
            expect(nativeElement.removable).toBeFalse();
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(ChipAppearance.outline);
            expect(nativeElement.appearance).toBe(ChipAppearance.outline);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-chip #chip
                    removable
                    disabled
                    appearance="block">
                </nimble-chip>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chip', { read: NimbleChipDirective }) public directive: NimbleChipDirective;
            @ViewChild('chip', { read: ElementRef }) public elementRef: ElementRef<Chip>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleChipDirective;
        let nativeElement: Chip;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleChipModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for removable', () => {
            expect(directive.removable).toBeTrue();
            expect(nativeElement.removable).toBeTrue();
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(ChipAppearance.block);
            expect(nativeElement.appearance).toBe(ChipAppearance.block);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-chip #chip
                    [removable]="removable"
                    [disabled]="disabled"
                    [appearance]="appearance">
                </nimble-chip>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chip', { read: NimbleChipDirective }) public directive: NimbleChipDirective;
            @ViewChild('chip', { read: ElementRef }) public elementRef: ElementRef<Chip>;
            public removable = false;
            public disabled = false;
            public appearance: ChipAppearance = ChipAppearance.outline;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleChipDirective;
        let nativeElement: Chip;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleChipModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for removable', () => {
            expect(directive.removable).toBeFalse();
            expect(nativeElement.removable).toBeFalse();

            fixture.componentInstance.removable = true;
            fixture.detectChanges();

            expect(directive.removable).toBeTrue();
            expect(nativeElement.removable).toBeTrue();
        });

        it('can be configured with property binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(ChipAppearance.outline);
            expect(nativeElement.appearance).toBe(ChipAppearance.outline);

            fixture.componentInstance.appearance = ChipAppearance.block;
            fixture.detectChanges();

            expect(directive.appearance).toBe(ChipAppearance.block);
            expect(nativeElement.appearance).toBe(ChipAppearance.block);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-chip #chip
                    [attr.removable]="removable"
                    [attr.disabled]="disabled"
                    [attr.appearance]="appearance">
                </nimble-chip>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chip', { read: NimbleChipDirective }) public directive: NimbleChipDirective;
            @ViewChild('chip', { read: ElementRef }) public elementRef: ElementRef<Chip>;
            public removable: BooleanValueOrAttribute = null;
            public disabled: BooleanValueOrAttribute = null;
            public appearance: ChipAppearance = ChipAppearance.outline;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleChipDirective;
        let nativeElement: Chip;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleChipModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for removable', () => {
            expect(directive.removable).toBeFalse();
            expect(nativeElement.removable).toBeFalse();

            fixture.componentInstance.removable = '';
            fixture.detectChanges();

            expect(directive.removable).toBeTrue();
            expect(nativeElement.removable).toBeTrue();
        });

        it('can be configured with attribute binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = '';
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with attribute binding for appearance', () => {
            expect(directive.appearance).toBe(ChipAppearance.outline);
            expect(nativeElement.appearance).toBe(ChipAppearance.outline);

            fixture.componentInstance.appearance = ChipAppearance.block;
            fixture.detectChanges();

            expect(directive.appearance).toBe(ChipAppearance.block);
            expect(nativeElement.appearance).toBe(ChipAppearance.block);
        });
    });
});
