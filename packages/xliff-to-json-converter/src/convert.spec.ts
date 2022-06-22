import { xliff2Json } from './convert';
import { parseXliff } from './xliff-file';

describe('xliff2Json', () => {
    it('produces an object with language and translations', async () => {
        const xliffContents = `
          <?xml version="1.0" encoding="UTF-8"?>
          <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-DE">
              <body>
                <trans-unit id="2821179408673282599" datatype="html">
                  <source>Home</source><target state="final">Startseite</target>
                  <context-group purpose="location">
                    <context context-type="sourcefile">src/app/app.component.html</context>
                    <context context-type="linenumber">2</context>
                  </context-group>
                </trans-unit>
              </body>
            </file>
          </xliff>
        `;
        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(json.locale).toEqual('de-DE');
        expect(Object.keys(json.translations).length).toBe(1);
    });

    it('produces an object when given nothing to translate', async () => {
        const xliffContents = `
          <?xml version="1.0" encoding="UTF-8"?>
          <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-DE">
              <body>
              </body>
            </file>
          </xliff>
        `;
        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(json.locale).toBeTruthy();
        expect(json.translations).toEqual({});
    });

    it('can convert German translations', async () => {
        const xliffContents = `
          <?xml version="1.0" encoding="UTF-8"?>
          <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-DE">
              <body>
                <trans-unit id="7611487429832462405" datatype="html">
                  <source>Skipped</source><target state="final">Übersprungen</target>
                </trans-unit>
              </body>
            </file>
          </xliff>
        `;
        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(json.locale).toEqual('de-DE');
        expect(json.translations['7611487429832462405']).toEqual('Übersprungen');
    });

    it('can convert Japanese translations', async () => {
        const xliffContents = `
          <?xml version="1.0" encoding="UTF-8"?>
          <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="ja-JP">
              <body>
                <trans-unit id="3565480987415902267" datatype="html">
                  <source>Configure result display</source><target state="final">結果表示を構成</target>
                </trans-unit>
              </body>
            </file>
          </xliff>
        `;
        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(json.locale).toEqual('ja-JP');
        expect(json.translations['3565480987415902267']).toEqual('結果表示を構成');
    });

    it('can convert Chinese translations', async () => {
        const xliffContents = `
          <?xml version="1.0" encoding="UTF-8"?>
          <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="zh-CN">
              <body>
                <trans-unit id="3565480987415902267" datatype="html">
                  <source>Configure result display</source><target state="final">配置结果显示</target>
                </trans-unit>
              </body>
            </file>
          </xliff>
        `;
        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(json.locale).toEqual('zh-CN');
        expect(json.translations['3565480987415902267']).toEqual('配置结果显示');
    });

    it('can convert multiple trans-units', async () => {
        const xliffContents = `
          <?xml version="1.0" encoding="UTF-8"?>
          <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-DE">
              <body>
                <trans-unit id="2821179408673282599" datatype="html">
                  <source>Home</source><target state="final">Startseite</target>
                </trans-unit>
                <trans-unit id="1010646614677287028" datatype="html">
                  <source>Test Results</source><target state="translated">Testergebnisse</target>
                </trans-unit>
                <trans-unit id="6895361230905386532" datatype="html">
                  <source>Toggle navigation pane</source><target state="final">Navigationsbereich umschalten</target>
                </trans-unit>
              </body>
            </file>
          </xliff>
        `;
        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(3);
        expect(json.translations['2821179408673282599']).toEqual('Startseite');
        expect(json.translations['1010646614677287028']).toEqual('Testergebnisse');
        expect(json.translations['6895361230905386532']).toEqual('Navigationsbereich umschalten');
    });

    it('can convert trans-unit with one context-group tag', async () => {
        const xliffContents = `
          <?xml version="1.0" encoding="UTF-8"?>
          <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-DE">
              <body>
                <trans-unit id="2821179408673282599" datatype="html">
                    <source>Home</source><target state="final">Startseite</target>
                    <context-group purpose="location">
                        <context context-type="sourcefile">src/app/app.component.html</context>
                        <context context-type="linenumber">2</context>
                    </context-group>
                </trans-unit>
              </body>
            </file>
          </xliff>
          `;

        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(1);
        expect(json.translations['2821179408673282599']).toEqual('Startseite');
    });

    it('can convert trans-unit with multiple context-group tags', async () => {
        const xliffContents = `
          <?xml version="1.0" encoding="UTF-8"?>
          <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-DE">
              <body>
                <trans-unit id="2821179408673282599" datatype="html">
                    <source>Home</source><target state="final">Startseite</target>
                    <context-group purpose="location">
                        <context context-type="sourcefile">src/app/app.component.html</context>
                        <context context-type="linenumber">2</context>
                    </context-group>
                    <context-group purpose="location">
                        <context context-type="sourcefile">node_modules/projects/systemlink-lib-angular/swif-header/src/services/sl-navigation-data.service.ts</context>
                        <context context-type="linenumber">97,94</context>
                    </context-group>
                </trans-unit>
              </body>
            </file>
          </xliff>
          `;

        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(1);
        expect(json.translations['2821179408673282599']).toEqual('Startseite');
    });

    it('can convert trans-unit with one placeholder tag', async () => {
        const xliffContents = `
        <?xml version="1.0" encoding="UTF-8"?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-DE">
            <body>
                <trans-unit id="7640416587392187464" datatype="html">
                    <source><x id="INTERPOLATION" equiv-text="{{count}}" /> selected</source>
                    <target state="final"><x id="INTERPOLATION" equiv-text="{{count}}"/> 選択済み</target>
                </trans-unit>
            </body>
            </file>
        </xliff>
        `;

        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(1);
        expect(json.translations['7640416587392187464']).toEqual('{$INTERPOLATION} 選択済み');
    });

    it('can convert trans-unit with multiple placeholder tags', async () => {
        const xliffContents = `
        <?xml version="1.0" encoding="UTF-8"?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-DE">
            <body>
                <trans-unit id="5478462691360784268" datatype="html">
                    <source><x id="PH" equiv-text="fileName1"/>, <x id="PH_1" equiv-text="fileName2"/> + 1 other</source>
                    <target state="final"><x id="PH" equiv-text="fileName1"/>, <x id="PH_1" equiv-text="fileName2"/> + 1 weitere</target>
                </trans-unit>
            </body>
            </file>
        </xliff>
        `;

        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(1);
        expect(json.translations['5478462691360784268']).toEqual('{$PH}, {$PH_1} + 1 weitere');
    });

    it('can convert trans-unit with custom % placeholders', async () => {
        const xliffContents = `
        <?xml version="1.0" encoding="UTF-8"?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="zh-CN">
            <body>
                <trans-unit id="991813115201037469" datatype="html">
                    <source>The request for test results failed with error code %0 - %5</source>
                    <target state="final">Die Anfrage nach Testergebnissen ist mit Fehlercode %0 - %5 fehlgeschlagen.</target>
                </trans-unit>
            </body>
            </file>
        </xliff>
        `;

        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(1);
        expect(json.translations['991813115201037469']).toEqual('Die Anfrage nach Testergebnissen ist mit Fehlercode %0 - %5 fehlgeschlagen.');
    });

    it('can convert trans-units with same source but different meaning', async () => {
        const xliffContents = `
        <?xml version="1.0" encoding="UTF-8"?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="zh-CN">
            <body>
                <trans-unit id="3901373595938802624" datatype="html">
                    <source>Operator</source>
                    <target state="translated">操作员</target>
                    <note from="meaning" priority="3">a person operating a test</note>
                </trans-unit>
                <trans-unit id="1179184907489210406" datatype="html">
                    <source>Operator</source>
                    <target state="final">运算符</target>
                </trans-unit>
            </body>
            </file>
        </xliff>
        `;

        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(2);
        expect(json.translations['3901373595938802624']).toEqual('操作员');
        expect(json.translations['1179184907489210406']).toEqual('运算符');
    });

    it('can convert trans-unit with escaped characters', async () => {
        const xliffContents = `
        <?xml version="1.0" encoding="UTF-8"?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="zh-CN">
            <body>
                <trans-unit id="652598044198866766" datatype="html">
                    <source>&lt;i>Not available&lt;/i></source>
                    <target state="final">&lt;i>Nicht verfügbar&lt;/i></target>
                </trans-unit>
            </body>
            </file>
        </xliff>
        `;

        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(1);
        expect(json.translations['652598044198866766']).toEqual('<i>Nicht verfügbar</i>');
    });

    it('can convert trans-unit with <br>', async () => {
        const xliffContents = `
        <?xml version="1.0" encoding="UTF-8"?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="en-US">
            <body>
            <trans-unit id="2406462800948436519" datatype="html">
              <source>Drag files here<x id="LINE_BREAK"/>or</source>
              <target>Drag files here<x id="LINE_BREAK"/>or</target>
            </trans-unit>
            </body>
            </file>
        </xliff>
        `;

        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(1);
        expect(json.translations['2406462800948436519']).toEqual('Drag files here{$LINE_BREAK}or');
    });

    it('can convert trans-unit with HTML content', async () => {
        const xliffContents = `
        <?xml version="1.0" encoding="UTF-8"?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="en-US">
            <body>
              <trans-unit id="7325635296562624358" datatype="html">
                <source>Drag files here or <x id="START_TAG_BUTTON"/><x id="START_UNDERLINED_TEXT"/>browse<x id="CLOSE_UNDERLINED_TEXT"/><x id="CLOSE_TAG_BUTTON"/>.</source>
                <target>Drag files here or <x id="START_TAG_BUTTON"/><x id="START_UNDERLINED_TEXT"/>browse<x id="CLOSE_UNDERLINED_TEXT"/><x id="CLOSE_TAG_BUTTON"/>.</target>
              </trans-unit>
            </body>
            </file>
        </xliff>
        `;

        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(1);
        expect(json.translations['7325635296562624358']).toEqual('Drag files here or {$START_TAG_BUTTON}{$START_UNDERLINED_TEXT}browse{$CLOSE_UNDERLINED_TEXT}{$CLOSE_TAG_BUTTON}.');
    });

    it('omits trans-unit without a target translation', async () => {
        const xliffContents = `
        <?xml version="1.0" encoding="UTF-8"?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="zh-CN">
            <body>
                <trans-unit id="652598044198866766" datatype="html">
                    <source>Not translated yet</source>
                </trans-unit>
            </body>
            </file>
        </xliff>
        `;

        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(0);
    });

    it('omits trans-unit without not-yet-translated target translation', async () => {
        const xliffContents = `
        <?xml version="1.0" encoding="UTF-8"?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="zh-CN">
            <body>
                <trans-unit id="652598044198866766" datatype="html">
                    <source>Translate me!</source>
                    <target state="new"/>
                </trans-unit>
            </body>
            </file>
        </xliff>
        `;

        const xliff = await parseXliff(xliffContents);
        const json = xliff2Json(xliff);

        expect(Object.keys(json.translations).length).toEqual(0);
    });
});
