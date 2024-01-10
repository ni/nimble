import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { checkboxTag } from '../../checkbox';
import { textFieldTag } from '../../text-field';
import { numberFieldTag } from '../../number-field';
import { radioTag } from '../../radio';
import { radioGroupTag } from '../../radio-group';
import { selectTag } from '../../select';
import { textAreaTag } from '../../text-area';
import { buttonTag } from '../../button';
import { listOptionTag } from '../../list-option';
import { anchorTag } from '../../anchor';
import '../../../dist/reboot.css';

const metadata: Meta = {
    title: 'Tokens/Reboot CSS',
    parameters: {
        docs: {
            toc: {
                disable: true // 👈 Supposed to disable the table of contents… but doesn't seem to work.
            }
        }
    }
};

export default metadata;

export const textElements: StoryObj = {
    render: createUserSelectedThemeStory(html`
        <h1>
            Heading 1 example
            <sub>[<${anchorTag} href="example.com">2</${anchorTag}>]</sub>
        </h1>
        <h2>Heading 2 example</h2>
        <h3>Heading 3 example</h3>
        <h4>Heading 4 example</h4>
        <h5>Heading 5 example</h5>
        <h6>Heading 6 example</h6>

        <p>
            This is a paragraph. This is a
            <${anchorTag} href="example.com">link</${anchorTag}>. Lorem ipsum,
            dolor sit amet consectetur adipisicing elit. Dicta corrupti
            asperiores dignissimos doloribus. Nisi repellat quidem cum! Eius quo
            reprehenderit quas aut quae, temporibus distinctio esse harum
            maiores ipsum fugiat?
        </p>
        <p>
            Another paragraph. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Accusantium quisquam quaerat, magni minus
            dignissimos ullam voluptatibus esse possimus corrupti excepturi, ut
            necessitatibus, ipsum ipsa beatae repudiandae adipisci eius at?
            Nostrum!
        </p>

        <blockquote>
            Blockquote: Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Harum, dolorum. Quasi quas quod adipisci odio maiores sapiente
            fuga voluptas qui, harum est. Nulla natus tenetur a repudiandae,
            voluptatibus incidunt praesentium?
        </blockquote>

        <p>
            You'll shoot your eye out with that
            <abbr title="Light amplification by stimulated emission of radiation">LASER</abbr>, kid.
        </p>

        <dl>
            <dt>Definition Term 1</dt>
            <dd>Definition Description 1</dd>
            <dt>Definition Term 2</dt>
            <dd>Definition Description 2</dd>
            <dt>Definition Term 3</dt>
            <dd>Definition Description 3</dd>
        </dl>

        <pre>
        ▄▄    ▄ ▄▄▄ ▄▄   ▄▄ ▄▄▄▄▄▄▄ ▄▄▄     ▄▄▄▄▄▄▄ 
        █  █  █ █   █  █▄█  █  ▄    █   █   █       █
        █   █▄█ █   █       █ █▄█   █   █   █    ▄▄▄█
        █       █   █       █       █   █   █   █▄▄▄ 
        █  ▄    █   █       █  ▄   ██   █▄▄▄█    ▄▄▄█
        █ █ █   █   █ ██▄██ █ █▄█   █       █   █▄▄▄ 
        █▄█  █▄▄█▄▄▄█▄█   █▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█
        </pre>

        <p>Some <b>bold</b> and <strong>strong</strong> text.</p>
        <p>
            Also, as Shakespeare says in "Hamlet": "To be, or not to be: that is
            the <mark>question</mark>."
        </p>
        <p>Some <i>italic</i> and <em>emphasized</em> text.</p>
        <p>Some <u>underlined</u> text.</p>
        <p>Some <s>strikethrough</s> text.</p>
        <p>Some <code>code</code> text.</p>
        <p>Some keyboard input <kbd>Ctrl-K</kbd> text.</p>
        <p>Some <samp>sample output</samp> text.</p>
        <p>Some <var>variable</var> text.</p>
        <p>Some <sub>subscript</sub> text.</p>
        <p>Some <sup>superscript</sup> text.</p>
        <p>Some <small>small</small> text.</p>
        <p>Some <cite>citation</cite> text.</p>
        <p>Some <q>quote</q> text.</p>
        <p>Some <dfn>definition</dfn> text.</p>
        <p>Some <abbr title="Abbreviation">abbr</abbr> text.</p>
        <p>Some <mark>marked</mark> text.</p>
        <p>
            Some <ruby>漢字<rt>かんじ</rt></ruby> text.
        </p>
        <ul>
            <li>List item 1</li>
            <li>List item 2</li>
            <li>List item 3</li>
        </ul>
        <ol>
            <li>Ordered List item 1</li>
            <li>Ordered List item 2</li>
            <li>Ordered List item 3</li>
        </ol>
        <p>Some variables: <var>y = mx + b</var></p>
        <p>
            <details open>
                <summary>Overview</summary>
                <ol>
                    <li>Cash on hand: $500.00</li>
                    <li>Current invoice: $75.30</li>
                    <li>Due date: 5/6/19</li>
                </ol>
            </details>
        </p>
    `)
};

export const formElements: StoryObj = {
    render: createUserSelectedThemeStory(html`

<form>
    <fieldset>
        <legend>Choose your favorite fruit</legend>
        <${radioGroupTag} orientation="vertical" name="fruit" value="none">
            <label slot="label">Fruit</label>
            <${radioTag} value="apple">Apple</${radioTag}>
            <${radioTag} value="mango">Mango</${radioTag}>
            <${radioTag} value="orange">Orange</${radioTag}>
        </${radioGroupTag}>
    </fieldset>
</form>
<form>
    <${textFieldTag} placeholder="Example text input">Text Input</${textFieldTag}>
    <${textFieldTag} placeholder="john.doe@ni.com" type="email">Email Input</${textFieldTag}>
    <${textFieldTag} placeholder="Enter password" type="password">Password Input</${textFieldTag}>
    <${numberFieldTag} placeholder="123.123" type="number">Number Input</${numberFieldTag}>

    <label for="date-input">Date Input</label>
    <input type="date" id="date-input" name="date-input" />

    <br /><br />
    <label for="datetime-input">Date/Time Input</label>
    <input type="datetime-local" id="datetime-input" name="datetime-input" />
    <br /><br />

    <label for="time-input">Time Input</label>
    <input type="time" id="time-input" name="time-input" />
    <br /><br />

    <label for="week-input">Week Input</label>
    <input type="week" id="week-input" name="week-input" />
    <br /><br />

    <${checkboxTag}>Checkbox</${checkboxTag}>
    <${checkboxTag}>Checkbox</${checkboxTag}>

    <label>Select Input</label>
    <${selectTag}>
        <${listOptionTag} value="option1">Option 1</${listOptionTag}>
        <${listOptionTag} value="option2">Option 2</${listOptionTag}>
        <${listOptionTag} value="option3">Option 3</${listOptionTag}>
    </${selectTag}>
    <br />

    <${textAreaTag} placeholder="Enter text">Textarea Input</${textAreaTag}>
    <${buttonTag}>Submit</${buttonTag}>
</form>
`)
};

export const miscElements: StoryObj = {
    render: createUserSelectedThemeStory(html`
        <figure>
            <img
                src="https://nimble.ni.dev/assets/nimble-ui-logo-aca5094f.svg"
                width="300px"
                alt="The beautiful Nimble logo."
            />
            <figcaption>Nimble Logo</figcaption>
        </figure>
    `)
};
