import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleRichTextMentionUsersModule } from '../../../rich-text-mention/users/nimble-rich-text-mention-users.module';
import { NimbleRichTextEditorModule } from '../../../rich-text/editor/nimble-rich-text-editor.module';
import { MappingUser, NimbleMappingUserDirective } from '../nimble-mapping-user.directive';
import { NimbleMappingUserModule } from '../nimble-mapping-user.module';

describe('NimbleMappingUser', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleMappingUserModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-mapping-user')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-rich-text-editor>
                    <nimble-rich-text-mention-users pattern="^user:(.*)">
                        <nimble-mapping-user #mapping></nimble-mapping-user>
                    </nimble-rich-text-mention-users>
                </nimble-rich-text-editor>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingUserDirective }) public directive: NimbleMappingUserDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingUser>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingUserDirective;
        let nativeElement: MappingUser;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingUserModule, NimbleRichTextMentionUsersModule, NimbleRichTextEditorModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for key', () => {
            expect(directive.key).toBeUndefined();
            expect(nativeElement.key).toBeUndefined();
        });

        it('will use template string values for display name', () => {
            expect(directive.displayName).toBeUndefined();
            expect(nativeElement.displayName).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor>
                    <nimble-rich-text-mention-users pattern="^user:(.*)">
                        <nimble-mapping-user
                            #mapping
                            key="user:1"
                            display-name="name"
                        >
                        </nimble-mapping-user>
                    </nimble-rich-text-mention-users>
                </nimble-rich-text-editor>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingUserDirective }) public directive: NimbleMappingUserDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingUser>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingUserDirective;
        let nativeElement: MappingUser;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingUserModule, NimbleRichTextMentionUsersModule, NimbleRichTextEditorModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for key', () => {
            expect(directive.key).toBe('user:1');
            expect(nativeElement.key).toBe('user:1');
        });

        it('will use template string values for display name', () => {
            expect(directive.displayName).toBe('name');
            expect(nativeElement.displayName).toBe('name');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor>
                    <nimble-rich-text-mention-users pattern="^user:(.*)">
                        <nimble-mapping-user
                            #mapping
                            [key]="key"
                            [displayName]="displayName"
                        >
                        </nimble-mapping-user>
                    </nimble-rich-text-mention-users>
                </nimble-rich-text-editor>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingUserDirective }) public directive: NimbleMappingUserDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingUser>;
            public key = 'user:1';
            public displayName = 'name';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingUserDirective;
        let nativeElement: MappingUser;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingUserModule, NimbleRichTextMentionUsersModule, NimbleRichTextEditorModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for key', () => {
            expect(directive.key).toBe('user:1');
            expect(nativeElement.key).toBe('user:1');

            fixture.componentInstance.key = 'user:2';
            fixture.detectChanges();

            expect(directive.key).toBe('user:2');
            expect(nativeElement.key).toBe('user:2');
        });

        it('can be configured with property binding for display name', () => {
            expect(directive.displayName).toBe('name');
            expect(nativeElement.displayName).toBe('name');

            fixture.componentInstance.displayName = 'name change';
            fixture.detectChanges();

            expect(directive.displayName).toBe('name change');
            expect(nativeElement.displayName).toBe('name change');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-rich-text-editor>
                    <nimble-rich-text-mention-users pattern="^user:(.*)">
                        <nimble-mapping-user
                            #mapping
                            [attr.key]="key"
                            [attr.display-name]="displayName"
                        >
                        </nimble-mapping-user>
                    </nimble-rich-text-mention-users>
                </nimble-rich-text-editor>
            `
        })
        class TestHostComponent {
            @ViewChild('mapping', { read: NimbleMappingUserDirective }) public directive: NimbleMappingUserDirective;
            @ViewChild('mapping', { read: ElementRef }) public elementRef: ElementRef<MappingUser>;
            public key = 'user:1';
            public displayName = 'name';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMappingUserDirective;
        let nativeElement: MappingUser;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMappingUserModule, NimbleRichTextMentionUsersModule, NimbleRichTextEditorModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for key', () => {
            expect(directive.key).toBe('user:1');
            expect(nativeElement.key).toBe('user:1');

            fixture.componentInstance.key = 'user:1';
            fixture.detectChanges();

            expect(directive.key).toBe('user:1');
            expect(nativeElement.key).toBe('user:1');
        });

        it('can be configured with attribute binding for display name', () => {
            expect(directive.displayName).toBe('name');
            expect(nativeElement.displayName).toBe('name');

            fixture.componentInstance.displayName = 'name change';
            fixture.detectChanges();

            expect(directive.displayName).toBe('name change');
            expect(nativeElement.displayName).toBe('name change');
        });
    });
});
