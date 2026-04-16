import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { AnchorStepSeverity, type AnchorStep, NimbleAnchorStepDirective } from '../nimble-anchor-step.directive';
import { NimbleAnchorStepModule } from '../nimble-anchor-step.module';

describe('Nimble anchor step', () => {
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
    const severity1 = AnchorStepSeverity.default;
    const severity2 = AnchorStepSeverity.error;
    const severityText1 = 'hello';
    const severityText2 = 'world';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleAnchorStepModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-anchor-step')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-anchor-step #anchorStep></nimble-anchor-step>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('anchorStep', { read: NimbleAnchorStepDirective }) public directive: NimbleAnchorStepDirective;
            @ViewChild('anchorStep', { read: ElementRef }) public elementRef: ElementRef<AnchorStep>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleAnchorStepDirective;
        let nativeElement: AnchorStep;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleAnchorStepModule]
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

        it('has expected defaults for severity', () => {
            expect(directive.severity).toBe(AnchorStepSeverity.default);
            expect(nativeElement.severity).toBe(AnchorStepSeverity.default);
        });

        it('has expected defaults for severityText', () => {
            expect(directive.severityText).toBeUndefined();
            expect(nativeElement.severityText).toBeUndefined();
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('has expected defaults for readOnly', () => {
            expect(directive.readOnly).toBeFalse();
            expect(nativeElement.readOnly).toBeFalse();
        });

        it('has expected defaults for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-anchor-step #anchorStep
                    href="${href1}"
                    hreflang="${hreflang1}"
                    ping="${ping1}"
                    referrerpolicy="${referrerpolicy1}"
                    rel="${rel1}"
                    target="${target1}"
                    type="${type1}"
                    severity="error"
                    severity-text="${severityText1}"
                    disabled
                    readonly
                    selected
                    >
                </nimble-anchor-step>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('anchorStep', { read: NimbleAnchorStepDirective }) public directive: NimbleAnchorStepDirective;
            @ViewChild('anchorStep', { read: ElementRef }) public elementRef: ElementRef<AnchorStep>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleAnchorStepDirective;
        let nativeElement: AnchorStep;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleAnchorStepModule]
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

        it('will use template string values for severity', () => {
            expect(directive.severity).toBe(AnchorStepSeverity.error);
            expect(nativeElement.severity).toBe(AnchorStepSeverity.error);
        });

        it('will use template string values for severityText', () => {
            expect(directive.severityText).toBe(severityText1);
            expect(nativeElement.severityText).toBe(severityText1);
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for readOnly', () => {
            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('will use template string values for selected', () => {
            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-anchor-step #anchorStep
                    [href]="href"
                    [hreflang]="hreflang"
                    [ping]="ping"
                    [referrerpolicy]="referrerpolicy"
                    [rel]="rel"
                    [target]="target"
                    [type]="type"
                    [severity]="severity"
                    [severityText]="severityText"
                    [disabled]="disabled"
                    [readonly]="readonly"
                    [selected]="selected"
                    >
                </nimble-anchor-step>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('anchorStep', { read: NimbleAnchorStepDirective }) public directive: NimbleAnchorStepDirective;
            @ViewChild('anchorStep', { read: ElementRef }) public elementRef: ElementRef<AnchorStep>;
            public href = href1;
            public hreflang = hreflang1;
            public ping = ping1;
            public referrerpolicy = referrerpolicy1;
            public rel = rel1;
            public target = target1;
            public type = type1;
            public severity: AnchorStepSeverity = severity1;
            public severityText = severityText1;
            public disabled = false;
            public readonly = false;
            public selected = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleAnchorStepDirective;
        let nativeElement: AnchorStep;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleAnchorStepModule]
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

        it('can be configured with property binding for severity', () => {
            expect(directive.severity).toBe(severity1);
            expect(nativeElement.severity).toBe(severity1);

            fixture.componentInstance.severity = severity2;
            fixture.detectChanges();

            expect(directive.severity).toBe(severity2);
            expect(nativeElement.severity).toBe(severity2);
        });

        it('can be configured with property binding for severityText', () => {
            expect(directive.severityText).toBe(severityText1);
            expect(nativeElement.severityText).toBe(severityText1);

            fixture.componentInstance.severityText = severityText2;
            fixture.detectChanges();

            expect(directive.severityText).toBe(severityText2);
            expect(nativeElement.severityText).toBe(severityText2);
        });

        it('can be configured with property binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with property binding for readOnly', () => {
            expect(directive.readOnly).toBeFalse();
            expect(nativeElement.readOnly).toBeFalse();

            fixture.componentInstance.readonly = true;
            fixture.detectChanges();

            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('can be configured with property binding for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();

            fixture.componentInstance.selected = true;
            fixture.detectChanges();

            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-anchor-step #anchorStep
                    [attr.href]="href"
                    [attr.hreflang]="hreflang"
                    [attr.ping]="ping"
                    [attr.referrerpolicy]="referrerpolicy"
                    [attr.rel]="rel"
                    [attr.target]="target"
                    [attr.type]="type"
                    [attr.severity]="severity"
                    [attr.severity-text]="severityText"
                    [attr.disabled]="disabled"
                    [attr.readonly]="readOnly"
                    [attr.selected]="selected"
                    >
                </nimble-anchor-step>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('anchorStep', { read: NimbleAnchorStepDirective }) public directive: NimbleAnchorStepDirective;
            @ViewChild('anchorStep', { read: ElementRef }) public elementRef: ElementRef<AnchorStep>;
            public href = href1;
            public hreflang = hreflang1;
            public ping = ping1;
            public referrerpolicy = referrerpolicy1;
            public rel = rel1;
            public target = target1;
            public type = type1;
            public severity: AnchorStepSeverity = severity1;
            public severityText = severityText1;
            public disabled: BooleanValueOrAttribute = null;
            public readOnly: BooleanValueOrAttribute = null;
            public selected: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleAnchorStepDirective;
        let nativeElement: AnchorStep;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleAnchorStepModule]
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

        it('can be configured with attribute binding for severity', () => {
            expect(directive.severity).toBe(severity1);
            expect(nativeElement.severity).toBe(severity1);

            fixture.componentInstance.severity = severity2;
            fixture.detectChanges();

            expect(directive.severity).toBe(severity2);
            expect(nativeElement.severity).toBe(severity2);
        });

        it('can be configured with attribute binding for severityText', () => {
            expect(directive.severityText).toBe(severityText1);
            expect(nativeElement.severityText).toBe(severityText1);

            fixture.componentInstance.severityText = severityText2;
            fixture.detectChanges();

            expect(directive.severityText).toBe(severityText2);
            expect(nativeElement.severityText).toBe(severityText2);
        });

        it('can be configured with attribute binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = '';
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with attribute binding for readOnly', () => {
            expect(directive.readOnly).toBeFalse();
            expect(nativeElement.readOnly).toBeFalse();

            fixture.componentInstance.readOnly = '';
            fixture.detectChanges();

            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('can be configured with attribute binding for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();

            fixture.componentInstance.selected = '';
            fixture.detectChanges();

            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });
    });
});
