import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type AnchorTab, NimbleAnchorTabDirective } from '../nimble-anchor-tab.directive';
import { NimbleAnchorTabModule } from '../nimble-anchor-tab.module';

describe('Nimble anchor tab', () => {
    const href1 = '#';
    const href2 = 'http://www.ni.com';
    const hreflang1 = 'en';
    const hreflang2 = 'fr';
    const ping1 = 'http://www.ni.com';
    const ping2 = 'http://www.ni.com http://www.google.com';
    const referrerpolicy1 = 'no-referrer';
    const referrerpolicy2 = 'origin';
    const rel1 = 'alternate';
    const rel2 = 'bookmark';
    const target1 = '_self';
    const target2 = '_blank';
    const type1 = 'text/plain';
    const type2 = 'application/javascript';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleAnchorTabModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-anchor-tab')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-anchor-tab #anchorTab></nimble-anchor-tab>
            `
        })
        class TestHostComponent {
            @ViewChild('anchorTab', { read: NimbleAnchorTabDirective }) public directive: NimbleAnchorTabDirective;
            @ViewChild('anchorTab', { read: ElementRef }) public elementRef: ElementRef<AnchorTab>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleAnchorTabDirective;
        let nativeElement: AnchorTab;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleAnchorTabModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for href', () => {
            expect(directive.href).toBeUndefined();
            expect(nativeElement.href).toBeUndefined();
        });

        it('has expected defaults for hreflang', () => {
            expect(directive.hreflang).toBeUndefined();
            expect(nativeElement.hreflang).toBeUndefined();
        });

        it('has expected defaults for ping', () => {
            expect(directive.ping).toBeUndefined();
            expect(nativeElement.ping).toBeUndefined();
        });

        it('has expected defaults for referrerpolicy', () => {
            expect(directive.referrerpolicy).toBeUndefined();
            expect(nativeElement.referrerpolicy).toBeUndefined();
        });

        it('has expected defaults for rel', () => {
            expect(directive.rel).toBeUndefined();
            expect(nativeElement.rel).toBeUndefined();
        });

        it('has expected defaults for target', () => {
            expect(directive.target).toBeUndefined();
            expect(nativeElement.target).toBeUndefined();
        });

        it('has expected defaults for type', () => {
            expect(directive.type).toBeUndefined();
            expect(nativeElement.type).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-anchor-tab #anchorTab
                    href="${href1}"
                    hreflang="${hreflang1}"
                    ping="${ping1}"
                    referrerpolicy="${referrerpolicy1}"
                    rel="${rel1}"
                    target="${target1}"
                    type="${type1}"
                    >
                </nimble-anchor-tab>
            `
        })
        class TestHostComponent {
            @ViewChild('anchorTab', { read: NimbleAnchorTabDirective }) public directive: NimbleAnchorTabDirective;
            @ViewChild('anchorTab', { read: ElementRef }) public elementRef: ElementRef<AnchorTab>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleAnchorTabDirective;
        let nativeElement: AnchorTab;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleAnchorTabModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for href', () => {
            expect(directive.href).toBe(href1);
            expect(nativeElement.href).toBe(href1);
        });

        it('will use template string values for hreflang', () => {
            expect(directive.hreflang).toBe(hreflang1);
            expect(nativeElement.hreflang).toBe(hreflang1);
        });

        it('will use template string values for ping', () => {
            expect(directive.ping).toBe(ping1);
            expect(nativeElement.ping).toBe(ping1);
        });

        it('will use template string values for referrerpolicy', () => {
            expect(directive.referrerpolicy).toBe(referrerpolicy1);
            expect(nativeElement.referrerpolicy).toBe(referrerpolicy1);
        });

        it('will use template string values for rel', () => {
            expect(directive.rel).toBe(rel1);
            expect(nativeElement.rel).toBe(rel1);
        });

        it('will use template string values for target', () => {
            expect(directive.target).toBe(target1);
            expect(nativeElement.target).toBe(target1);
        });

        it('will use template string values for type', () => {
            expect(directive.type).toBe(type1);
            expect(nativeElement.type).toBe(type1);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-anchor-tab #anchorTab
                    [href]="href"
                    [hreflang]="hreflang"
                    [ping]="ping"
                    [referrerpolicy]="referrerpolicy"
                    [rel]="rel"
                    [target]="target"
                    [type]="type"
                    >
                </nimble-anchor-tab>
            `
        })
        class TestHostComponent {
            @ViewChild('anchorTab', { read: NimbleAnchorTabDirective }) public directive: NimbleAnchorTabDirective;
            @ViewChild('anchorTab', { read: ElementRef }) public elementRef: ElementRef<AnchorTab>;
            public href = href1;
            public hreflang = hreflang1;
            public ping = ping1;
            public referrerpolicy = referrerpolicy1;
            public rel = rel1;
            public target = target1;
            public type = type1;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleAnchorTabDirective;
        let nativeElement: AnchorTab;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleAnchorTabModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for href', () => {
            expect(directive.href).toBe(href1);
            expect(nativeElement.href).toBe(href1);

            fixture.componentInstance.href = href2;
            fixture.detectChanges();

            expect(directive.href).toBe(href2);
            expect(nativeElement.href).toBe(href2);
        });

        it('can be configured with property binding for hreflang', () => {
            expect(directive.hreflang).toBe(hreflang1);
            expect(nativeElement.hreflang).toBe(hreflang1);

            fixture.componentInstance.hreflang = hreflang2;
            fixture.detectChanges();

            expect(directive.hreflang).toBe(hreflang2);
            expect(nativeElement.hreflang).toBe(hreflang2);
        });

        it('can be configured with property binding for ping', () => {
            expect(directive.ping).toBe(ping1);
            expect(nativeElement.ping).toBe(ping1);

            fixture.componentInstance.ping = ping2;
            fixture.detectChanges();

            expect(directive.ping).toBe(ping2);
            expect(nativeElement.ping).toBe(ping2);
        });

        it('can be configured with property binding for referrerpolicy', () => {
            expect(directive.referrerpolicy).toBe(referrerpolicy1);
            expect(nativeElement.referrerpolicy).toBe(referrerpolicy1);

            fixture.componentInstance.referrerpolicy = referrerpolicy2;
            fixture.detectChanges();

            expect(directive.referrerpolicy).toBe(referrerpolicy2);
            expect(nativeElement.referrerpolicy).toBe(referrerpolicy2);
        });

        it('can be configured with property binding for rel', () => {
            expect(directive.rel).toBe(rel1);
            expect(nativeElement.rel).toBe(rel1);

            fixture.componentInstance.rel = rel2;
            fixture.detectChanges();

            expect(directive.rel).toBe(rel2);
            expect(nativeElement.rel).toBe(rel2);
        });

        it('can be configured with property binding for target', () => {
            expect(directive.target).toBe(target1);
            expect(nativeElement.target).toBe(target1);

            fixture.componentInstance.target = target2;
            fixture.detectChanges();

            expect(directive.target).toBe(target2);
            expect(nativeElement.target).toBe(target2);
        });

        it('can be configured with property binding for type', () => {
            expect(directive.type).toBe(type1);
            expect(nativeElement.type).toBe(type1);

            fixture.componentInstance.type = type2;
            fixture.detectChanges();

            expect(directive.type).toBe(type2);
            expect(nativeElement.type).toBe(type2);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-anchor-tab #anchorTab
                    [attr.href]="href"
                    [attr.hreflang]="hreflang"
                    [attr.ping]="ping"
                    [attr.referrerpolicy]="referrerpolicy"
                    [attr.rel]="rel"
                    [attr.target]="target"
                    [attr.type]="type"
                    >
                </nimble-anchor-tab>
            `
        })
        class TestHostComponent {
            @ViewChild('anchorTab', { read: NimbleAnchorTabDirective }) public directive: NimbleAnchorTabDirective;
            @ViewChild('anchorTab', { read: ElementRef }) public elementRef: ElementRef<AnchorTab>;
            public href = href1;
            public hreflang = hreflang1;
            public ping = ping1;
            public referrerpolicy = referrerpolicy1;
            public rel = rel1;
            public target = target1;
            public type = type1;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleAnchorTabDirective;
        let nativeElement: AnchorTab;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleAnchorTabModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for href', () => {
            expect(directive.href).toBe(href1);
            expect(nativeElement.href).toBe(href1);

            fixture.componentInstance.href = href2;
            fixture.detectChanges();

            expect(directive.href).toBe(href2);
            expect(nativeElement.href).toBe(href2);
        });

        it('can be configured with attribute binding for hreflang', () => {
            expect(directive.hreflang).toBe(hreflang1);
            expect(nativeElement.hreflang).toBe(hreflang1);

            fixture.componentInstance.hreflang = hreflang2;
            fixture.detectChanges();

            expect(directive.hreflang).toBe(hreflang2);
            expect(nativeElement.hreflang).toBe(hreflang2);
        });

        it('can be configured with attribute binding for ping', () => {
            expect(directive.ping).toBe(ping1);
            expect(nativeElement.ping).toBe(ping1);

            fixture.componentInstance.ping = ping2;
            fixture.detectChanges();

            expect(directive.ping).toBe(ping2);
            expect(nativeElement.ping).toBe(ping2);
        });

        it('can be configured with attribute binding for referrerpolicy', () => {
            expect(directive.referrerpolicy).toBe(referrerpolicy1);
            expect(nativeElement.referrerpolicy).toBe(referrerpolicy1);

            fixture.componentInstance.referrerpolicy = referrerpolicy2;
            fixture.detectChanges();

            expect(directive.referrerpolicy).toBe(referrerpolicy2);
            expect(nativeElement.referrerpolicy).toBe(referrerpolicy2);
        });

        it('can be configured with attribute binding for rel', () => {
            expect(directive.rel).toBe(rel1);
            expect(nativeElement.rel).toBe(rel1);

            fixture.componentInstance.rel = rel2;
            fixture.detectChanges();

            expect(directive.rel).toBe(rel2);
            expect(nativeElement.rel).toBe(rel2);
        });

        it('can be configured with attribute binding for target', () => {
            expect(directive.target).toBe(target1);
            expect(nativeElement.target).toBe(target1);

            fixture.componentInstance.target = target2;
            fixture.detectChanges();

            expect(directive.target).toBe(target2);
            expect(nativeElement.target).toBe(target2);
        });

        it('can be configured with attribute binding for type', () => {
            expect(directive.type).toBe(type1);
            expect(nativeElement.type).toBe(type1);

            fixture.componentInstance.type = type2;
            fixture.detectChanges();

            expect(directive.type).toBe(type2);
            expect(nativeElement.type).toBe(type2);
        });
    });
});
