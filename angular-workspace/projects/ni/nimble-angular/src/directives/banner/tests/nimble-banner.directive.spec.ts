import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerSeverity } from '../../../public-api';
import { Banner, NimbleBannerDirective } from '../nimble-banner.directive';
import { NimbleBannerModule } from '../nimble-banner.module';

fdescribe('Nimble banner', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleBannerModule]
            });
        });

        it('defines custom element', () => {
            expect(customElements.get('nimble-banner')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-banner #banner></nimble-banner>
            `
        })
        class TestHostComponent {
            @ViewChild('banner', { read: NimbleBannerDirective }) public directive: NimbleBannerDirective;
            @ViewChild('banner', { read: ElementRef }) public elementRef: ElementRef<Banner>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBannerDirective;
        let nativeElement: Banner;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBannerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for open', () => {
            expect(directive.open).toBeFalse();
            expect(nativeElement.open).toBeFalse();
        });

        it('has expected defaults for severity', () => {
            expect(directive.severity).toBe(BannerSeverity.default);
            expect(nativeElement.severity).toBe(BannerSeverity.default);
        });

        it('has expected defaults for titleHidden', () => {
            expect(directive.titleHidden).toBeFalse();
            expect(nativeElement.titleHidden).toBeFalse();
        });

        it('has expected defaults for preventDismiss', () => {
            expect(directive.preventDismiss).toBeFalse();
            expect(nativeElement.preventDismiss).toBeFalse();
        });

        it('has expected defaults for dismissButtonLabel', () => {
            expect(directive.dismissButtonLabel).toBeUndefined();
            expect(nativeElement.dismissButtonLabel).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-banner #banner
                    open
                    severity="error"
                    title-hidden
                    prevent-dismiss
                    dismiss-button-label="Dismiss">
                </nimble-banner>`
        })
        class TestHostComponent {
            @ViewChild('banner', { read: NimbleBannerDirective }) public directive: NimbleBannerDirective;
            @ViewChild('banner', { read: ElementRef }) public elementRef: ElementRef<Banner>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBannerDirective;
        let nativeElement: Banner;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBannerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for open', () => {
            expect(directive.open).toBeTrue();
            expect(nativeElement.open).toBeTrue();
        });

        it('will use template string values for severity', () => {
            expect(directive.severity).toBe(BannerSeverity.error);
            expect(nativeElement.severity).toBe(BannerSeverity.error);
        });

        it('will use template string values for titleHidden', () => {
            expect(directive.titleHidden).toBeTrue();
            expect(nativeElement.titleHidden).toBeTrue();
        });

        it('will use template string values for preventDismiss', () => {
            expect(directive.preventDismiss).toBeTrue();
            expect(nativeElement.preventDismiss).toBeTrue();
        });

        it('will use template string values for dismissButtonLabel', () => {
            expect(directive.dismissButtonLabel).toBe('Dismiss');
            expect(nativeElement.dismissButtonLabel).toBe('Dismiss');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-banner #banner
                    [open]="open"
                    [severity]="severity"
                    [title-hidden]="titleHidden"
                    [prevent-dismiss]="preventDismiss"
                    [dismiss-button-label]="dismissButtonLabel">
                </nimble-banner>`
        })
        class TestHostComponent {
            @ViewChild('banner', { read: NimbleBannerDirective }) public directive: NimbleBannerDirective;
            @ViewChild('banner', { read: ElementRef }) public elementRef: ElementRef<Banner>;
            public open = false;
            public severity: BannerSeverity = BannerSeverity.warning;
            public titleHidden = false;
            public preventDismiss = false;
            public dismissButtonLabel = 'Dismiss';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBannerDirective;
        let nativeElement: Banner;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBannerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for open', () => {
            expect(directive.open).toBeFalse();
            expect(nativeElement.open).toBeFalse();

            fixture.componentInstance.open = true;
            fixture.detectChanges();

            expect(directive.open).toBeTrue();
            expect(nativeElement.open).toBeTrue();
        });

        it('can be configured with property binding for severity', () => {
            expect(directive.severity).toBe(BannerSeverity.warning);
            expect(nativeElement.severity).toBe(BannerSeverity.warning);

            fixture.componentInstance.severity = BannerSeverity.info;
            fixture.detectChanges();

            expect(directive.severity).toBe(BannerSeverity.info);
            expect(nativeElement.severity).toBe(BannerSeverity.info);
        });

        it('can be configured with property binding for titleHidden', () => {
            expect(directive.titleHidden).toBeFalse();
            expect(nativeElement.titleHidden).toBeFalse();

            fixture.componentInstance.titleHidden = true;
            fixture.detectChanges();

            expect(directive.titleHidden).toBeTrue();
            expect(nativeElement.titleHidden).toBeTrue();
        });

        it('can be configured with property binding for preventDismiss', () => {
            expect(directive.preventDismiss).toBeFalse();
            expect(nativeElement.preventDismiss).toBeFalse();

            fixture.componentInstance.preventDismiss = true;
            fixture.detectChanges();

            expect(directive.preventDismiss).toBeTrue();
            expect(nativeElement.preventDismiss).toBeTrue();
        });

        it('can be configured with property binding for dismissButtonLabel', () => {
            expect(directive.dismissButtonLabel).toBe('Dismiss');
            expect(nativeElement.dismissButtonLabel).toBe('Dismiss');

            fixture.componentInstance.dismissButtonLabel = 'Close';
            fixture.detectChanges();

            expect(directive.dismissButtonLabel).toBe('Close');
            expect(nativeElement.dismissButtonLabel).toBe('Close');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-banner #banner
                    [attr.open]="open"
                    [attr.severity]="severity"
                    [attr.title-hidden]="titleHidden"
                    [attr.prevent-dismiss]="preventDismiss"
                    [attr.dismiss-button-label]="dismissButtonLabel">
                </nimble-banner>`
        })
        class TestHostComponent {
            @ViewChild('banner', { read: NimbleBannerDirective }) public directive: NimbleBannerDirective;
            @ViewChild('banner', { read: ElementRef }) public elementRef: ElementRef<Banner>;
            public open = false;
            public severity: BannerSeverity = BannerSeverity.warning;
            public titleHidden = false;
            public preventDismiss = false;
            public dismissButtonLabel = 'Dismiss';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBannerDirective;
        let nativeElement: Banner;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBannerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for open', () => {
            expect(directive.open).toBeFalse();
            expect(nativeElement.open).toBeFalse();

            fixture.componentInstance.open = true;
            fixture.detectChanges();

            expect(directive.open).toBeTrue();
            expect(nativeElement.open).toBeTrue();
        });

        it('can be configured with attribute binding for severity', () => {
            expect(directive.severity).toBe(BannerSeverity.warning);
            expect(nativeElement.severity).toBe(BannerSeverity.warning);

            fixture.componentInstance.severity = BannerSeverity.info;
            fixture.detectChanges();

            expect(directive.severity).toBe(BannerSeverity.info);
            expect(nativeElement.severity).toBe(BannerSeverity.info);
        });

        it('can be configured with attribute binding for titleHidden', () => {
            expect(directive.titleHidden).toBeFalse();
            expect(nativeElement.titleHidden).toBeFalse();

            fixture.componentInstance.titleHidden = true;
            fixture.detectChanges();

            expect(directive.titleHidden).toBeTrue();
            expect(nativeElement.titleHidden).toBeTrue();
        });

        it('can be configured with attribute binding for preventDismiss', () => {
            expect(directive.preventDismiss).toBeFalse();
            expect(nativeElement.preventDismiss).toBeFalse();

            fixture.componentInstance.preventDismiss = true;
            fixture.detectChanges();

            expect(directive.preventDismiss).toBeTrue();
            expect(nativeElement.preventDismiss).toBeTrue();
        });

        it('can be configured with attribute binding for dismissButtonLabel', () => {
            expect(directive.dismissButtonLabel).toBe('Dismiss');
            expect(nativeElement.dismissButtonLabel).toBe('Dismiss');

            fixture.componentInstance.dismissButtonLabel = 'Close';
            fixture.detectChanges();

            expect(directive.dismissButtonLabel).toBe('Close');
            expect(nativeElement.dismissButtonLabel).toBe('Close');
        });
    });
});
