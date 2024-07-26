import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleThemeProviderModule } from '../nimble-theme-provider.module';
import { NimbleThemeProviderDirective, Theme, ThemeProvider } from '../nimble-theme-provider.directive';

describe('Nimble theme provider', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleThemeProviderModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-theme-provider')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-theme-provider #themeProvider></nimble-theme-provider>
            `
        })
        class TestHostComponent {
            @ViewChild('themeProvider', { read: NimbleThemeProviderDirective }) public directive: NimbleThemeProviderDirective;
            @ViewChild('themeProvider', { read: ElementRef }) public elementRef: ElementRef<ThemeProvider>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleThemeProviderDirective;
        let nativeElement: ThemeProvider;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleThemeProviderModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for theme', () => {
            expect(directive.theme).toBe(Theme.light);
            expect(nativeElement.theme).toBe(Theme.light);
        });

        it('has expected defaults for lang', () => {
            expect(directive.lang).toBeUndefined();
            expect(nativeElement.lang).toBeUndefined();
        });

        it('has expected defaults for validity', () => {
            expect(directive.validity.invalidLang).toBeFalse();
            expect(nativeElement.validity.invalidLang).toBeFalse();
            expect(directive.checkValidity()).toBeTrue();
        });

        it('updates validity when setting invalid lang', () => {
            directive.lang = '123';
            expect(directive.validity.invalidLang).toBeTrue();
            expect(nativeElement.validity.invalidLang).toBeTrue();
            expect(directive.checkValidity()).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-theme-provider #themeProvider
                    theme="dark"
                    lang="de-DE">
                </nimble-theme-provider>
            `
        })
        class TestHostComponent {
            @ViewChild('themeProvider', { read: NimbleThemeProviderDirective }) public directive: NimbleThemeProviderDirective;
            @ViewChild('themeProvider', { read: ElementRef }) public elementRef: ElementRef<ThemeProvider>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleThemeProviderDirective;
        let nativeElement: ThemeProvider;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleThemeProviderModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for theme', () => {
            expect(directive.theme).toBe(Theme.dark);
            expect(nativeElement.theme).toBe(Theme.dark);
        });

        it('will use template string values for lang', () => {
            expect(directive.lang).toBe('de-DE');
            expect(nativeElement.lang).toBe('de-DE');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-theme-provider #themeProvider
                    [theme]="theme"
                    [lang]="lang">
                </nimble-theme-provider>
            `
        })
        class TestHostComponent {
            @ViewChild('themeProvider', { read: NimbleThemeProviderDirective }) public directive: NimbleThemeProviderDirective;
            @ViewChild('themeProvider', { read: ElementRef }) public elementRef: ElementRef<ThemeProvider>;
            public theme: Theme = Theme.dark;
            public lang = 'de-DE';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleThemeProviderDirective;
        let nativeElement: ThemeProvider;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleThemeProviderModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for theme', () => {
            expect(directive.theme).toBe(Theme.dark);
            expect(nativeElement.theme).toBe(Theme.dark);

            fixture.componentInstance.theme = Theme.color;
            fixture.detectChanges();

            expect(directive.theme).toBe(Theme.color);
            expect(nativeElement.theme).toBe(Theme.color);
        });

        it('can be configured with property binding for lang', () => {
            expect(directive.lang).toBe('de-DE');
            expect(nativeElement.lang).toBe('de-DE');

            fixture.componentInstance.lang = 'fr-FR';
            fixture.detectChanges();

            expect(directive.lang).toBe('fr-FR');
            expect(nativeElement.lang).toBe('fr-FR');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-theme-provider #themeProvider
                    [attr.theme]="theme"
                    [attr.lang]="lang">
                </nimble-theme-provider>
            `
        })
        class TestHostComponent {
            @ViewChild('themeProvider', { read: NimbleThemeProviderDirective }) public directive: NimbleThemeProviderDirective;
            @ViewChild('themeProvider', { read: ElementRef }) public elementRef: ElementRef<ThemeProvider>;
            public theme: Theme = Theme.dark;
            public lang = 'de-DE';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleThemeProviderDirective;
        let nativeElement: ThemeProvider;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleThemeProviderModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for theme', () => {
            expect(directive.theme).toBe(Theme.dark);
            expect(nativeElement.theme).toBe(Theme.dark);

            fixture.componentInstance.theme = Theme.color;
            fixture.detectChanges();

            expect(directive.theme).toBe(Theme.color);
            expect(nativeElement.theme).toBe(Theme.color);
        });

        it('can be configured with attribute binding for lang', () => {
            expect(directive.lang).toBe('de-DE');
            expect(nativeElement.lang).toBe('de-DE');

            fixture.componentInstance.lang = 'fr-FR';
            fixture.detectChanges();

            expect(directive.lang).toBe('fr-FR');
            expect(nativeElement.lang).toBe('fr-FR');
        });
    });
});
