/* eslint-disable */
import { Schema, NodeSpec, MarkSpec, DOMOutputSpec } from '@tiptap/pm/model';

const pDOM: DOMOutputSpec = ['p', 0],
  brDOM: DOMOutputSpec = ['br'];

/// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
  /// NodeSpec The top level document node.
  doc: {
    content: 'block+',
  } as NodeSpec,

  /// The text node.
  text: {
    group: 'inline',
  } as NodeSpec,

  /// A plain paragraph textblock. Represented in the DOM
  /// as a `<p>` element.
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return pDOM;
    },
  } as NodeSpec,

  ordered_list: {
    content: 'list_item+',
    group: 'block',
    attrs: { order: { default: 1 }, tight: { default: false } },
    parseDOM: [
      {
        tag: 'ol',
        getAttrs(dom) {
          return {
            order: (dom as HTMLElement).hasAttribute('start')
              ? +(dom as HTMLElement).getAttribute('start')!
              : 1,
            tight: (dom as HTMLElement).hasAttribute('data-tight'),
          };
        },
      },
    ],
    toDOM(node) {
      return [
        'ol',
        {
          start: node.attrs['order'] == 1 ? null : node.attrs['order'],
          'data-tight': node.attrs['tight'] ? 'true' : null,
        },
        0,
      ];
    },
  } as NodeSpec,

  bullet_list: {
    content: 'list_item+',
    group: 'block',
    attrs: { tight: { default: false } },
    parseDOM: [
      {
        tag: 'ul',
        getAttrs: (dom) => ({
          tight: (dom as HTMLElement).hasAttribute('data-tight'),
        }),
      },
    ],
    toDOM(node) {
      return ['ul', { 'data-tight': node.attrs['tight'] ? 'true' : null }, 0];
    },
  } as NodeSpec,

  list_item: {
    content: 'paragraph block*',
    defining: true,
    parseDOM: [{ tag: 'li' }],
    toDOM() {
      return ['li', 0];
    },
  } as NodeSpec,

  /// An inline image (`<img>`) node. Supports `src`,
  /// `alt`, and `href` attributes. The latter two default to the empty
  /// string.
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null },
    },
    group: 'inline',
    draggable: true,
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs(dom: HTMLElement) {
          return {
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
          };
        },
      },
    ],
    toDOM(node) {
      let { src, alt, title } = node.attrs;
      return ['img', { src, alt, title }];
    },
  } as NodeSpec,

  /// A hard line break, represented in the DOM as `<br>`.
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return brDOM;
    },
  } as NodeSpec,

  /// A custom node for adding mentioned users to DOM,
  /// represented in the DOM as `<span>` with the attribute
  ///u serid and content username
  mention: {
    attrs: {
      datatype: { default: 'mention' },
      dataid: { default: '' },
      datalabel: { default: '' },
      contentEditable: { default: false },
    },
    inline: true,
    group: 'inline',
    content: 'inline*',
    parseDOM: [
      {
        tag: 'span',
        getAttrs(dom: HTMLElement) {
          // console.log(dom);
          return {
            datatype: dom.getAttribute('datatype'),
            dataid: dom.getAttribute('data-id'),
            datalabel: dom.getAttribute('data-label'),
          };
        },
      },
    ],
    toDOM(node) {
      let { datatype, dataid, datalabel, contentEditable } = node.attrs;
      // console.log(node);
      return [
        'span',
        {
          'data-type': 'mention',
          'data-id': dataid,
          'data-label': datalabel,
          contentEditable,
          class: 'my-custom-class',
        },
        0,
      ];
    },
  } as NodeSpec,
};

const emDOM: DOMOutputSpec = ['em', 0],
  strongDOM: DOMOutputSpec = ['strong', 0],
  underlineDOM: DOMOutputSpec = ['u', 0],
  strikethroughDOM: DOMOutputSpec = ['s', 0],
  codeDOM: DOMOutputSpec = ['code', 0];

/// [Specs](#model.MarkSpec) for the marks in the schema.
export const marks = {
  /// A link. Has `href` and `title` attributes. `title`
  /// defaults to the empty string. Rendered and parsed as an `<a>`
  /// element.
  link: {
    attrs: {
      href: {},
      title: { default: null },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs(dom: HTMLElement) {
          return {
            href: dom.getAttribute('href'),
            title: dom.getAttribute('title'),
          };
        },
      },
    ],
    toDOM(node) {
      let { href, title } = node.attrs;
      return ['a', { href, title }, 0];
    },
  } as MarkSpec,
  em: {
    parseDOM: [
      { tag: 'i' },
      { tag: 'em' },
      { style: 'font-style=italic' },
      { style: 'font-style=normal', clearMark: (m) => m.type.name == 'em' },
    ],
    toDOM() {
      return emDOM;
    },
  } as MarkSpec,

  /// A strong mark. Rendered as `<strong>`, parse rules also match
  /// `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [
      { tag: 'strong' },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      {
        tag: 'b',
        getAttrs: (node: HTMLElement) =>
          node.style.fontWeight != 'normal' && null,
      },
      { style: 'font-weight=400', clearMark: (m) => m.type.name == 'strong' },
      {
        style: 'font-weight',
        getAttrs: (value: string) =>
          /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
      },
    ],
    toDOM() {
      return strongDOM;
    },
  } as MarkSpec,

  underline: {
    parseDOM: [
      { tag: 'u' },
      { style: 'text-decoration=underline' },
      {
        style: 'text-decoration=none',
        clearMark: (m) => m.type.name == 'underline',
      },
    ],
    toDOM() {
      return underlineDOM;
    },
  } as MarkSpec,

  strikethrough: {
    parseDOM: [
      { tag: 's' },
      { style: 'text-decoration=line-through' },
      {
        style: 'text-decoration=none',
        clearMark: (m) => m.type.name == 'strikethrough',
      },
    ],
    toDOM() {
      return strikethroughDOM;
    },
  } as MarkSpec,
};

/// This schema roughly corresponds to the document schema used by
/// [CommonMark](http://commonmark.org/), minus the list elements,
/// which are defined in the [`prosemirror-schema-list`](#schema-list)
/// module.
///
/// To reuse elements from this schema, extend or read from its
/// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
export const modifiedSchema = new Schema({ nodes, marks });
