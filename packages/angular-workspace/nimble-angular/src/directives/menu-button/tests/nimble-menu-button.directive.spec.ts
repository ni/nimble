import { Component, ElementRef, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { ButtonAppearance, ButtonAppearanceVariant } from '../../../public-api';
import { NimbleMenuButtonDirective, type MenuButton } from '../nimble-menu-button.directive';
import { NimbleMenuButtonModule } from '../nimble-menu-button.module';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';

describe('Nimble menu button', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleMenuButtonModule]
            });
        });

        it('defines custom element', () => {
            expect(customElements.get('nimble-menu-button')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-menu-button #menuButton></nimble-menu-button>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('menuButton', { read: NimbleMenuButtonDirective }) public directive: NimbleMenuButtonDirective;
            @ViewChild('menuButton', { read: ElementRef }) public elementRef: ElementRef<MenuButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuButtonDirective;
        let nativeElement: MenuButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuButtonModule],
                providers: [provideZoneChangeDetection()],
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(ButtonAppearance.outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.outline);
        });

        it('has expected defaults for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.default);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.default);
        });

        it('has expected defaults for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();
        });

        it('isOpen reflects state', async () => {
            expect(directive.isOpen).toBeFalse();
            directive.open();
            await waitForUpdatesAsync();
            expect(directive.isOpen).toBeTrue();
        });

        it('can use the directive to open and close', () => {
            spyOn(nativeElement, 'open');
            spyOn(nativeElement, 'close');

            directive.open();
            directive.close();

            expect(nativeElement.open).toHaveBeenCalled();
            expect(nativeElement.close).toHaveBeenCalled();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-menu-button #menuButton
                    disabled
                    appearance="${ButtonAppearance.ghost}"
                    appearance-variant="${ButtonAppearanceVariant.primary}"
                    content-hidden>
                </nimble-menu-button>`,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('menuButton', { read: NimbleMenuButtonDirective }) public directive: NimbleMenuButtonDirective;
            @ViewChild('menuButton', { read: ElementRef }) public elementRef: ElementRef<MenuButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuButtonDirective;
        let nativeElement: MenuButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuButtonModule],
                providers: [provideZoneChangeDetection()],
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(ButtonAppearance.ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.ghost);
        });

        it('will use template string values for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
        });

        it('will use template string values for contentHidden', () => {
            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-menu-button #menuButton
                    [disabled]="disabled"
                    [appearance]="appearance"
                    [appearance-variant]="appearanceVariant"
                    [content-hidden]="contentHidden">
                </nimble-menu-button>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('menuButton', { read: NimbleMenuButtonDirective }) public directive: NimbleMenuButtonDirective;
            @ViewChild('menuButton', { read: ElementRef }) public elementRef: ElementRef<MenuButton>;
            public disabled = false;
            public appearance: ButtonAppearance = ButtonAppearance.outline;
            public appearanceVariant: ButtonAppearanceVariant;
            public contentHidden = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuButtonDirective;
        let nativeElement: MenuButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuButtonModule],
                providers: [provideZoneChangeDetection()],
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
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
            expect(directive.appearance).toBe(ButtonAppearance.outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.outline);

            fixture.componentInstance.appearance = ButtonAppearance.ghost;
            fixture.detectChanges();

            expect(directive.appearance).toBe(ButtonAppearance.ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.ghost);
        });

        it('can be configured with property binding for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.default);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.default);

            fixture.componentInstance.appearanceVariant = ButtonAppearanceVariant.primary;
            fixture.detectChanges();

            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
        });

        it('can be configured with property binding for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();

            fixture.componentInstance.contentHidden = true;
            fixture.detectChanges();

            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-menu-button #menuButton
                    [attr.disabled]="disabled"
                    [attr.appearance]="appearance"
                    [attr.appearance-variant]="appearanceVariant"
                    [attr.content-hidden]="contentHidden">
                </nimble-menu-button>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('menuButton', { read: NimbleMenuButtonDirective }) public directive: NimbleMenuButtonDirective;
            @ViewChild('menuButton', { read: ElementRef }) public elementRef: ElementRef<MenuButton>;
            public disabled: BooleanValueOrAttribute = null;
            public appearance: ButtonAppearance = ButtonAppearance.outline;
            public appearanceVariant: ButtonAppearanceVariant;
            public contentHidden: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuButtonDirective;
        let nativeElement: MenuButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuButtonModule],
                providers: [provideZoneChangeDetection()],
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
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
            expect(directive.appearance).toBe(ButtonAppearance.outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.outline);

            fixture.componentInstance.appearance = ButtonAppearance.ghost;
            fixture.detectChanges();

            expect(directive.appearance).toBe(ButtonAppearance.ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.ghost);
        });

        it('can be configured with attribute binding for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.default);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.default);

            fixture.componentInstance.appearanceVariant = ButtonAppearanceVariant.primary;
            fixture.detectChanges();

            expect(directive.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
            expect(nativeElement.appearanceVariant).toBe(ButtonAppearanceVariant.primary);
        });

        it('can be configured with attribute binding for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();

            fixture.componentInstance.contentHidden = '';
            fixture.detectChanges();

            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });
    });
});
